import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Challenge, ChallengeDocument } from '../schema/challenge.schema';
import { Community, CommunityDocument } from '../schema/community.schema';
import { User, UserDocument } from '../schema/user.schema';
import { CreateChallengeDto } from '../dto-challenge/create-challenge.dto';
import { UpdateChallengeDto } from '../dto-challenge/update-challenge.dto';
import {
  JoinChallengeDto,
  LeaveChallengeDto,
  UpdateProgressDto,
  CreateChallengePostDto,
  CreateChallengeCommentDto,
} from '../dto-challenge/join-challenge.dto';
import {
  ChallengeResponseDto,
  ChallengeListResponseDto,
} from '../dto-challenge/challenge-response.dto';
import {
  CreateChallengePricingDto,
  UpdateChallengePricingDto,
  CalculateChallengePriceDto,
  ChallengePriceCalculationResponseDto,
  CheckChallengeAccessDto,
  ChallengeAccessResponseDto,
} from '../dto-challenge/challenge-pricing.dto';
import { ContentTrackingService } from '../common/services/content-tracking.service';
import { FeeService } from '../common/services/fee.service';
import { PolicyService } from '../common/services/policy.service';
import { TrackableContentType } from '../schema/content-tracking.schema';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
    @InjectModel(Community.name)
    private communityModel: Model<CommunityDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly trackingService: ContentTrackingService,
    private readonly feeService: FeeService,
    private readonly policyService: PolicyService,
  ) {}

  /**
   * Récupérer les participations de l'utilisateur aux défis
   */
  async getUserParticipations(
    userId: string,
    communitySlug?: string,
    status: string = 'all',
  ): Promise<any> {
    try {
      // Build query to find challenges where user is a participant
      let query: any = {
        'participants.userId': new Types.ObjectId(userId),
      };

      // Filter by community if provided
      if (communitySlug) {
        const community = await this.communityModel.findOne({
          slug: communitySlug,
        });
        if (community) {
          query.communityId = community._id;
        }
      }

      // Filter by status
      const now = new Date();
      if (status === 'active') {
        query.endDate = { $gte: now };
        query.isActive = true;
      } else if (status === 'completed') {
        query.endDate = { $lt: now };
      }

      const challenges = await this.challengeModel
        .find(query)
        .populate('creatorId', 'name email photo_profil avatar')
        .populate('communityId', 'name slug logo')
        .sort({ 'participants.joinedAt': -1 })
        .lean();

      // Transform data to include user-specific participation info
      const participations = challenges.map((challenge) => {
        const participant = challenge.participants?.find(
          (p) => p.userId?.toString() === userId,
        );

        // Calculate completed tasks
        const completedTasks = participant?.completedTasks?.length || 0;
        const totalTasks = challenge.tasks?.length || 0;
        const progress =
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          challengeId: challenge._id,
          challenge: {
            id: challenge._id,
            title: challenge.title,
            description: challenge.description,
            thumbnail: challenge.thumbnail || '/placeholder.svg',
            category: challenge.category || 'General',
            difficulty: challenge.difficulty || 'Intermediate',
            startDate: challenge.startDate,
            endDate: challenge.endDate,
            communityId: challenge.communityId,
            depositAmount: challenge.depositAmount || 0,
            completionReward: challenge.completionReward || 0,
            creator: challenge.creatorId,
          },
          joinedAt: participant?.joinedAt || new Date(),
          progress,
          completedTasks,
          totalTasks,
          isActive:
            participant?.isActive !== false &&
            new Date(challenge.endDate) >= now,
          lastActivityAt:
            participant?.lastActivityAt || participant?.joinedAt || new Date(),
        };
      });

      return {
        success: true,
        data: {
          participations,
          total: participations.length,
        },
      };
    } catch (error) {
      console.error('Error getting user participations:', error);
      throw new BadRequestException(
        'Erreur lors de la récupération des participations',
      );
    }
  }

  /**
   * Créer un nouveau défi
   */
  async create(
    createChallengeDto: CreateChallengeDto,
    creatorId: string,
  ): Promise<ChallengeResponseDto> {
    // Vérifier que la communauté existe
    const community = await this.communityModel.findOne({
      slug: createChallengeDto.communitySlug,
    });
    if (!community) {
      throw new NotFoundException('Communauté non trouvée');
    }

    // Vérifier que l'utilisateur est le créateur de la communauté
    if (community.createur?.toString() !== creatorId) {
      throw new ForbiddenException(
        'Seul le créateur de la communauté peut créer des défis',
      );
    }

    // Vérifier les dates
    const startDate = new Date(createChallengeDto.startDate);
    const endDate = new Date(createChallengeDto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException(
        'La date de début doit être antérieure à la date de fin',
      );
    }

    // Générer un ID unique pour le défi
    const challengeId = new Types.ObjectId().toString();

    // Gating: require active subscription to activate premium or active challenges
    const hasSub = await this.policyService.hasActiveSubscription(creatorId);
    if (
      !hasSub &&
      (createChallengeDto.isActive || createChallengeDto.isPremium)
    ) {
      throw new ForbiddenException(
        'Un abonnement actif est requis pour activer ou lancer un défi',
      );
    }

    // Créer le défi
    const challenge = new this.challengeModel({
      id: challengeId,
      title: createChallengeDto.title,
      description: createChallengeDto.description,
      communityId: community.id,
      creatorId: new Types.ObjectId(creatorId),
      startDate: startDate,
      endDate: endDate,
      isActive: createChallengeDto.isActive ?? true,
      depositAmount: createChallengeDto.depositAmount,
      maxParticipants: createChallengeDto.maxParticipants,
      completionReward: createChallengeDto.completionReward,
      topPerformerBonus: createChallengeDto.topPerformerBonus,
      streakBonus: createChallengeDto.streakBonus,
      category: createChallengeDto.category,
      difficulty: createChallengeDto.difficulty,
      duration: createChallengeDto.duration,
      thumbnail: createChallengeDto.thumbnail,
      notes: createChallengeDto.notes,
      resources: createChallengeDto.resources || [],
      tasks: createChallengeDto.tasks || [],
      // Configuration de prix
      pricing: {
        participationFee: createChallengeDto.participationFee || 0,
        currency: createChallengeDto.currency || 'USD',
        depositAmount: createChallengeDto.depositAmount,
        depositRequired: createChallengeDto.depositRequired || false,
        completionReward: createChallengeDto.completionReward,
        topPerformerBonus: createChallengeDto.topPerformerBonus,
        streakBonus: createChallengeDto.streakBonus,
        isPremium: createChallengeDto.isPremium || false,
        premiumFeatures: {
          personalMentoring:
            createChallengeDto.premiumFeatures?.personalMentoring || false,
          exclusiveResources:
            createChallengeDto.premiumFeatures?.exclusiveResources || false,
          priorityFeedback:
            createChallengeDto.premiumFeatures?.priorityFeedback || false,
          certificate: createChallengeDto.premiumFeatures?.certificate || false,
          liveSessions:
            createChallengeDto.premiumFeatures?.liveSessions || false,
          communityAccess:
            createChallengeDto.premiumFeatures?.communityAccess || false,
        },
        paymentOptions: {
          allowInstallments:
            createChallengeDto.paymentOptions?.allowInstallments || false,
          installmentCount: createChallengeDto.paymentOptions?.installmentCount,
          earlyBirdDiscount:
            createChallengeDto.paymentOptions?.earlyBirdDiscount,
          groupDiscount: createChallengeDto.paymentOptions?.groupDiscount,
          memberDiscount: createChallengeDto.paymentOptions?.memberDiscount,
        },
        freeTrialDays: createChallengeDto.freeTrialDays,
        trialFeatures: createChallengeDto.trialFeatures || [],
      },
    });

    const savedChallenge = await challenge.save();
    return this.transformToResponseDto(savedChallenge, community);
  }

  /**
   * Récupérer tous les défis avec pagination et filtres
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    communitySlug?: string,
    category?: string,
    difficulty?: string,
    isActive?: boolean,
  ): Promise<ChallengeListResponseDto> {
    const query: any = {};

    // Filtres
    if (communitySlug) {
      const community = await this.communityModel.findOne({
        slug: communitySlug,
      });
      if (community) {
        query.communityId = community.id;
      }
    }

    if (category) {
      query.category = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    // Pagination
    const skip = (page - 1) * limit;

    const [challenges, total] = await Promise.all([
      this.challengeModel
        .find(query)
        .populate('creatorId', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.challengeModel.countDocuments(query),
    ]);

    // Récupérer les communautés pour chaque défi
    const communityIds = [...new Set(challenges.map((c) => c.communityId))];
    const communities = await this.communityModel.find({
      id: { $in: communityIds },
    });

    const challengeResponses = await Promise.all(
      challenges.map((challenge) => {
        const community = communities.find(
          (c) => c.id === challenge.communityId,
        );
        return this.transformToResponseDto(challenge, community || undefined);
      }),
    );

    return {
      challenges: challengeResponses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Récupérer un défi par son ID
   */
  async findOne(id: string): Promise<ChallengeResponseDto> {
    const challenge = await this.challengeModel
      .findOne({ id })
      .populate('creatorId', 'name email avatar')
      .exec();

    if (!challenge) {
      throw new NotFoundException('Défi non trouvé');
    }

    const community = await this.communityModel.findOne({
      id: challenge.communityId,
    });
    if (!community) {
      throw new NotFoundException('Communauté non trouvée');
    }

    return this.transformToResponseDto(challenge, community || undefined);
  }

  /**
   * Récupérer les défis d'une communauté
   */
  async findByCommunity(
    communitySlug: string,
  ): Promise<ChallengeResponseDto[]> {
    const community = await this.communityModel.findOne({
      slug: communitySlug,
    });
    if (!community) {
      throw new NotFoundException('Communauté non trouvée');
    }

    const challenges = await this.challengeModel
      .find({ communityId: community.id })
      .populate('creatorId', 'name email avatar')
      .sort({ createdAt: -1 })
      .exec();

    return Promise.all(
      challenges.map((challenge) =>
        this.transformToResponseDto(challenge, community),
      ),
    );
  }

  /**
   * Mettre à jour un défi
   */
  async update(
    id: string,
    updateChallengeDto: UpdateChallengeDto,
    userId: string,
  ): Promise<ChallengeResponseDto> {
    const challenge = await this.challengeModel.findOne({ id });
    if (!challenge) {
      throw new NotFoundException('Défi non trouvé');
    }

    // Vérifier que l'utilisateur est le créateur du défi
    if (challenge.creatorId.toString() !== userId) {
      throw new ForbiddenException('Seul le créateur du défi peut le modifier');
    }

    // Vérifier les dates si elles sont fournies
    if (updateChallengeDto.startDate && updateChallengeDto.endDate) {
      const startDate = new Date(updateChallengeDto.startDate);
      const endDate = new Date(updateChallengeDto.endDate);

      if (startDate >= endDate) {
        throw new BadRequestException(
          'La date de début doit être antérieure à la date de fin',
        );
      }
    }

    // Mettre à jour le défi
    Object.assign(challenge, updateChallengeDto);

    if (updateChallengeDto.startDate) {
      challenge.startDate = new Date(updateChallengeDto.startDate);
    }
    if (updateChallengeDto.endDate) {
      challenge.endDate = new Date(updateChallengeDto.endDate);
    }

    const updatedChallenge = await challenge.save();

    const community = await this.communityModel.findOne({
      id: challenge.communityId,
    });
    return this.transformToResponseDto(updatedChallenge, community);
  }

  /**
   * Supprimer un défi
   */
  async remove(id: string, userId: string): Promise<void> {
    const challenge = await this.challengeModel.findOne({ id });
    if (!challenge) {
      throw new NotFoundException('Défi non trouvé');
    }

    // Vérifier que l'utilisateur est le créateur du défi
    if (challenge.creatorId.toString() !== userId) {
      throw new ForbiddenException(
        'Seul le créateur du défi peut le supprimer',
      );
    }

    await this.challengeModel.deleteOne({ id });
  }

  /**
   * Rejoindre un défi
   */
  async joinChallenge(
    joinChallengeDto: JoinChallengeDto,
    userId: string,
  ): Promise<ChallengeResponseDto> {
    const challenge = await this.challengeModel.findOne({
      id: joinChallengeDto.challengeId,
    });
    if (!challenge) {
      throw new NotFoundException('Défi non trouvé');
    }

    // Vérifier que le défi est actif
    if (!challenge.isActive) {
      throw new BadRequestException("Ce défi n'est plus actif");
    }

    // Vérifier que le défi n'a pas encore commencé ou est en cours
    const now = new Date();
    if (now > challenge.endDate) {
      throw new BadRequestException('Ce défi est terminé');
    }

    // Vérifier le nombre maximum de participants
    if (
      challenge.maxParticipants &&
      challenge.participants.length >= challenge.maxParticipants
    ) {
      throw new BadRequestException(
        'Le nombre maximum de participants est atteint',
      );
    }

    // Vérifier que l'utilisateur n'est pas déjà participant
    if (challenge.isParticipant(new Types.ObjectId(userId))) {
      throw new BadRequestException('Vous êtes déjà participant à ce défi');
    }

    // Si participation payante, créer un order avec fees
    const price = challenge.pricing?.participationFee || 0;
    if (price > 0) {
      const breakdown = await this.feeService.calculateForAmount(
        price,
        challenge.creatorId.toString(),
      );
      await (this.challengeModel as any).db.model('Order').create({
        buyerId: new Types.ObjectId(userId),
        creatorId: challenge.creatorId,
        contentType: TrackableContentType.CHALLENGE,
        contentId: challenge._id.toString(),
        amountDT: breakdown.amountDT,
        platformPercent: breakdown.platformPercent,
        platformFixedDT: breakdown.platformFixedDT,
        platformFeeDT: breakdown.platformFeeDT,
        creatorNetDT: breakdown.creatorNetDT,
        status: 'paid',
      });
    }

    // Ajouter le participant
    challenge.addParticipant(new Types.ObjectId(userId));
    await challenge.save();

    const community = await this.communityModel.findOne({
      id: challenge.communityId,
    });
    return this.transformToResponseDto(challenge, community || undefined);
  }

  /**
   * Quitter un défi
   */
  async leaveChallenge(
    leaveChallengeDto: LeaveChallengeDto,
    userId: string,
  ): Promise<ChallengeResponseDto> {
    const challenge = await this.challengeModel.findOne({
      id: leaveChallengeDto.challengeId,
    });
    if (!challenge) {
      throw new NotFoundException('Défi non trouvé');
    }

    // Vérifier que l'utilisateur est participant
    if (!challenge.isParticipant(new Types.ObjectId(userId))) {
      throw new BadRequestException("Vous n'êtes pas participant à ce défi");
    }

    // Supprimer le participant
    challenge.removeParticipant(new Types.ObjectId(userId));
    await challenge.save();

    const community = await this.communityModel.findOne({
      id: challenge.communityId,
    });
    return this.transformToResponseDto(challenge, community || undefined);
  }

  /**
   * Mettre à jour le progrès d'un participant
   */
  async updateProgress(
    updateProgressDto: UpdateProgressDto,
    userId: string,
  ): Promise<ChallengeResponseDto> {
    const challenge = await this.challengeModel.findOne({
      id: updateProgressDto.challengeId,
    });
    if (!challenge) {
      throw new NotFoundException('Défi non trouvé');
    }

    // Vérifier que l'utilisateur est participant
    if (!challenge.isParticipant(new Types.ObjectId(userId))) {
      throw new BadRequestException("Vous n'êtes pas participant à ce défi");
    }

    // Trouver la tâche
    const task = challenge.tasks?.find(
      (t) => t.id === updateProgressDto.taskId,
    );
    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }

    // Mettre à jour le statut de la tâche
    if (updateProgressDto.status === 'completed') {
      task.isCompleted = true;
    } else if (updateProgressDto.status === 'in_progress') {
      task.isCompleted = false;
    } else {
      task.isCompleted = false;
    }

    // Mettre à jour le progrès du participant
    const participant = challenge.participants.find(
      (p) => p.userId.toString() === userId,
    );
    if (participant) {
      if (
        updateProgressDto.status === 'completed' &&
        !participant.completedTasks.includes(updateProgressDto.taskId)
      ) {
        participant.completedTasks.push(updateProgressDto.taskId);
        participant.totalPoints += task.points;
      } else if (
        updateProgressDto.status !== 'completed' &&
        participant.completedTasks.includes(updateProgressDto.taskId)
      ) {
        participant.completedTasks = participant.completedTasks.filter(
          (id) => id !== updateProgressDto.taskId,
        );
        participant.totalPoints = Math.max(
          0,
          participant.totalPoints - task.points,
        );
      }

      // Calculer le progrès en pourcentage
      participant.progress = Math.round(
        (participant.completedTasks.length / (challenge.tasks?.length || 1)) *
          100,
      );
      participant.lastActivityAt = new Date();
    }

    await challenge.save();

    const community = await this.communityModel.findOne({
      id: challenge.communityId,
    });
    return this.transformToResponseDto(challenge, community || undefined);
  }

  /**
   * Créer un post dans un défi
   */
  async createPost(
    challengeId: string,
    createPostDto: CreateChallengePostDto,
    userId: string,
  ): Promise<ChallengeResponseDto> {
    const challenge = await this.challengeModel.findOne({ id: challengeId });
    if (!challenge) {
      throw new NotFoundException('Défi non trouvé');
    }

    // Vérifier que l'utilisateur est participant
    if (!challenge.isParticipant(new Types.ObjectId(userId))) {
      throw new BadRequestException(
        'Seuls les participants peuvent créer des posts',
      );
    }

    const post = {
      id: new Types.ObjectId().toString(),
      content: createPostDto.content,
      images: createPostDto.images || [],
      userId: new Types.ObjectId(userId),
      likes: 0,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    challenge.addPost(post);
    await challenge.save();

    const community = await this.communityModel.findOne({
      id: challenge.communityId,
    });
    return this.transformToResponseDto(challenge, community || undefined);
  }

  /**
   * Commenter un post de défi
   */
  async commentPost(
    challengeId: string,
    postId: string,
    createCommentDto: CreateChallengeCommentDto,
    userId: string,
  ): Promise<ChallengeResponseDto> {
    const challenge = await this.challengeModel.findOne({ id: challengeId });
    if (!challenge) {
      throw new NotFoundException('Défi non trouvé');
    }

    // Vérifier que l'utilisateur est participant
    if (!challenge.isParticipant(new Types.ObjectId(userId))) {
      throw new BadRequestException('Seuls les participants peuvent commenter');
    }

    const post = challenge.posts.find((p) => p.id === postId);
    if (!post) {
      throw new NotFoundException('Post non trouvé');
    }

    const comment = {
      id: new Types.ObjectId().toString(),
      content: createCommentDto.content,
      userId: new Types.ObjectId(userId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    post.comments.push(comment);
    await challenge.save();

    const community = await this.communityModel.findOne({
      id: challenge.communityId,
    });
    return this.transformToResponseDto(challenge, community || undefined);
  }

  /**
   * Transformer un document Challenge en DTO de réponse
   */
  private async transformToResponseDto(
    challenge: ChallengeDocument,
    community?: CommunityDocument | null,
  ): Promise<ChallengeResponseDto> {
    // Récupérer les informations du créateur
    const creator = await this.userModel
      .findById(challenge.creatorId)
      .select('name email profile_picture');

    // Récupérer les informations des participants
    const participantUserIds = challenge.participants.map((p) => p.userId);
    const participantUsers = await this.userModel
      .find({ _id: { $in: participantUserIds } })
      .select('name email profile_picture');

    // Transformer les participants
    const participants = challenge.participants.map((participant) => {
      const user = participantUsers.find((u) =>
        u._id.equals(participant.userId),
      );
      return {
        id: participant.id,
        userId: participant.userId.toString(),
        userName: user?.name || 'Utilisateur inconnu',
        userAvatar: user?.profile_picture,
        joinedAt: participant.joinedAt.toISOString(),
        isActive: participant.isActive,
        progress: participant.progress,
        totalPoints: participant.totalPoints,
        completedTasks: participant.completedTasks,
        lastActivityAt: participant.lastActivityAt.toISOString(),
      };
    });

    // Transformer les posts
    const postUserIds = challenge.posts.map((p) => p.userId);
    const postUsers = await this.userModel
      .find({ _id: { $in: postUserIds } })
      .select('name email profile_picture');

    const posts = challenge.posts.map((post) => {
      const user = postUsers.find((u) => u._id.equals(post.userId));

      // Transformer les commentaires
      const commentUserIds = post.comments.map((c) => c.userId);
      const commentUsers = postUsers.filter((u) =>
        commentUserIds.some((id) => id.equals(u._id)),
      );

      const comments = post.comments.map((comment) => {
        const commentUser = commentUsers.find((u) =>
          u._id.equals(comment.userId),
        );
        return {
          id: comment.id,
          content: comment.content,
          userId: comment.userId.toString(),
          userName: commentUser?.name || 'Utilisateur inconnu',
          userAvatar: commentUser?.profile_picture,
          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.updatedAt.toISOString(),
        };
      });

      return {
        id: post.id,
        content: post.content,
        images: post.images,
        userId: post.userId.toString(),
        userName: user?.name || 'Utilisateur inconnu',
        userAvatar: user?.profile_picture,
        likes: post.likes,
        comments: comments,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      };
    });

    const now = new Date();
    const isOngoing =
      challenge.isActive &&
      challenge.startDate <= now &&
      challenge.endDate >= now;
    const isCompleted = challenge.endDate < now;

    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      communityId: challenge.communityId,
      communitySlug: community?.slug || '',
      creatorId: challenge.creatorId.toString(),
      creatorName: creator?.name || 'Créateur inconnu',
      creatorAvatar: creator?.profile_picture,
      startDate: challenge.startDate.toISOString(),
      endDate: challenge.endDate.toISOString(),
      isActive: challenge.isActive,
      participants: participants,
      posts: posts,
      createdAt: challenge.createdAt.toISOString(),
      updatedAt: challenge.updatedAt.toISOString(),
      depositAmount: challenge.depositAmount,
      maxParticipants: challenge.maxParticipants,
      completionReward: challenge.completionReward,
      topPerformerBonus: challenge.topPerformerBonus,
      streakBonus: challenge.streakBonus,
      category: challenge.category,
      difficulty: challenge.difficulty,
      duration: challenge.duration,
      thumbnail: challenge.thumbnail,
      notes: challenge.notes,
      resources: challenge.resources || [],
      tasks: (challenge.tasks || []).map((task) => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
      })),
      participantCount: challenge.participants.length,
      isOngoing: isOngoing,
      isCompleted: isCompleted,

      // Informations de pricing
      participationFee: challenge.pricing?.participationFee,
      currency: challenge.pricing?.currency,
      depositRequired: challenge.pricing?.depositRequired,
      isPremium: challenge.pricing?.isPremium,
      premiumFeatures: challenge.pricing?.premiumFeatures,
      paymentOptions: challenge.pricing?.paymentOptions,
      freeTrialDays: challenge.pricing?.freeTrialDays,
      trialFeatures: challenge.pricing?.trialFeatures,
      isFree: challenge.pricing
        ? challenge.pricing.participationFee === 0
        : true,
      finalPrice: challenge.pricing?.participationFee || 0,
    };
  }

  // ============= MÉTHODES DE PRICING =============

  /**
   * Mettre à jour la configuration de prix d'un défi
   */
  async updatePricing(
    challengeId: string,
    pricingDto: UpdateChallengePricingDto,
    userId: string,
  ): Promise<ChallengeResponseDto> {
    const challenge = await this.challengeModel.findOne({ id: challengeId });
    if (!challenge) {
      throw new NotFoundException('Défi non trouvé');
    }

    // Vérifier que l'utilisateur est le créateur du défi
    if (challenge.creatorId.toString() !== userId) {
      throw new ForbiddenException(
        'Seul le créateur du défi peut modifier la configuration de prix',
      );
    }

    // Mettre à jour la configuration de prix
    if (!challenge.pricing) {
      challenge.pricing = {
        participationFee: 0,
        currency: 'USD',
        depositRequired: false,
        isPremium: false,
        premiumFeatures: {
          personalMentoring: false,
          exclusiveResources: false,
          priorityFeedback: false,
          certificate: false,
          liveSessions: false,
          communityAccess: false,
        },
        paymentOptions: {
          allowInstallments: false,
        },
      };
    }

    // Mettre à jour les champs fournis
    if (pricingDto.participationFee !== undefined) {
      challenge.pricing.participationFee = pricingDto.participationFee;
    }
    if (pricingDto.currency !== undefined) {
      challenge.pricing.currency = pricingDto.currency;
    }
    if (pricingDto.depositAmount !== undefined) {
      challenge.pricing.depositAmount = pricingDto.depositAmount;
    }
    if (pricingDto.depositRequired !== undefined) {
      challenge.pricing.depositRequired = pricingDto.depositRequired;
    }
    if (pricingDto.isPremium !== undefined) {
      challenge.pricing.isPremium = pricingDto.isPremium;
    }
    if (pricingDto.completionReward !== undefined) {
      challenge.pricing.completionReward = pricingDto.completionReward;
    }
    if (pricingDto.topPerformerBonus !== undefined) {
      challenge.pricing.topPerformerBonus = pricingDto.topPerformerBonus;
    }
    if (pricingDto.streakBonus !== undefined) {
      challenge.pricing.streakBonus = pricingDto.streakBonus;
    }
    if (pricingDto.premiumFeatures !== undefined) {
      challenge.pricing.premiumFeatures = {
        ...challenge.pricing.premiumFeatures,
        ...pricingDto.premiumFeatures,
      };
    }
    if (pricingDto.paymentOptions !== undefined) {
      challenge.pricing.paymentOptions = {
        ...challenge.pricing.paymentOptions,
        ...pricingDto.paymentOptions,
      };
    }
    if (pricingDto.freeTrialDays !== undefined) {
      challenge.pricing.freeTrialDays = pricingDto.freeTrialDays;
    }
    if (pricingDto.trialFeatures !== undefined) {
      challenge.pricing.trialFeatures = pricingDto.trialFeatures;
    }

    const updatedChallenge = await challenge.save();
    const community = await this.communityModel.findOne({
      id: challenge.communityId,
    });

    return this.transformToResponseDto(
      updatedChallenge,
      community || undefined,
    );
  }

  /**
   * Calculer le prix d'un défi avec remises
   */
  async calculatePrice(
    calculatePriceDto: CalculateChallengePriceDto,
  ): Promise<ChallengePriceCalculationResponseDto> {
    const challenge = await this.challengeModel.findOne({
      id: calculatePriceDto.challengeId,
    });
    if (!challenge) {
      throw new NotFoundException('Défi non trouvé');
    }

    if (!challenge.pricing) {
      return {
        basePrice: 0,
        currency: 'USD',
        discountPercentage: 0,
        discountAmount: 0,
        finalPrice: 0,
        appliedDiscountType: 'none',
        isFree: true,
      };
    }

    const basePrice = challenge.pricing.participationFee;
    const currency = challenge.pricing.currency;
    let discountPercentage = 0;
    let appliedDiscountType = 'none';

    // Calculer les remises selon le type d'utilisateur
    if (calculatePriceDto.userType && challenge.pricing.paymentOptions) {
      switch (calculatePriceDto.userType) {
        case 'early-bird':
          discountPercentage =
            challenge.pricing.paymentOptions.earlyBirdDiscount || 0;
          appliedDiscountType = 'early-bird';
          break;
        case 'group':
          discountPercentage =
            challenge.pricing.paymentOptions.groupDiscount || 0;
          appliedDiscountType = 'group';
          break;
        case 'member':
          discountPercentage =
            challenge.pricing.paymentOptions.memberDiscount || 0;
          appliedDiscountType = 'member';
          break;
        default:
          discountPercentage = 0;
          appliedDiscountType = 'none';
      }
    }

    const discountAmount = (basePrice * discountPercentage) / 100;
    const finalPrice = basePrice - discountAmount;

    const result: ChallengePriceCalculationResponseDto = {
      basePrice,
      currency,
      discountPercentage,
      discountAmount,
      finalPrice,
      appliedDiscountType,
      isFree: basePrice === 0,
    };

    // Ajouter les informations sur le dépôt si applicable
    if (challenge.pricing.depositRequired && challenge.pricing.depositAmount) {
      result.depositAmount = challenge.pricing.depositAmount;
    }

    // Ajouter les informations sur les paiements échelonnés si applicable
    if (
      challenge.pricing.paymentOptions?.allowInstallments &&
      challenge.pricing.paymentOptions.installmentCount
    ) {
      result.installmentCount =
        challenge.pricing.paymentOptions.installmentCount;
      result.installmentAmount =
        finalPrice / challenge.pricing.paymentOptions.installmentCount;
    }

    return result;
  }

  /**
   * Vérifier l'accès d'un utilisateur à un défi
   */
  async checkAccess(
    checkAccessDto: CheckChallengeAccessDto,
  ): Promise<ChallengeAccessResponseDto> {
    const challenge = await this.challengeModel.findOne({
      id: checkAccessDto.challengeId,
    });
    if (!challenge) {
      throw new NotFoundException('Défi non trouvé');
    }

    const user = await this.userModel.findById(checkAccessDto.userId);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const isFree = challenge.isFreeChallenge();
    const hasPaid = false; // TODO: Implémenter la vérification du paiement

    let hasAccess = false;
    let reason = '';
    let trialDaysRemaining: number | undefined;

    if (isFree) {
      hasAccess = true;
      reason = 'Challenge is free';
    } else if (hasPaid) {
      hasAccess = true;
      reason = 'User has paid for challenge';
    } else if (
      challenge.pricing?.freeTrialDays &&
      challenge.pricing.freeTrialDays > 0
    ) {
      // Vérifier si l'utilisateur est dans la période d'essai
      const now = new Date();
      const trialEndDate = new Date(
        challenge.startDate.getTime() +
          challenge.pricing.freeTrialDays * 24 * 60 * 60 * 1000,
      );

      if (now <= trialEndDate) {
        hasAccess = true;
        reason = 'User is in free trial period';
        trialDaysRemaining = Math.ceil(
          (trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );
      } else {
        hasAccess = false;
        reason = 'Free trial period has expired';
      }
    } else {
      hasAccess = false;
      reason = 'User has not paid for challenge';
    }

    return {
      hasAccess,
      reason,
      isFree,
      hasPaid,
      trialDaysRemaining,
      trialFeatures: challenge.pricing?.trialFeatures,
      priceToPay: hasAccess ? undefined : challenge.pricing?.participationFee,
      currency: challenge.pricing?.currency,
    };
  }

  /**
   * Obtenir les défis gratuits
   */
  async findFreeChallenges(
    page: number = 1,
    limit: number = 10,
    communitySlug?: string,
  ): Promise<ChallengeListResponseDto> {
    const query: any = {
      $or: [
        { 'pricing.participationFee': 0 },
        { 'pricing.participationFee': { $exists: false } },
        { pricing: { $exists: false } },
      ],
    };

    if (communitySlug) {
      const community = await this.communityModel.findOne({
        slug: communitySlug,
      });
      if (community) {
        query.communityId = community.id;
      }
    }

    const skip = (page - 1) * limit;

    const [challenges, total] = await Promise.all([
      this.challengeModel
        .find(query)
        .populate('creatorId', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.challengeModel.countDocuments(query),
    ]);

    const communityIds = [...new Set(challenges.map((c) => c.communityId))];
    const communities = await this.communityModel.find({
      id: { $in: communityIds },
    });

    const challengeResponses = await Promise.all(
      challenges.map((challenge) => {
        const community = communities.find(
          (c) => c.id === challenge.communityId,
        );
        return this.transformToResponseDto(challenge, community || undefined);
      }),
    );

    return {
      challenges: challengeResponses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtenir les défis premium
   */
  async findPremiumChallenges(
    page: number = 1,
    limit: number = 10,
    communitySlug?: string,
  ): Promise<ChallengeListResponseDto> {
    const query: any = {
      'pricing.isPremium': true,
    };

    if (communitySlug) {
      const community = await this.communityModel.findOne({
        slug: communitySlug,
      });
      if (community) {
        query.communityId = community.id;
      }
    }

    const skip = (page - 1) * limit;

    const [challenges, total] = await Promise.all([
      this.challengeModel
        .find(query)
        .populate('creatorId', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.challengeModel.countDocuments(query),
    ]);

    const communityIds = [...new Set(challenges.map((c) => c.communityId))];
    const communities = await this.communityModel.find({
      id: { $in: communityIds },
    });

    const challengeResponses = await Promise.all(
      challenges.map((challenge) => {
        const community = communities.find(
          (c) => c.id === challenge.communityId,
        );
        return this.transformToResponseDto(challenge, community || undefined);
      }),
    );

    return {
      challenges: challengeResponses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ============ TRACKING METHODS ============

  /**
   * Enregistrer une vue d'un défi
   */
  async trackChallengeView(challengeId: string, userId: string) {
    return await this.trackingService.trackView(
      userId,
      challengeId,
      TrackableContentType.CHALLENGE,
    );
  }

  /**
   * Démarrer un défi
   */
  async trackChallengeStart(challengeId: string, userId: string) {
    return await this.trackingService.trackStart(
      userId,
      challengeId,
      TrackableContentType.CHALLENGE,
    );
  }

  /**
   * Marquer un défi comme terminé
   */
  async trackChallengeComplete(challengeId: string, userId: string) {
    return await this.trackingService.trackComplete(
      userId,
      challengeId,
      TrackableContentType.CHALLENGE,
    );
  }

  /**
   * Mettre à jour le temps de visionnage d'un défi
   */
  async updateChallengeWatchTime(
    challengeId: string,
    userId: string,
    additionalTime: number,
  ) {
    return await this.trackingService.updateWatchTime(
      userId,
      challengeId,
      TrackableContentType.CHALLENGE,
      additionalTime,
    );
  }

  /**
   * Enregistrer un like sur un défi
   */
  async trackChallengeLike(challengeId: string, userId: string) {
    return await this.trackingService.trackLike(
      userId,
      challengeId,
      TrackableContentType.CHALLENGE,
    );
  }

  /**
   * Enregistrer un partage d'un défi
   */
  async trackChallengeShare(challengeId: string, userId: string) {
    return await this.trackingService.trackShare(
      userId,
      challengeId,
      TrackableContentType.CHALLENGE,
    );
  }

  /**
   * Ajouter un bookmark d'un défi
   */
  async addChallengeBookmark(
    challengeId: string,
    userId: string,
    bookmarkId: string,
  ) {
    return await this.trackingService.addBookmark(
      userId,
      challengeId,
      TrackableContentType.CHALLENGE,
      bookmarkId,
    );
  }

  /**
   * Retirer un bookmark d'un défi
   */
  async removeChallengeBookmark(
    challengeId: string,
    userId: string,
    bookmarkId: string,
  ) {
    return await this.trackingService.removeBookmark(
      userId,
      challengeId,
      TrackableContentType.CHALLENGE,
      bookmarkId,
    );
  }

  /**
   * Ajouter une note/évaluation d'un défi
   */
  async addChallengeRating(
    challengeId: string,
    userId: string,
    rating: number,
    review?: string,
  ) {
    return await this.trackingService.addRating(
      userId,
      challengeId,
      TrackableContentType.CHALLENGE,
      rating,
      review,
    );
  }

  /**
   * Obtenir la progression d'un utilisateur pour un défi
   */
  async getChallengeProgress(challengeId: string, userId: string) {
    return await this.trackingService.getProgress(
      userId,
      challengeId,
      TrackableContentType.CHALLENGE,
    );
  }

  /**
   * Obtenir les statistiques d'un défi
   */
  async getChallengeStats(challengeId: string) {
    return await this.trackingService.getContentStats(
      challengeId,
      TrackableContentType.CHALLENGE,
    );
  }

  // ============ SEQUENTIAL PROGRESSION METHODS ============

  /**
   * Activer ou désactiver la progression séquentielle d'un défi
   * @param challengeId ID du défi
   * @param enabled Activer ou désactiver
   * @param unlockMessage Message personnalisé pour les tâches verrouillées
   * @param userId ID de l'utilisateur (pour vérifier les permissions)
   * @returns Défi mis à jour
   */
  async updateSequentialProgression(
    challengeId: string,
    enabled: boolean,
    unlockMessage: string | undefined,
    userId: string,
  ): Promise<ChallengeResponseDto> {
    console.log('🔧 DEBUG - updateSequentialProgression (Challenge)');
    console.log(`   📋 Challenge ID: ${challengeId}`);
    console.log(`   🔒 Enabled: ${enabled}`);
    console.log(`   💬 Unlock Message: ${unlockMessage}`);
    console.log(`   👤 User ID: ${userId}`);

    try {
      // 1. Vérifier que le défi existe
      const challenge = await this.challengeModel.findOne({ id: challengeId });
      if (!challenge) {
        throw new NotFoundException('Défi non trouvé');
      }

      // 2. Vérifier que l'utilisateur est le créateur du défi
      if (challenge.creatorId.toString() !== userId) {
        throw new ForbiddenException(
          'Seul le créateur du défi peut modifier la progression séquentielle',
        );
      }

      // 3. Mettre à jour la progression séquentielle
      if (enabled) {
        challenge.activerProgressionSequentielle(unlockMessage);
      } else {
        challenge.desactiverProgressionSequentielle();
      }

      const challengeEnregistre = await challenge.save();

      console.log('   ✅ Progression séquentielle mise à jour avec succès');
      console.log(
        `   🔒 Sequential Progression: ${challengeEnregistre.sequentialProgression}`,
      );

      const community = await this.communityModel.findOne({
        id: challenge.communityId,
      });
      return this.transformToResponseDto(
        challengeEnregistre,
        community || undefined,
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      console.error(
        '❌ Erreur lors de la mise à jour de la progression séquentielle:',
        error,
      );
      throw new BadRequestException(
        'Erreur lors de la mise à jour de la progression séquentielle',
      );
    }
  }

  /**
   * Vérifier l'accès à une tâche avec la progression séquentielle
   * @param challengeId ID du défi
   * @param taskId ID de la tâche
   * @param userId ID de l'utilisateur
   * @returns Informations sur l'accès à la tâche
   */
  async checkTaskAccessWithSequential(
    challengeId: string,
    taskId: string,
    userId: string,
  ): Promise<{
    hasAccess: boolean;
    reason: string;
    requiredTask?: {
      id: string;
      title: string;
      day: number;
    };
    unlockMessage?: string;
    nextTask?: {
      id: string;
      title: string;
      day: number;
    };
  }> {
    console.log('🔧 DEBUG - checkTaskAccessWithSequential');
    console.log(`   📋 Challenge ID: ${challengeId}`);
    console.log(`   📄 Task ID: ${taskId}`);
    console.log(`   👤 User ID: ${userId}`);

    try {
      // 1. Récupérer le défi
      const challenge = await this.challengeModel.findOne({ id: challengeId });
      if (!challenge) {
        throw new NotFoundException('Défi non trouvé');
      }

      // 2. Vérifier que l'utilisateur est participant
      if (!challenge.isParticipant(new Types.ObjectId(userId))) {
        throw new NotFoundException('Utilisateur non participant à ce défi');
      }

      // 3. Récupérer les tâches complétées par l'utilisateur
      const participant = challenge.participants.find(
        (p) => p.userId.toString() === userId,
      );
      if (!participant) {
        throw new NotFoundException('Participant non trouvé');
      }

      // 4. Utiliser la méthode du schéma pour vérifier l'accès
      const accessCheck = challenge.verifierAccesTache(
        taskId,
        participant.completedTasks,
      );

      // 5. Obtenir la tâche suivante si disponible
      const nextTask = challenge.obtenirTacheSuivante(taskId);

      console.log("   ✅ Vérification d'accès terminée");
      console.log(`   🔓 Has Access: ${accessCheck.hasAccess}`);
      console.log(`   📝 Reason: ${accessCheck.reason}`);

      return {
        hasAccess: accessCheck.hasAccess,
        reason: accessCheck.reason,
        requiredTask: accessCheck.requiredTask
          ? {
              id: accessCheck.requiredTask.id,
              title: accessCheck.requiredTask.title,
              day: accessCheck.requiredTask.day,
            }
          : undefined,
        unlockMessage: challenge.unlockMessage,
        nextTask: nextTask
          ? {
              id: nextTask.id,
              title: nextTask.title,
              day: nextTask.day,
            }
          : undefined,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error(
        "❌ Erreur lors de la vérification d'accès à la tâche:",
        error,
      );
      throw new BadRequestException(
        "Erreur lors de la vérification d'accès à la tâche",
      );
    }
  }

  /**
   * Obtenir les tâches déverrouillées pour un utilisateur
   * @param challengeId ID du défi
   * @param userId ID de l'utilisateur
   * @returns Liste des tâches déverrouillées
   */
  async getUnlockedTasks(
    challengeId: string,
    userId: string,
  ): Promise<{
    unlockedTasks: Array<{
      id: string;
      title: string;
      day: number;
      isCompleted: boolean;
      isUnlocked: boolean;
    }>;
    sequentialProgressionEnabled: boolean;
    unlockMessage?: string;
  }> {
    console.log('🔧 DEBUG - getUnlockedTasks');
    console.log(`   📋 Challenge ID: ${challengeId}`);
    console.log(`   👤 User ID: ${userId}`);

    try {
      // 1. Récupérer le défi
      const challenge = await this.challengeModel.findOne({ id: challengeId });
      if (!challenge) {
        throw new NotFoundException('Défi non trouvé');
      }

      // 2. Vérifier que l'utilisateur est participant
      if (!challenge.isParticipant(new Types.ObjectId(userId))) {
        throw new NotFoundException('Utilisateur non participant à ce défi');
      }

      // 3. Récupérer les tâches complétées par l'utilisateur
      const participant = challenge.participants.find(
        (p) => p.userId.toString() === userId,
      );
      if (!participant) {
        throw new NotFoundException('Participant non trouvé');
      }

      // 4. Construire la liste des tâches avec leur statut
      const unlockedTasks: Array<{
        id: string;
        title: string;
        day: number;
        isCompleted: boolean;
        isUnlocked: boolean;
      }> = [];

      // Trier les tâches par jour
      const tasksTriees = [...(challenge.tasks || [])].sort(
        (a, b) => a.day - b.day,
      );

      for (const task of tasksTriees) {
        // Vérifier si la tâche est complétée
        const isCompleted = participant.completedTasks.includes(task.id);

        // Vérifier si la tâche est déverrouillée
        let isUnlocked = true;
        if (challenge.sequentialProgression) {
          const accessCheck = challenge.verifierAccesTache(
            task.id,
            participant.completedTasks,
          );
          isUnlocked = accessCheck.hasAccess;
        }

        unlockedTasks.push({
          id: task.id,
          title: task.title,
          day: task.day,
          isCompleted,
          isUnlocked,
        });
      }

      console.log(`   ✅ ${unlockedTasks.length} tâches analysées`);
      console.log(
        `   🔓 ${unlockedTasks.filter((t) => t.isUnlocked).length} tâches déverrouillées`,
      );

      return {
        unlockedTasks,
        sequentialProgressionEnabled: challenge.sequentialProgression,
        unlockMessage: challenge.unlockMessage,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error(
        '❌ Erreur lors de la récupération des tâches déverrouillées:',
        error,
      );
      throw new BadRequestException(
        'Erreur lors de la récupération des tâches déverrouillées',
      );
    }
  }

  /**
   * Déverrouiller manuellement une tâche (pour les créateurs/admins)
   * @param challengeId ID du défi
   * @param taskId ID de la tâche à déverrouiller
   * @param userId ID de l'utilisateur cible
   * @param creatorId ID du créateur/admin qui effectue l'action
   * @returns Message de confirmation
   */
  async unlockTaskManually(
    challengeId: string,
    taskId: string,
    userId: string,
    creatorId: string,
  ): Promise<{ message: string }> {
    console.log('🔧 DEBUG - unlockTaskManually');
    console.log(`   📋 Challenge ID: ${challengeId}`);
    console.log(`   📄 Task ID: ${taskId}`);
    console.log(`   👤 Target User ID: ${userId}`);
    console.log(`   👨‍💼 Creator ID: ${creatorId}`);

    try {
      // 1. Vérifier que le défi existe
      const challenge = await this.challengeModel.findOne({ id: challengeId });
      if (!challenge) {
        throw new NotFoundException('Défi non trouvé');
      }

      // 2. Vérifier que le créateur est le créateur du défi
      if (challenge.creatorId.toString() !== creatorId) {
        throw new ForbiddenException(
          'Seul le créateur du défi peut déverrouiller des tâches',
        );
      }

      // 3. Vérifier que l'utilisateur est participant
      if (!challenge.isParticipant(new Types.ObjectId(userId))) {
        throw new NotFoundException('Utilisateur non participant à ce défi');
      }

      // 4. Trouver le participant
      const participant = challenge.participants.find(
        (p) => p.userId.toString() === userId,
      );
      if (!participant) {
        throw new NotFoundException('Participant non trouvé');
      }

      // 5. Marquer la tâche comme accessible (mais pas forcément complétée)
      // On ne l'ajoute pas aux completedTasks, on la laisse accessible
      participant.lastActivityAt = new Date();
      await challenge.save();

      console.log('   ✅ Tâche déverrouillée manuellement avec succès');

      return {
        message: 'Tâche déverrouillée avec succès',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      console.error(
        '❌ Erreur lors du déverrouillage manuel de la tâche:',
        error,
      );
      throw new BadRequestException(
        'Erreur lors du déverrouillage manuel de la tâche',
      );
    }
  }

  /**
   * Mettre à jour le progrès d'un participant avec vérification séquentielle
   * @param updateProgressDto Données de mise à jour du progrès
   * @param userId ID de l'utilisateur
   * @returns Défi mis à jour
   */
  async updateProgressWithSequential(
    updateProgressDto: UpdateProgressDto,
    userId: string,
  ): Promise<ChallengeResponseDto> {
    console.log('🔧 DEBUG - updateProgressWithSequential');
    console.log(`   📋 Challenge ID: ${updateProgressDto.challengeId}`);
    console.log(`   📄 Task ID: ${updateProgressDto.taskId}`);
    console.log(`   📊 Status: ${updateProgressDto.status}`);
    console.log(`   👤 User ID: ${userId}`);

    try {
      // 1. Récupérer le défi
      const challenge = await this.challengeModel.findOne({
        id: updateProgressDto.challengeId,
      });
      if (!challenge) {
        throw new NotFoundException('Défi non trouvé');
      }

      // 2. Vérifier que l'utilisateur est participant
      if (!challenge.isParticipant(new Types.ObjectId(userId))) {
        throw new BadRequestException("Vous n'êtes pas participant à ce défi");
      }

      // 3. Trouver la tâche
      const task = challenge.tasks?.find(
        (t) => t.id === updateProgressDto.taskId,
      );
      if (!task) {
        throw new NotFoundException('Tâche non trouvée');
      }

      // 4. Si la progression séquentielle est activée, vérifier l'accès
      if (challenge.sequentialProgression) {
        const participant = challenge.participants.find(
          (p) => p.userId.toString() === userId,
        );
        if (participant) {
          const accessCheck = challenge.verifierAccesTache(
            updateProgressDto.taskId,
            participant.completedTasks,
          );
          if (!accessCheck.hasAccess) {
            throw new ForbiddenException(
              `Vous devez compléter la tâche précédente pour accéder à cette tâche: ${accessCheck.requiredTask?.title}`,
            );
          }
        }
      }

      // 5. Mettre à jour le statut de la tâche
      if (updateProgressDto.status === 'completed') {
        task.isCompleted = true;
      } else if (updateProgressDto.status === 'in_progress') {
        task.isCompleted = false;
      } else {
        task.isCompleted = false;
      }

      // 6. Mettre à jour le progrès du participant
      const participant = challenge.participants.find(
        (p) => p.userId.toString() === userId,
      );
      if (participant) {
        if (
          updateProgressDto.status === 'completed' &&
          !participant.completedTasks.includes(updateProgressDto.taskId)
        ) {
          participant.completedTasks.push(updateProgressDto.taskId);
          participant.totalPoints += task.points;
        } else if (
          updateProgressDto.status !== 'completed' &&
          participant.completedTasks.includes(updateProgressDto.taskId)
        ) {
          participant.completedTasks = participant.completedTasks.filter(
            (id) => id !== updateProgressDto.taskId,
          );
          participant.totalPoints = Math.max(
            0,
            participant.totalPoints - task.points,
          );
        }

        // Calculer le progrès en pourcentage
        participant.progress = Math.round(
          (participant.completedTasks.length / (challenge.tasks?.length || 1)) *
            100,
        );
        participant.lastActivityAt = new Date();
      }

      await challenge.save();

      console.log('   ✅ Progrès mis à jour avec succès');

      const community = await this.communityModel.findOne({
        id: challenge.communityId,
      });
      return this.transformToResponseDto(challenge, community || undefined);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('❌ Erreur lors de la mise à jour du progrès:', error);
      throw new BadRequestException('Erreur lors de la mise à jour du progrès');
    }
  }
}
