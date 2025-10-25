import type { User } from "./models"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "/professional-woman-avatar.png",
    role: "creator",
    verified: true,
    communities: [1, 2],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Alex Chen",
    email: "alex@example.com",
    avatar: "/professional-man-avatar.png",
    role: "creator",
    verified: true,
    communities: [3, 4],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
]

export const mockCommunities = [
  {
    id: "1",
    slug: "email-marketing-mastery",
    name: "Email Marketing Mastery",
    creator: "Sarah Johnson",
    creatorId: "1",
    creatorAvatar: "/professional-woman-avatar.png",
    description: "Master the art of email marketing and grow your business with proven strategies",
    category: "Marketing",
    members: 2847,
    rating: 4.8,
    price: 49,
    priceType: "monthly",
    image: "/email-marketing-dashboard.png",
    tags: ["Email Marketing", "Growth", "Automation", "Strategy"],
    verified: true,
    type: "community" as const,
  },
  {
    id: "2",
    slug: "brand-design-collective",
    name: "Brand Design Collective",
    creator: "Sarah Johnson",
    creatorId: "1",
    creatorAvatar: "/professional-woman-avatar.png",
    description: "Join a community of designers creating stunning brand identities",
    category: "Design",
    members: 1523,
    rating: 4.9,
    price: 0,
    priceType: "free",
    image: "/brand-design-workspace.jpg",
    tags: ["Branding", "Design", "Identity", "Creative"],
    verified: true,
    type: "community" as const,
  },
]

export const mockCourses = [
  {
    id: "1",
    slug: "complete-email-marketing",
    name: "Complete Email Marketing Course",
    creator: "Sarah Johnson",
    creatorId: "1",
    creatorAvatar: "/professional-woman-avatar.png",
    description: "Learn everything from email list building to advanced automation sequences",
    category: "Marketing",
    members: 1247,
    rating: 4.9,
    price: 199,
    priceType: "one-time",
    image: "/email-marketing-course.jpg",
    tags: ["Email", "Marketing", "Automation", "Conversion"],
    verified: true,
    type: "course" as const,
  },
  {
    id: "2",
    slug: "brand-identity-fundamentals",
    name: "Brand Identity Fundamentals",
    creator: "Sarah Johnson",
    creatorId: "1",
    creatorAvatar: "/professional-woman-avatar.png",
    description: "Master the principles of creating memorable brand identities",
    category: "Design",
    members: 892,
    rating: 4.7,
    price: 149,
    priceType: "one-time",
    image: "/brand-identity-design.png",
    tags: ["Branding", "Design", "Identity", "Logo"],
    verified: true,
    type: "course" as const,
  },
  {
    id: "3",
    slug: "advanced-copywriting",
    name: "Advanced Copywriting Techniques",
    creator: "Sarah Johnson",
    creatorId: "1",
    creatorAvatar: "/professional-woman-avatar.png",
    description: "Write compelling copy that converts and engages your audience",
    category: "Writing",
    members: 654,
    rating: 4.8,
    price: 179,
    priceType: "one-time",
    image: "/copywriting-workspace.jpg",
    tags: ["Copywriting", "Content", "Marketing", "Sales"],
    verified: true,
    type: "course" as const,
  },
]

export const mockChallenges = [
  {
    id: "1",
    slug: "30-day-email-challenge",
    name: "30-Day Email Growth Challenge",
    creator: "Sarah Johnson",
    creatorId: "1",
    creatorAvatar: "/professional-woman-avatar.png",
    description: "Grow your email list by 1000+ subscribers in 30 days with daily actionable tasks",
    category: "Marketing",
    members: 456,
    rating: 4.9,
    price: 97,
    priceType: "one-time",
    image: "/email-growth-challenge.jpg",
    tags: ["Challenge", "Email", "Growth", "30 Days"],
    verified: true,
    type: "challenge" as const,
  },
  {
    id: "2",
    slug: "brand-refresh-challenge",
    name: "7-Day Brand Refresh Challenge",
    creator: "Sarah Johnson",
    creatorId: "1",
    creatorAvatar: "/professional-woman-avatar.png",
    description: "Transform your brand identity in just one week with guided daily exercises",
    category: "Design",
    members: 328,
    rating: 4.8,
    price: 47,
    priceType: "one-time",
    image: "/brand-refresh-design.jpg",
    tags: ["Challenge", "Branding", "Design", "7 Days"],
    verified: true,
    type: "challenge" as const,
  },
]

export const mockEvents = [
  {
    id: "1",
    slug: "email-marketing-summit-2025",
    name: "Email Marketing Summit 2025",
    creator: "Sarah Johnson",
    creatorId: "1",
    creatorAvatar: "/professional-woman-avatar.png",
    description: "Join industry leaders for a full-day virtual summit on email marketing trends",
    category: "Marketing",
    members: 1847,
    rating: 4.9,
    price: 97,
    priceType: "one-time",
    image: "/virtual-summit-event.jpg",
    tags: ["Event", "Summit", "Email", "Virtual"],
    verified: true,
    type: "event" as const,
  },
  {
    id: "2",
    slug: "brand-design-workshop",
    name: "Brand Design Workshop",
    creator: "Sarah Johnson",
    creatorId: "1",
    creatorAvatar: "/professional-woman-avatar.png",
    description: "Hands-on workshop to create your brand identity from scratch",
    category: "Design",
    members: 124,
    rating: 5.0,
    price: 197,
    priceType: "one-time",
    image: "/collaborative-design-workshop.png",
    tags: ["Event", "Workshop", "Branding", "In-Person"],
    verified: true,
    type: "event" as const,
  },
]

export const mockSessions = [
  {
    id: "1",
    slug: "email-strategy-consultation",
    name: "Email Strategy Consultation",
    creator: "Sarah Johnson",
    creatorId: "1",
    creatorAvatar: "/professional-woman-avatar.png",
    description: "Get personalized email marketing strategy and implementation guidance",
    category: "Marketing",
    members: 89,
    rating: 5.0,
    price: 297,
    priceType: "per session",
    image: "/consultation-meeting.jpg",
    tags: ["1-on-1", "Consultation", "Email", "Strategy"],
    verified: true,
    type: "oneToOne" as const,
  },
  {
    id: "2",
    slug: "brand-audit-session",
    name: "Brand Audit & Feedback Session",
    creator: "Sarah Johnson",
    creatorId: "1",
    creatorAvatar: "/professional-woman-avatar.png",
    description: "Comprehensive review of your brand with actionable improvement recommendations",
    category: "Design",
    members: 67,
    rating: 5.0,
    price: 247,
    priceType: "per session",
    image: "/brand-audit-meeting.jpg",
    tags: ["1-on-1", "Audit", "Branding", "Feedback"],
    verified: true,
    type: "oneToOne" as const,
  },
]

export function getCommunitiesByCreator(creatorId: string) {
  return mockCommunities.filter((c) => c.creatorId === creatorId)
}

export function getCoursesByCreator(creatorId: string) {
  return mockCourses.filter((c) => c.creatorId === creatorId)
}

export function getChallengesByCreator(creatorId: string) {
  return mockChallenges.filter((c) => c.creatorId === creatorId)
}

export function getEventsByCreator(creatorId: string) {
  return mockEvents.filter((e) => e.creatorId === creatorId)
}

export function getSessionsByCreator(creatorId: string) {
  return mockSessions.filter((s) => s.creatorId === creatorId)
}

export function getFeatureBySlug(slug: string) {
  const allFeatures = [...mockCommunities, ...mockCourses, ...mockChallenges, ...mockEvents, ...mockSessions]
  return allFeatures.find((f) => f.slug === slug)
}
