// Import existing communities from mock-data and add the additional ones for the full communities data
import { communities, Community as CommunityType } from './mock-data';

export interface CommunitiesData {
  categories: string[];
  sortOptions: { value: string; label: string }[];
  communities: CommunityType[];
}

export interface ExploreData {
  categories: string[];
  sortOptions: { value: string; label: string }[];
  communities: Explore[];
}

export const mockCredentials = {
  email: "creator@chabqa.com",
  password: "password123",
}

export const mockPosts = [
  {
    id: 1,
    communityId: 1,
    author: "Sarah Johnson",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    content:
      "Just launched our new SEO masterclass! Who's excited to dive deep into keyword research strategies and advanced optimization techniques?",
    timestamp: "2 hours ago",
    likes: 45,
    comments: 12,
    views: 234,
    type: "announcement",
  },
  {
    id: 2,
    communityId: 1,
    author: "Mike Chen",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    content:
      "Thanks to the strategies learned here, I increased my client's organic traffic by 150% in just 3 months! The community support has been incredible.",
    timestamp: "5 hours ago",
    likes: 78,
    comments: 23,
    views: 456,
    type: "success",
  },
  {
    id: 3,
    communityId: 2,
    author: "Emma Wilson",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    content:
      "Just finished my latest UI design project! The feedback from this community has been invaluable in shaping my creative process.",
    timestamp: "1 day ago",
    likes: 92,
    comments: 18,
    views: 567,
    type: "showcase",
  },
  {
    id: 4,
    communityId: 2,
    author: "David Park",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    content:
      "New design challenge is live! This week we're focusing on mobile-first design principles and accessibility standards.",
    timestamp: "2 days ago",
    likes: 67,
    comments: 31,
    views: 789,
    type: "challenge",
  },
  {
    id: 5,
    communityId: 3,
    author: "Alex Chen",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    content:
      "Sharing a clean code review process that has improved our team's productivity by 40% while maintaining high quality standards.",
    timestamp: "3 hours ago",
    likes: 34,
    comments: 8,
    views: 123,
    type: "insight",
  },
  {
    id: 6,
    communityId: 3,
    author: "Lisa Zhang",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    content:
      "Minimalist approach to API design - less is more when it comes to developer experience and long-term maintainability.",
    timestamp: "1 day ago",
    likes: 56,
    comments: 14,
    views: 345,
    type: "tutorial",
  },
]

export type Explore = {
  id: string
  type: "community" | "course" | "challenge" | "product" | "oneToOne"
  name: string
  slug: string
  creator: string
  creatorAvatar: string
  description: string
  category: string
  members: number
  rating: number
  tags: string[]
  verified: boolean
  price: number
  priceType: "free" | "paid" | "monthly" | "yearly" | "hourly"
  image: number // Seulement des images locales (require)
  featured: boolean;
  link: string
  benefits?: string[] // What you'll get
}

export const ExploreData: { 
  communities: Explore[]
  sortOptions: { value: string; label: string }[]
  categories: string[]
 } = {
  communities: [
    {
      id: "1",
      type: "community",
      name: "Digital Marketing Mastery",
      slug: "digital-marketing-mastery",
      description: "Master digital marketing strategies, social media, and growth hacking techniques.",
      category: "Marketing",
      image: require('@/assets/images/email-marketing.png'),
      creator: "Sarah Johnson",
      creatorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b550?w=64&h=64&fit=crop&crop=face",
      members: 8234,
      rating: 4.9,
      tags: ["Digital Marketing", "Social Media", "Growth"],
      price: 39,
      priceType: "monthly",
      verified: true,
      featured: true,
      link: "/communities/digital-marketing-mastery",
      benefits: ["Weekly marketing workshops", "1-on-1 strategy sessions", "Resource library access", "Community networking"]
    },
    {
      id: "2",
      type: "community",
      name: "Email Marketing",
      slug: "email-marketing",
      description: "A community for professionals mastering email marketing strategies and campaigns.",
      category: "Marketing",
      image: require('@/assets/images/email-marketing.png'),
      creator: "Mohamed Mostafa",
      creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      members: 5234,
      rating: 4.9,
      tags: ["Email", "Automation", "Campaigns"],
      price: 29,
      priceType: "monthly",
      verified: true,
      featured: true,
      link: "/communities/email-marketing",
      benefits: ["Email templates library", "A/B testing guides", "Automation workflows", "Analytics dashboard"]
    },
    {
      id: "3",
      type: "community",
      name: "Branding Community",
      slug: "branding-community",
      description: "A community for designers and marketers passionate about building strong brand identities.",
      category: "Design",
      image: require('@/assets/images/branding-hero.png'),
      creator: "Sarah Johnson",
      creatorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b550?w=64&h=64&fit=crop&crop=face",
      members: 3456,
      rating: 4.8,
      tags: ["Branding", "Identity", "Strategy"],
      price: 0,
      priceType: "free",
      verified: true,
      featured: true,
      link: "/communities/branding-community",
      benefits: ["Brand strategy guides", "Logo design resources", "Community feedback", "Design inspiration"]
    },
    {
      id: "4",
      type: "community",
      name: "Fitness Community",
      slug: "fitness-community",
      description: "A community for fitness enthusiasts to share workouts, nutrition tips, and motivation.",
      category: "Fitness",
      image: require('@/assets/images/Personal-coaching-fitness.png'),
      creator: "Alex Chen",
      creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      members: 2156,
      rating: 4.7,
      tags: ["Workout", "Health", "Motivation"],
      price: 15,
      priceType: "monthly",
      verified: true,
      featured: true,
      link: "/communities/fitness-community",
      benefits: ["Custom workout plans", "Nutrition tracking", "Progress monitoring", "Group challenges"]
    },
    {
      id: "5",
      type: "community",
      name: "Website Vitrine",
      slug: "website-vitrine",
      description: "Design, SEO et conversion pour des sites vitrines simples et efficaces.",
      category: "Web Design",
      image: require('@/assets/images/website-vitrine.png'),
      creator: "Soumaya Chen",
      creatorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      members: 2156,
      rating: 4.7,
      tags: ["Showcase", "UX/UI", "SEO"],
      price: 15,
      priceType: "monthly",
      verified: true,
      featured: true,
      link: "/communities/website-vitrine",
      benefits: ["Website templates", "SEO optimization tools", "Conversion strategies", "Design reviews"]
    },
    // --- Courses ---
    {
      id: '6',
      type: "course",
      name: "Mastering React",
      slug: "mastering-react",
      description: "An in-depth React course covering hooks, state, and best practices.",
      category: "Development",
      image: require('@/assets/images/background.png'),
      creator: "Alice Johnson",
      creatorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face",
      members: 340,
      rating: 4.7,
      tags: ["React", "Frontend", "JavaScript"],
      price: 99,
      priceType: "paid",
      verified: true,
      featured: false,
      link: "/courses/mastering-react",
      benefits: ["15 hours of video content", "Source code access", "Certificate of completion", "Lifetime access"]
    },
    {
      id: '7',
      type: "course",
      name: "UI/UX Essentials",
      slug: "uiux-essentials",
      description: "Learn the principles of modern UI and UX design with Figma.",
      category: "Design",
      image: require('@/assets/images/background.png'),
      creator: "Mohamed Ali",
      creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      members: 220,
      rating: 4.5,
      tags: ["UI", "UX", "Figma"],
      price: 59,
      priceType: "paid",
      verified: false,
      featured: false,
      link: "/courses/uiux-essentials",
      benefits: ["Figma templates", "Design principles guide", "Portfolio projects", "Instructor feedback"]
    },
    // --- Challenges ---
    {
      id: '8',
      type: "challenge",
      name: "30 Days of JavaScript",
      slug: "30days-js",
      description: "Daily coding exercises to sharpen your JavaScript skills.",
      category: "Programming",
      image: require('@/assets/images/background.png'),
      creator: "Sara Lee",
      creatorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=face",
      members: 500,
      rating: 4.2,
      tags: ["JavaScript", "Frontend", "Coding"],
      price: 0,
      priceType: "free",
      verified: true,
      featured: false,
      link: "/challenges/30days-js",
      benefits: ["Daily coding exercises", "Progress tracking", "Community support", "Completion certificate"]
    },
    // --- Products ---
    {
      id: '9',
      type: "product",
      name: "IoT Smart Kit",
      slug: "iot-smart-kit",
      description: "A complete kit to build IoT prototypes with sensors and modules.",
      category: "Hardware",
      image: require('@/assets/images/background.png'),
      creator: "TechStore",
      creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      members: 0,
      rating: 4.9,
      tags: ["IoT", "Electronics", "Prototyping"],
      price: 199,
      priceType: "paid",
      verified: true,
      featured: false,
      link: "/products/iot-smart-kit",
      benefits: ["Complete hardware kit", "Setup instructions", "Code examples", "Technical support"]
    },
    // --- One-to-One ---
    {
      id: '10',
      type: "oneToOne",
      name: "React Mentorship",
      slug: "react-mentorship",
      description: "1:1 mentorship sessions to help you become a React pro.",
      category: "Mentorship",
      image: require('@/assets/images/background.png'),
      creator: "Mentor John",
      creatorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face",
      members: 25,
      rating: 5.0,
      tags: ["React", "Mentorship", "Career"],
      price: 50,
      priceType: "hourly",
      verified: true,
      featured: false,
      link: "/sessions/react-mentorship",
      benefits: ["Personal 1-on-1 sessions", "Custom learning path", "Code review", "Career guidance"]
    },
  ],
  categories: [
    "All",
    "Community", 
    "Course",
    "Challenge",
    "Product",
    "1-to-1 Sessions",
    "Event"
  ],
  sortOptions: [
    { value: "popular", label: "Most Popular" },
    { value: "newest", label: "Newest" },
    { value: "members", label: "Most Members" },
    { value: "rating", label: "Highest Rated" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ],
}

export const communitiesData: CommunitiesData = {
  categories: [
    "All",
    "Community", 
    "Course",
    "Challenge",
    "Product",
    "1-to-1 Sessions",
    "Event"
  ],
  sortOptions: [
    { value: "popular", label: "Most Popular" },
    { value: "newest", label: "Newest" },
    { value: "members", label: "Most Members" },
    { value: "rating", label: "Highest Rated" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ],
  communities: [
    ...communities
  ]
}

// Export du type Community pour utilisation dans les composants
export type Community = CommunityType;

export default { communitiesData, ExploreData };
