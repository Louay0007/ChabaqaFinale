import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session, SessionDocument } from '../schema/session.schema';
import { Community, CommunityDocument } from '../schema/community.schema';
import { User, UserDocument } from '../schema/user.schema';
import { CreateSessionDto } from '../dto-session/create-session.dto';
import { UpdateSessionDto } from '../dto-session/update-session.dto';
import { BookSessionDto, ConfirmBookingDto, CancelBookingDto, CompleteSessionDto, UpdateBookingStatusDto } from '../dto-session/book-session.dto';
import { SessionResponseDto, SessionListResponseDto, UserBookingsResponseDto, CreatorBookingsResponseDto } from '../dto-session/session-response.dto';
import { SetAvailableHoursDto, GenerateSlotsDto, BookSlotDto, GetAvailableSlotsDto } from '../dto-session/available-hours.dto';
import { AvailableSlotsResponseDto, AvailableHoursResponseDto } from '../dto-session/available-slots-response.dto';
import { PromoService } from '../common/services/promo.service';
import { PolicyService } from '../common/services/policy.service';
import { FeeService } from '../common/services/fee.service';
import { TrackableContentType } from '../schema/content-tracking.schema';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(Community.name) private communityModel: Model<CommunityDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel('Order') private orderModel: Model<any>,
    private readonly feeService: FeeService,
    private readonly promoService: PromoService,
    private readonly policyService: PolicyService,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  /**
   * Get sessions for a specific user (booked + created)
   */
  async getSessionsByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
    type: 'booked' | 'created' | 'all' = 'all',
    timeFilter: 'upcoming' | 'past' | 'all' = 'all'
  ) {
    console.log('🔧 DEBUG - getSessionsByUser');
    console.log(`   👤 User ID: ${userId}`);
    console.log(`   📄 Page: ${page}, Limit: ${limit}, Type: ${type}, TimeFilter: ${timeFilter}`);

    const skip = (page - 1) * limit;
    let allSessions: any[] = [];
    let totalCount = 0;
    const now = new Date();

    // Get booked sessions
    if (type === 'booked' || type === 'all') {
      const bookedSessions = await this.sessionModel
        .find({ 'bookings.userId': new Types.ObjectId(userId) })
        .populate('creatorId', 'name email profile_picture')
        .populate('communityId', 'name slug')
        .sort({ startTime: -1 })
        .exec();

      const transformedBooked = bookedSessions
        .map(session => {
          const booking = session.bookings.find(b => b.userId.toString() === userId);
          const sessionData = session as any;
          const startTime = new Date(sessionData.startTime || sessionData.dateTime);
          const isUpcoming = startTime > now;
          const isPast = startTime <= now;
          
          // Apply time filter
          if (timeFilter === 'upcoming' && !isUpcoming) return null;
          if (timeFilter === 'past' && !isPast) return null;
          
          return {
            id: session._id.toString(),
            title: sessionData.title || sessionData.name,
            description: sessionData.description,
            thumbnail: sessionData.thumbnail || sessionData.image || 'https://placehold.co/400x300?text=Session',
            startTime: sessionData.startTime || sessionData.dateTime,
            duration: sessionData.duration || 60,
            status: isUpcoming ? 'upcoming' : 'past',
            type: 'booked',
            bookingStatus: booking?.status || 'confirmed',
            bookedAt: (booking as any)?.bookedAt || (booking as any)?.createdAt,
            creator: {
              name: (session.creatorId as any)?.name || 'Unknown',
              avatar: (session.creatorId as any)?.profile_picture || 'https://placehold.co/64x64?text=MM'
            },
            community: {
              name: (session.communityId as any)?.name || 'Unknown',
              slug: (session.communityId as any)?.slug || 'unknown'
            }
          };
        })
        .filter(Boolean);

      allSessions = [...allSessions, ...transformedBooked];
    }

    // Get created sessions
    if (type === 'created' || type === 'all') {
      const createdSessions = await this.sessionModel
        .find({ creatorId: new Types.ObjectId(userId) })
        .populate('creatorId', 'name email profile_picture')
        .populate('communityId', 'name slug')
        .sort({ startTime: -1 })
        .exec();

      const transformedCreated = createdSessions
        .map(session => {
          const sessionData = session as any;
          const startTime = new Date(sessionData.startTime || sessionData.dateTime);
          const isUpcoming = startTime > now;
          const isPast = startTime <= now;
          
          // Apply time filter
          if (timeFilter === 'upcoming' && !isUpcoming) return null;
          if (timeFilter === 'past' && !isPast) return null;
          
          return {
            id: session._id.toString(),
            title: sessionData.title || sessionData.name,
            description: sessionData.description,
            thumbnail: sessionData.thumbnail || sessionData.image || 'https://placehold.co/400x300?text=Session',
            startTime: sessionData.startTime || sessionData.dateTime,
            duration: sessionData.duration || 60,
            status: isUpcoming ? 'upcoming' : 'past',
            type: 'created',
            bookingsCount: sessionData.bookings?.length || 0,
            maxParticipants: sessionData.maxParticipants || sessionData.capacity,
            createdAt: session.createdAt,
            creator: {
              name: (session.creatorId as any)?.name || 'Unknown',
              avatar: (session.creatorId as any)?.profile_picture || 'https://placehold.co/64x64?text=MM'
            },
            community: {
              name: (session.communityId as any)?.name || 'Unknown',
              slug: (session.communityId as any)?.slug || 'unknown'
            }
          };
        })
        .filter(Boolean);

      allSessions = [...allSessions, ...transformedCreated];
    }

    // Sort by start time (upcoming first, then past)
    allSessions.sort((a, b) => {
      const dateA = new Date(a.startTime);
      const dateB = new Date(b.startTime);
      
      // If both are upcoming or both are past, sort by date
      if ((dateA > now && dateB > now) || (dateA <= now && dateB <= now)) {
        return dateA.getTime() - dateB.getTime();
      }
      
      // Upcoming sessions come first
      return dateA > now ? -1 : 1;
    });

    totalCount = allSessions.length;
    const paginatedSessions = allSessions.slice(skip, skip + limit);

    console.log(`   📊 Total sessions found: ${totalCount}`);
    console.log(`   📄 Returning: ${paginatedSessions.length} sessions`);

    return {
      success: true,
      message: 'User sessions retrieved successfully',
      data: {
        sessions: paginatedSessions,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    };
  }

  /**
   * Créer une nouvelle session
   */
  async create(createSessionDto: CreateSessionDto, creatorId: string | any): Promise<SessionResponseDto> {
    // Vérifier que la communauté existe
    const community = await this.communityModel.findOne({ slug: createSessionDto.communitySlug });
    if (!community) {
      throw new NotFoundException('Communauté non trouvée');
    }

    // Normaliser l'ID créateur pour comparaison
    const normalizedCreatorId = typeof creatorId === 'object'
      ? creatorId.toString()
      : String(creatorId);
    const communityCreatorId = community.createur?.toString();

    // Vérifier que l'utilisateur est le créateur de la communauté
    if (communityCreatorId !== normalizedCreatorId) {
      throw new ForbiddenException('Seul le créateur de la communauté peut créer des sessions');
    }

    // Générer un ID unique pour la session
    const sessionId = new Types.ObjectId().toString();

    // Gating: require active subscription to activate sessions
    const hasSub = await this.policyService.hasActiveSubscription(creatorId);
    if (!hasSub && createSessionDto.isActive) {
      throw new ForbiddenException('Un abonnement actif est requis pour activer une session');
    }

    // Créer la session
    const session = new this.sessionModel({
      id: sessionId,
      title: createSessionDto.title,
      description: createSessionDto.description,
      duration: createSessionDto.duration,
      price: createSessionDto.price,
      currency: createSessionDto.currency,
      communityId: community.id,
      creatorId: new Types.ObjectId(creatorId),
      isActive: createSessionDto.isActive ?? true,
      category: createSessionDto.category,
      maxBookingsPerWeek: createSessionDto.maxBookingsPerWeek,
      notes: createSessionDto.notes,
      resources: createSessionDto.resources || [],
    });

    const savedSession = await session.save();
    return this.transformToResponseDto(savedSession, community);
  }

  /**
   * Récupérer toutes les sessions avec pagination et filtres
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    communitySlug?: string,
    category?: string,
    isActive?: boolean,
    creatorId?: string
  ): Promise<SessionListResponseDto> {
    const query: any = {};

    // Filtres
    if (communitySlug) {
      const community = await this.communityModel.findOne({ slug: communitySlug });
      if (community) {
        query.communityId = community.id;
      }
    }

    if (category) {
      query.category = category;
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    if (creatorId) {
      query.creatorId = new Types.ObjectId(creatorId);
    }

    // Pagination
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      this.sessionModel
        .find(query)
        .populate('creatorId', 'name email profile_picture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.sessionModel.countDocuments(query)
    ]);

    // Récupérer les communautés pour chaque session
    const communityIds = [...new Set(sessions.map(s => s.communityId))];
    const communities = await this.communityModel.find({ id: { $in: communityIds } });

    const sessionResponses = await Promise.all(
      sessions.map(session => {
        const community = communities.find(c => c.id === session.communityId);
        return this.transformToResponseDto(session, community || undefined);
      })
    );

    return {
      sessions: sessionResponses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Récupérer une session par son ID
   */
  async findOne(id: string): Promise<SessionResponseDto> {
    const session = await this.sessionModel
      .findOne({ id })
      .populate('creatorId', 'name email profile_picture')
      .exec();

    if (!session) {
      throw new NotFoundException('Session non trouvée');
    }

    const community = await this.communityModel.findOne({ id: session.communityId });
    if (!community) {
      throw new NotFoundException('Communauté non trouvée');
    }

    return this.transformToResponseDto(session, community);
  }

  /**
   * Récupérer les sessions d'une communauté
   */
  async findByCommunity(communitySlug: string): Promise<SessionResponseDto[]> {
    const community = await this.communityModel.findOne({ slug: communitySlug });
    if (!community) {
      throw new NotFoundException('Communauté non trouvée');
    }

    const sessions = await this.sessionModel
      .find({ communityId: community.id })
      .populate('creatorId', 'name email profile_picture')
      .sort({ createdAt: -1 })
      .exec();

    return Promise.all(
      sessions.map(session => this.transformToResponseDto(session, community))
    );
  }

  /**
   * Mettre à jour une session
   */
  async update(id: string, updateSessionDto: UpdateSessionDto, userId: string): Promise<SessionResponseDto> {
    const session = await this.sessionModel.findOne({ id });
    if (!session) {
      throw new NotFoundException('Session non trouvée');
    }

    // Vérifier que l'utilisateur est le créateur de la session
    if (session.creatorId.toString() !== userId) {
      throw new ForbiddenException('Seul le créateur de la session peut la modifier');
    }

    // Mettre à jour la session
    Object.assign(session, updateSessionDto);
    const updatedSession = await session.save();
    
    const community = await this.communityModel.findOne({ id: session.communityId });
    return this.transformToResponseDto(updatedSession, community || undefined);
  }

  /**
   * Supprimer une session
   */
  async remove(id: string, userId: string): Promise<void> {
    const session = await this.sessionModel.findOne({ id });
    if (!session) {
      throw new NotFoundException('Session non trouvée');
    }

    // Vérifier que l'utilisateur est le créateur de la session
    if (session.creatorId.toString() !== userId) {
      throw new ForbiddenException('Seul le créateur de la session peut la supprimer');
    }

    await this.sessionModel.deleteOne({ id });
  }

  /**
   * Réserver une session
   */
  async bookSession(sessionId: string, bookSessionDto: BookSessionDto, userId: string, promoCode?: string): Promise<SessionResponseDto> {
    const session = await this.sessionModel.findOne({ id: sessionId });
    if (!session) {
      throw new NotFoundException('Session non trouvée');
    }

    // Vérifier que la session est active
    if (!session.isActive) {
      throw new BadRequestException('Cette session n\'est plus active');
    }

    // Vérifier que l'utilisateur n'est pas le créateur
    if (session.creatorId.toString() === userId) {
      throw new BadRequestException('Vous ne pouvez pas réserver votre propre session');
    }

    const scheduledAt = new Date(bookSessionDto.scheduledAt);

    // Vérifier que la date est dans le futur
    if (scheduledAt <= new Date()) {
      throw new BadRequestException('La date de la session doit être dans le futur');
    }

    // Vérifier la disponibilité
    if (!session.isTimeSlotAvailable(scheduledAt)) {
      throw new BadRequestException('Ce créneau horaire n\'est pas disponible');
    }

    // Vérifier la limite hebdomadaire
    if (!session.canBookMore()) {
      throw new BadRequestException('Limite de réservations hebdomadaires atteinte');
    }

    // Créer la réservation
    const booking = {
      id: new Types.ObjectId().toString(),
      userId: new Types.ObjectId(userId),
      scheduledAt: scheduledAt,
      status: 'pending' as const,
      notes: bookSessionDto.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    session.addBooking(booking);
    // Si la session est payante, appliquer promo puis créer une commande avec calcul des frais
    if (session.price && session.price > 0) {
      let effective = session.price;
      let discountDT = 0;
      let appliedCode: string | undefined;
      if (promoCode) {
        const buyer = await this.userModel.findById(userId).select('email');
        const promo = await this.promoService.validateAndApply(promoCode, session.price, TrackableContentType.SESSION, session._id.toString(), (buyer as any)?.email);
        if (promo.valid) {
          effective = promo.finalAmountDT;
          discountDT = promo.discountDT;
          appliedCode = promo.appliedCode;
        }
      }
      const breakdown = await this.feeService.calculateForAmount(effective, session.creatorId.toString());
      await this.orderModel.create({
        buyerId: new Types.ObjectId(userId),
        creatorId: session.creatorId,
        contentType: TrackableContentType.SESSION,
        contentId: session._id.toString(),
        amountDT: breakdown.amountDT,
        platformPercent: breakdown.platformPercent,
        platformFixedDT: breakdown.platformFixedDT,
        platformFeeDT: breakdown.platformFeeDT,
        creatorNetDT: breakdown.creatorNetDT,
        promoCode: appliedCode,
        discountDT,
        status: 'paid'
      });
    }
    await session.save();

    const community = await this.communityModel.findOne({ id: session.communityId });
    return this.transformToResponseDto(session, community || undefined);
  }

  /**
   * Confirmer une réservation
   */
  async confirmBooking(bookingId: string, confirmBookingDto: ConfirmBookingDto, userId: string): Promise<SessionResponseDto> {
    const session = await this.sessionModel.findOne({ 'bookings.id': bookingId });
    if (!session) {
      throw new NotFoundException('Réservation non trouvée');
    }

    // Vérifier que l'utilisateur est le créateur de la session
    if (session.creatorId.toString() !== userId) {
      throw new ForbiddenException('Seul le créateur de la session peut confirmer les réservations');
    }

    const booking = session.getBooking(bookingId);
    if (!booking) {
      throw new NotFoundException('Réservation non trouvée');
    }

    if (booking.status !== 'pending') {
      throw new BadRequestException('Cette réservation ne peut pas être confirmée');
    }

    // Mettre à jour la réservation
    booking.status = 'confirmed';
    booking.meetingUrl = confirmBookingDto.meetingUrl;
    if (confirmBookingDto.notes) {
      booking.notes = confirmBookingDto.notes;
    }
    booking.updatedAt = new Date();

    await session.save();

    const community = await this.communityModel.findOne({ id: session.communityId });
    return this.transformToResponseDto(session, community || undefined);
  }

  /**
   * Annuler une réservation
   */
  async cancelBooking(bookingId: string, cancelBookingDto: CancelBookingDto, userId: string): Promise<SessionResponseDto> {
    const session = await this.sessionModel.findOne({ 'bookings.id': bookingId });
    if (!session) {
      throw new NotFoundException('Réservation non trouvée');
    }

    const booking = session.getBooking(bookingId);
    if (!booking) {
      throw new NotFoundException('Réservation non trouvée');
    }

    // Vérifier que l'utilisateur peut annuler (créateur ou utilisateur de la réservation)
    if (session.creatorId.toString() !== userId && booking.userId.toString() !== userId) {
      throw new ForbiddenException('Vous ne pouvez pas annuler cette réservation');
    }

    if (booking.status === 'cancelled') {
      throw new BadRequestException('Cette réservation est déjà annulée');
    }

    if (booking.status === 'completed') {
      throw new BadRequestException('Cette réservation est déjà terminée');
    }

    // Mettre à jour la réservation
    booking.status = 'cancelled';
    if (cancelBookingDto.reason) {
      booking.notes = cancelBookingDto.reason;
    }
    booking.updatedAt = new Date();

    await session.save();

    const community = await this.communityModel.findOne({ id: session.communityId });
    return this.transformToResponseDto(session, community || undefined);
  }

  /**
   * Marquer une session comme terminée
   */
  async completeSession(bookingId: string, completeSessionDto: CompleteSessionDto, userId: string): Promise<SessionResponseDto> {
    const session = await this.sessionModel.findOne({ 'bookings.id': bookingId });
    if (!session) {
      throw new NotFoundException('Réservation non trouvée');
    }

    // Vérifier que l'utilisateur est le créateur de la session
    if (session.creatorId.toString() !== userId) {
      throw new ForbiddenException('Seul le créateur de la session peut la marquer comme terminée');
    }

    const booking = session.getBooking(bookingId);
    if (!booking) {
      throw new NotFoundException('Réservation non trouvée');
    }

    if (booking.status !== 'confirmed') {
      throw new BadRequestException('Seules les réservations confirmées peuvent être marquées comme terminées');
    }

    // Mettre à jour la réservation
    booking.status = 'completed';
    if (completeSessionDto.notes) {
      booking.notes = completeSessionDto.notes;
    }
    booking.updatedAt = new Date();

    await session.save();

    const community = await this.communityModel.findOne({ id: session.communityId });
    return this.transformToResponseDto(session, community || undefined);
  }

  /**
   * Récupérer les réservations d'un utilisateur
   */
  async getUserBookings(userId: string): Promise<UserBookingsResponseDto> {
    const sessions = await this.sessionModel
      .find({ 'bookings.userId': new Types.ObjectId(userId) })
      .populate('creatorId', 'name email profile_picture')
      .exec();

    interface BookingWithSession {
      id: string;
      userId: Types.ObjectId;
      scheduledAt: Date;
      status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
      meetingUrl?: string;
      notes?: string;
      createdAt: Date;
      updatedAt: Date;
      sessionId: string;
      sessionTitle: string;
      creatorName: string;
      creatorAvatar?: string;
    }

    const allBookings: BookingWithSession[] = [];
    for (const session of sessions) {
      const userBookings = session.bookings.filter(booking => booking.userId.toString() === userId);
      for (const booking of userBookings) {
        allBookings.push({
          ...booking,
          sessionId: session.id,
          sessionTitle: session.title,
          creatorName: (session.creatorId as any).name,
          creatorAvatar: (session.creatorId as any).profile_picture
        });
      }
    }

    // Trier par date de création
    allBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      bookings: allBookings.map(booking => ({
        id: booking.id,
        userId: booking.userId.toString(),
        userName: 'Current User', // L'utilisateur actuel
        userAvatar: undefined,
        scheduledAt: booking.scheduledAt.toISOString(),
        status: booking.status,
        meetingUrl: booking.meetingUrl,
        notes: booking.notes,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString()
      })),
      total: allBookings.length
    };
  }

  /**
   * Récupérer les réservations d'un créateur
   */
  async getCreatorBookings(creatorId: string): Promise<CreatorBookingsResponseDto> {
    const sessions = await this.sessionModel
      .find({ creatorId: new Types.ObjectId(creatorId) })
      .populate('creatorId', 'name email profile_picture')
      .exec();

    interface BookingWithSession {
      id: string;
      userId: Types.ObjectId;
      scheduledAt: Date;
      status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
      meetingUrl?: string;
      notes?: string;
      createdAt: Date;
      updatedAt: Date;
      sessionId: string;
      sessionTitle: string;
    }

    const allBookings: BookingWithSession[] = [];
    for (const session of sessions) {
      for (const booking of session.bookings) {
        allBookings.push({
          ...booking,
          sessionId: session.id,
          sessionTitle: session.title
        });
      }
    }

    // Trier par date de création
    allBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Récupérer les informations des utilisateurs
    const userIds = [...new Set(allBookings.map(booking => booking.userId.toString()))];
    const users = await this.userModel.find({ _id: { $in: userIds } }).select('name email profile_picture');

    return {
      bookings: allBookings.map(booking => {
        const user = users.find(u => u._id.equals(booking.userId));
        return {
          id: booking.id,
          userId: booking.userId.toString(),
          userName: user?.name || 'Utilisateur inconnu',
          userAvatar: user?.profile_picture,
          scheduledAt: booking.scheduledAt.toISOString(),
          status: booking.status,
          meetingUrl: booking.meetingUrl,
          notes: booking.notes,
          createdAt: booking.createdAt.toISOString(),
          updatedAt: booking.updatedAt.toISOString()
        };
      }),
      total: allBookings.length
    };
  }

  /**
   * Définir les heures de disponibilité pour une session
   */
  async setAvailableHours(sessionId: string, setAvailableHoursDto: SetAvailableHoursDto, userId: string): Promise<AvailableHoursResponseDto> {
    const session = await this.sessionModel.findOne({ id: sessionId });
    if (!session) {
      throw new NotFoundException('Session non trouvée');
    }

    // Vérifier que l'utilisateur est le créateur de la session
    if (session.creatorId.toString() !== userId) {
      throw new ForbiddenException('Seul le créateur de la session peut définir les heures de disponibilité');
    }

    // Mettre à jour les disponibilités récurrentes
    session.recurringAvailability = setAvailableHoursDto.recurringAvailability.map(av => ({
      id: new Types.ObjectId().toString(),
      dayOfWeek: av.dayOfWeek,
      startTime: av.startTime,
      endTime: av.endTime,
      slotDuration: av.slotDuration || 60,
      isActive: av.isActive ?? true,
      createdAt: new Date()
    }));

    // Mettre à jour les autres paramètres
    session.autoGenerateSlots = setAvailableHoursDto.autoGenerateSlots ?? false;
    session.advanceBookingDays = setAvailableHoursDto.advanceBookingDays || 30;

    await session.save();

    return this.transformToAvailableHoursResponseDto(session);
  }

  /**
   * Générer les créneaux disponibles pour une session
   */
  async generateAvailableSlots(sessionId: string, generateSlotsDto: GenerateSlotsDto, userId: string): Promise<AvailableSlotsResponseDto> {
    const session = await this.sessionModel.findOne({ id: sessionId });
    if (!session) {
      throw new NotFoundException('Session non trouvée');
    }

    // Vérifier que l'utilisateur est le créateur de la session
    if (session.creatorId.toString() !== userId) {
      throw new ForbiddenException('Seul le créateur de la session peut générer les créneaux');
    }

    const startDate = new Date(generateSlotsDto.startDate);
    const endDate = new Date(generateSlotsDto.endDate);

    // Générer les créneaux
    session.generateAvailableSlots(startDate, endDate);
    await session.save();

    return this.transformToAvailableSlotsResponseDto(session);
  }

  /**
   * Obtenir les heures de disponibilité d'une session
   */
  async getAvailableHours(sessionId: string, userId: string): Promise<AvailableHoursResponseDto> {
    const session = await this.sessionModel.findOne({ id: sessionId });
    if (!session) {
      throw new NotFoundException('Session non trouvée');
    }

    // Vérifier que l'utilisateur est le créateur de la session
    if (session.creatorId.toString() !== userId) {
      throw new ForbiddenException('Seul le créateur de la session peut voir les heures de disponibilité');
    }

    return this.transformToAvailableHoursResponseDto(session);
  }

  /**
   * Obtenir les créneaux disponibles pour une session
   */
  async getAvailableSlots(sessionId: string, getAvailableSlotsDto?: GetAvailableSlotsDto): Promise<AvailableSlotsResponseDto> {
    const session = await this.sessionModel.findOne({ id: sessionId });
    if (!session) {
      throw new NotFoundException('Session non trouvée');
    }

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (getAvailableSlotsDto?.startDate) {
      startDate = new Date(getAvailableSlotsDto.startDate);
    }
    if (getAvailableSlotsDto?.endDate) {
      endDate = new Date(getAvailableSlotsDto.endDate);
    }

    // Si aucune date n'est spécifiée, utiliser les 30 prochains jours
    if (!startDate) {
      startDate = new Date();
    }
    if (!endDate) {
      endDate = new Date();
      endDate.setDate(endDate.getDate() + (session.advanceBookingDays || 30));
    }

    // Générer les créneaux si nécessaire
    if (session.autoGenerateSlots && session.recurringAvailability && session.recurringAvailability.length > 0) {
      session.generateAvailableSlots(startDate, endDate);
      await session.save();
    }

    return this.transformToAvailableSlotsResponseDto(session, startDate, endDate);
  }

  /**
   * Réserver un créneau spécifique
   */
  async bookSlot(sessionId: string, bookSlotDto: BookSlotDto, userId: string): Promise<SessionResponseDto> {
    const session = await this.sessionModel.findOne({ id: sessionId });
    if (!session) {
      throw new NotFoundException('Session non trouvée');
    }

    // Vérifier que la session est active
    if (!session.isActive) {
      throw new BadRequestException('Cette session n\'est plus active');
    }

    // Vérifier que l'utilisateur n'est pas le créateur
    if (session.creatorId.toString() === userId) {
      throw new BadRequestException('Vous ne pouvez pas réserver votre propre session');
    }

    // Trouver le créneau
    const slot = session.getSlot(bookSlotDto.slotId);
    if (!slot) {
      throw new NotFoundException('Créneau non trouvé');
    }

    if (!slot.isAvailable) {
      throw new BadRequestException('Ce créneau n\'est plus disponible');
    }

    // Vérifier que la date est dans le futur
    if (slot.startTime <= new Date()) {
      throw new BadRequestException('Impossible de réserver un créneau dans le passé');
    }

    // Réserver le créneau
    const success = session.bookSlot(bookSlotDto.slotId, userId);
    if (!success) {
      throw new BadRequestException('Impossible de réserver ce créneau');
    }

    // Créer une réservation traditionnelle pour la compatibilité
    const booking = {
      id: new Types.ObjectId().toString(),
      userId: new Types.ObjectId(userId),
      scheduledAt: slot.startTime,
      status: 'confirmed' as const,
      notes: bookSlotDto.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    session.addBooking(booking);

    // Try to create Google Meet link if creator has Google Calendar connected
    try {
      const attendee = await this.userModel.findById(userId).select('email');
      const creator = await this.userModel.findById(session.creatorId).select('email');
      
      if (attendee?.email && creator?.email) {
        const endTime = new Date(slot.startTime.getTime() + session.duration * 60000);
        
        const { meetLink } = await this.googleCalendarService.createCalendarEventWithMeet(
          session.creatorId.toString(),
          sessionId,
          attendee.email,
          slot.startTime,
          endTime,
          session.title,
          session.description
        );

        // Update the booking with the Meet link
        const bookingIndex = session.bookings.findIndex(b => b.id === booking.id);
        if (bookingIndex !== -1) {
          session.bookings[bookingIndex].meetingUrl = meetLink;
        }
      }
    } catch (error) {
      // Log error but don't fail the booking if Google Calendar fails
      console.warn('Failed to create Google Meet link:', error.message);
    }

    // Si la session est payante, créer une commande
    if (session.price && session.price > 0) {
      const breakdown = await this.feeService.calculateForAmount(session.price, session.creatorId.toString());
      await this.orderModel.create({
        buyerId: new Types.ObjectId(userId),
        creatorId: session.creatorId,
        contentType: TrackableContentType.SESSION,
        contentId: session._id.toString(),
        amountDT: breakdown.amountDT,
        platformPercent: breakdown.platformPercent,
        platformFixedDT: breakdown.platformFixedDT,
        platformFeeDT: breakdown.platformFeeDT,
        creatorNetDT: breakdown.creatorNetDT,
        status: 'paid'
      });
    }

    await session.save();

    const community = await this.communityModel.findOne({ id: session.communityId });
    return this.transformToResponseDto(session, community || undefined);
  }

  /**
   * Annuler un créneau réservé
   */
  async cancelSlot(sessionId: string, slotId: string, userId: string): Promise<SessionResponseDto> {
    const session = await this.sessionModel.findOne({ id: sessionId });
    if (!session) {
      throw new NotFoundException('Session non trouvée');
    }

    const slot = session.getSlot(slotId);
    if (!slot) {
      throw new NotFoundException('Créneau non trouvé');
    }

    // Vérifier que l'utilisateur peut annuler (créateur ou utilisateur qui a réservé)
    if (session.creatorId.toString() !== userId && slot.bookedBy?.toString() !== userId) {
      throw new ForbiddenException('Vous ne pouvez pas annuler ce créneau');
    }

    // Annuler le créneau
    const success = session.cancelSlot(slotId);
    if (!success) {
      throw new BadRequestException('Impossible d\'annuler ce créneau');
    }

    // Annuler la réservation correspondante si elle existe
    const correspondingBooking = session.bookings.find(booking => 
      booking.scheduledAt.getTime() === slot.startTime.getTime() &&
      booking.userId.toString() === userId
    );

    if (correspondingBooking) {
      correspondingBooking.status = 'cancelled';
      correspondingBooking.updatedAt = new Date();
    }

    await session.save();

    const community = await this.communityModel.findOne({ id: session.communityId });
    return this.transformToResponseDto(session, community || undefined);
  }

  /**
   * Transformer un document Session en DTO de réponse
   */
  private async transformToResponseDto(session: SessionDocument, community?: CommunityDocument | null): Promise<SessionResponseDto> {
    // Récupérer les informations du créateur
    const creator = await this.userModel.findById(session.creatorId).select('name email profile_picture');
    
    // Transformer les réservations
    const bookingUserIds = session.bookings.map(b => b.userId);
    const bookingUsers = await this.userModel.find({ _id: { $in: bookingUserIds } }).select('name email profile_picture');

    const bookings = session.bookings.map(booking => {
      const user = bookingUsers.find(u => u._id.equals(booking.userId));
      return {
        id: booking.id,
        userId: booking.userId.toString(),
        userName: user?.name || 'Utilisateur inconnu',
        userAvatar: user?.profile_picture,
        scheduledAt: booking.scheduledAt.toISOString(),
        status: booking.status,
        meetingUrl: booking.meetingUrl,
        notes: booking.notes,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString()
      };
    });

    return {
      id: session.id,
      title: session.title,
      description: session.description,
      duration: session.duration,
      price: session.price,
      currency: session.currency,
      communityId: session.communityId,
      communitySlug: community?.slug || '',
      creatorId: session.creatorId.toString(),
      creatorName: creator?.name || 'Créateur inconnu',
      creatorAvatar: creator?.profile_picture,
      isActive: session.isActive,
      bookings: bookings,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
      category: session.category,
      maxBookingsPerWeek: session.maxBookingsPerWeek,
      notes: session.notes,
      resources: session.resources || [],
      bookingsCount: session.getBookingsCount(),
      bookingsThisWeek: session.getBookingsThisWeek(),
      canBookMore: session.canBookMore()
    };
  }

  /**
   * Transformer un document Session en DTO de réponse pour les heures de disponibilité
   */
  private transformToAvailableHoursResponseDto(session: SessionDocument): AvailableHoursResponseDto {
    return {
      recurringAvailability: (session.recurringAvailability || []).map(av => ({
        id: av.id,
        dayOfWeek: av.dayOfWeek,
        startTime: av.startTime,
        endTime: av.endTime,
        slotDuration: av.slotDuration,
        isActive: av.isActive,
        createdAt: av.createdAt.toISOString()
      })),
      autoGenerateSlots: session.autoGenerateSlots || false,
      advanceBookingDays: session.advanceBookingDays || 30,
      totalSlots: session.availableSlots?.length || 0,
      availableSlots: session.availableSlots?.filter(slot => slot.isAvailable).length || 0
    };
  }

  /**
   * Transformer un document Session en DTO de réponse pour les créneaux disponibles
   */
  private transformToAvailableSlotsResponseDto(session: SessionDocument, startDate?: Date, endDate?: Date): AvailableSlotsResponseDto {
    let slots = session.availableSlots || [];
    
    // Filtrer par plage de dates si spécifiée
    if (startDate) {
      slots = slots.filter(slot => slot.startTime >= startDate);
    }
    if (endDate) {
      slots = slots.filter(slot => slot.startTime <= endDate);
    }

    const availableSlots = slots.filter(slot => slot.isAvailable);
    const bookedSlots = slots.filter(slot => !slot.isAvailable);

    return {
      slots: slots.map(slot => ({
        id: slot.id,
        startTime: slot.startTime.toISOString(),
        endTime: slot.endTime.toISOString(),
        isAvailable: slot.isAvailable,
        bookedBy: slot.bookedBy?.toString(),
        bookedAt: slot.bookedAt?.toISOString(),
        createdAt: slot.createdAt.toISOString()
      })),
      total: slots.length,
      available: availableSlots.length,
      booked: bookedSlots.length
    };
  }
}
