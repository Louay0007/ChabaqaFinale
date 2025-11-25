// app/manage-challenge/[challengeId]/page.tsx
import ChallengeManager from "./components/ChallengeManager"
import { api } from "@/lib/api"
import { notFound } from "next/navigation"
import { Challenge, ChallengeTask } from "@/lib/models"
import { Challenge as ApiChallenge, ChallengeTask as ApiChallengeTask } from "@/lib/api/types"

export default async function ManageChallengePage({
  params,
}: {
  params: { challengeId: string }
}) {
  try {
    const challengeResponse = await api.challenges.getById(params.challengeId)
    const apiChallenge = challengeResponse.data
    
    if (!apiChallenge) {
      notFound()
    }

    // Get challenge tasks
    const tasksResponse = await api.challenges.getTasks(params.challengeId)
    const apiChallengeTasks = tasksResponse.data || []

    // Convert API types to frontend types
    const convertChallenge = (apiChallenge: ApiChallenge): Challenge => ({
      id: apiChallenge.id,
      title: apiChallenge.title,
      description: apiChallenge.description,
      communityId: apiChallenge.communityId || '',
      community: {
        id: apiChallenge.communityId || '',
        slug: '',
        name: '',
        creator: '',
        creatorId: apiChallenge.creatorId || '',
        creatorAvatar: '',
        description: '',
        longDescription: '',
        category: '',
        members: 0,
        rating: 0,
        price: 0,
        priceType: 'free',
        image: '',
        coverImage: '',
        tags: [],
        featured: false,
        verified: false,
        createdDate: '',
        settings: {
          primaryColor: '#8e78fb',
          secondaryColor: '#47c7ea',
          welcomeMessage: 'Welcome to our amazing community!',
          features: ['Expert-led courses', 'Interactive challenges', '1-on-1 mentoring', 'Community support'],
          benefits: [
            'Access to exclusive content',
            'Direct mentor feedback',
            'Career guidance',
            'Networking opportunities',
          ],
          template: 'modern',
          fontFamily: 'inter',
          borderRadius: 12,
          backgroundStyle: 'gradient',
          heroLayout: 'centered',
          showStats: true,
          showFeatures: true,
          showTestimonials: true,
          showPosts: true,
          showFAQ: true,
          enableAnimations: true,
          enableParallax: false,
          logo: '',
          heroBackground: '',
          gallery: [],
          videoUrl: undefined,
          socialLinks: {},
          customSections: [],
          metaTitle: '',
          metaDescription: '',
        },
        stats: {
          totalRevenue: 0,
          monthlyGrowth: 0,
          engagementRate: 0,
          retentionRate: 0,
        }
      },
      creatorId: apiChallenge.creatorId || '',
      creator: {
        id: apiChallenge.creatorId || '',
        name: 'Unknown Creator',
        email: '',
        avatar: '',
        role: 'creator',
        verified: false,
        communities: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      startDate: new Date(apiChallenge.startDate),
      endDate: new Date(apiChallenge.endDate),
      isActive: apiChallenge.isActive || false,
      participants: [],
      posts: [],
      createdAt: new Date(),
      resources: [],
    } as any as Challenge)

    const convertChallengeTask = (apiTask: ApiChallengeTask): ChallengeTask => ({
      id: apiTask.id,
      challengeId: apiTask.challengeId,
      day: Number(apiTask.order) || 1,
      title: apiTask.title,
      description: apiTask.description || '',
      deliverable: apiTask.description || '',
      isCompleted: false,
      isActive: true,
      points: Number(apiTask.points) || 10,
      resources: [],
      instructions: '',
      notes: '',
    } as any as ChallengeTask)

    const challenge = convertChallenge(apiChallenge)
    const challengeTasks = apiChallengeTasks.map(convertChallengeTask)

    return (
      <ChallengeManager
        challenge={challenge}
        challengeTasks={challengeTasks}
        challengeId={params.challengeId}
      />
    )
  } catch (error) {
    console.error('Failed to fetch challenge:', error)
    notFound()
  }
}