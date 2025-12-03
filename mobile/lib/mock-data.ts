// Type definitions for our data models
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'creator' | 'member';
  verified: boolean;
  communities: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  creator: string;
  creatorId: string;
  creatorAvatar?: string;
  description: string;
  longDescription: string;
  category: string;
  type?: "community" | "course" | "challenge" | "product" | "oneToOne" | "event";
  members: number;
  rating: number;
  price: number;
  priceType: string;
  image: string;
  coverImage: string;
  tags: string[];
  featured: boolean;
  verified: boolean;
  createdDate: string;
  updatedDate?: string;
  settings: {
    primaryColor: string;
    secondaryColor: string;
    welcomeMessage: string;
    features: string[];
    benefits: string[];
    template: string;
    fontFamily: string;
    borderRadius: number;
    backgroundStyle: string;
    heroLayout: string;
    showStats: boolean;
    showFeatures: boolean;
    showTestimonials: boolean;
    showPosts: boolean;
    showFAQ: boolean;
    enableAnimations: boolean;
    enableParallax: boolean;
    logo?: string;
    heroBackground?: string;
    gallery?: string[];
    videoUrl?: string;
    socialLinks?: {
      twitter?: string;
      instagram?: string;
      linkedin?: string;
      discord?: string;
      behance?: string;
      github?: string;
    };
    customSections?: {
      id: number;
      type: string;
      title: string;
      content: string;
      visible: boolean;
    }[];
    metaTitle?: string;
    metaDescription?: string;
  };
  stats?: {
    totalRevenue: number;
    monthlyGrowth: number;
    engagementRate: number;
    retentionRate: number;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  communityId: string;
  community: Community;
  creatorId: string;
  creator: User;
  price: number;
  currency: string;
  isPublished: boolean;
  sections: CourseSection[];
  enrollments: CourseEnrollment[];
  createdAt: Date;
  updatedAt: Date;
  category: string;
  level: string;
  duration: string;
  learningObjectives: string[];
  requirements: string[];
  notes: string;
  resources: CourseResource[];
}

export interface CourseSection {
  id: string;
  title: string;
  description: string;
  courseId: string;
  order: number;
  chapters: CourseChapter[];
  createdAt: Date;
}

export interface CourseChapter {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  duration: number;
  sectionId: string;
  order: number;
  isPreview: boolean;
  price?: number;
  notes?: string;
  resources: CourseResource[];
  createdAt: Date;
}

export interface CourseResource {
  id: string;
  title: string;
  type: string;
  url: string;
  description: string;
  order: number;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  user: User;
  courseId: string;
  course: Course;
  progress: CourseProgress[];
  enrolledAt: Date;
  isActive: boolean;
}

export interface CourseProgress {
  id: string;
  enrollmentId: string;
  chapterId: string;
  chapter: CourseChapter;
  isCompleted: boolean;
  watchTime: number;
  completedAt?: Date;
  lastAccessedAt: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  communityId: string;
  community: Community;
  creatorId: string;
  creator: User;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  participants: ChallengeParticipant[];
  posts: any[];
  createdAt: Date;
  depositAmount: number;
  maxParticipants: number;
  completionReward: number;
  topPerformerBonus: number;
  streakBonus: number;
  category: string;
  difficulty: string;
  duration: string;
  thumbnail: string;
  notes: string;
  resources: ChallengeResource[];
}

export interface ChallengeResource {
  id: string;
  title: string;
  type: string;
  url: string;
  description: string;
  order: number;
}

export interface ChallengeTask {
  id: string;
  challengeId: string;
  day: number;
  title: string;
  description: string;
  deliverable: string;
  isCompleted: boolean;
  isActive: boolean;
  points: number;
  resources: any[];
  instructions: string;
  notes: string;
}

export interface ChallengeParticipant {
  id: string;
  userId: string;
  user: User;
  challengeId: string;
  challenge: Challenge;
  joinedAt: Date;
  isActive: boolean;
  progress: number;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  currency: string;
  communityId: string;
  community: Community;
  creatorId: string;
  creator: User;
  isActive: boolean;
  bookings: SessionBooking[];
  createdAt: Date;
  category: string;
  maxBookingsPerWeek: number;
  notes: string;
  resources: SessionResource[];
}

export interface SessionResource {
  id: string;
  title: string;
  type: string;
  url: string;
  description: string;
  order: number;
}

export interface SessionBooking {
  id: string;
  sessionId: string;
  session: Session;
  userId: string;
  user: User;
  scheduledAt: Date;
  status: string;
  meetingUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  communityId: string;
  community?: Community;
  creatorId: string;
  creator: User;
  price: number;
  currency: string;
  category: string;
  tags: string[];
  files?: ProductFile[];
  features?: string[];
  licenseTerms?: string;
  rating?: number;
  sales: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Additional properties for mobile UI
  thumbnail?: string;
  author?: string;
  views?: number;
  downloads?: number;
  duration?: string;
}

// Event related interfaces
export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  communityId: string;
  community?: Community;
  creatorId: string;
  creator: User;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  type: "In-person" | "Online" | "Hybrid";
  onlineUrl?: string;
  maxAttendees?: number;
  currentAttendees: number;
  isPublished: boolean;
  tickets: EventTicket[];
  speakers: EventSpeaker[];
  agenda?: EventAgendaItem[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EventTicket {
  id: string;
  eventId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  maxQuantity: number;
  sold: number;
  isActive: boolean;
  benefits: string[];
}

export interface EventSpeaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  photo?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface EventAgendaItem {
  id: string;
  eventId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  speakerId?: string;
  speaker?: EventSpeaker;
  type: "session" | "break" | "networking";
}

export interface EventRegistration {
  id: string;
  eventId: string;
  event: Event;
  userId: string;
  user: User;
  ticketId: string;
  ticket: EventTicket;
  quantity: number;
  totalAmount: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled" | "attended";
  notes?: string;
  registeredAt: Date;
  updatedAt: Date;
}

export interface ProductFile {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  productId: string;
  previewUrl?: string;
}

export interface Purchase {
  id: string;
  userId: string;
  user: User;
  productId: string;
  product: Product;
  purchasedAt: Date;
  downloadCount: number;
  amount: number;
  currency: string;
  status: string;
}

// Mock users data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b550?w=150&h=150&fit=crop&crop=face",
    role: "creator",
    verified: true,
    communities: [1, 2],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    role: "member",
    verified: true,
    communities: [1, 2],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    role: "member",
    verified: true,
    communities: [1, 2],
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "4",
    name: "David Kim",
    email: "david@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    role: "member",
    verified: true,
    communities: [1, 2],
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "5",
    name: "Alex Thompson",
    email: "alex@example.com",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    role: "creator",
    verified: true,
    communities: [1, 2],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
];

// Mock communities data
export const communities: Community[] = [
  {
    id: "1",
    slug: "digital-marketing-mastery",
    name: "digital-marketing-mastery",
    creator: "Mohamed Mostafa",
    creatorId: "1",
    creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    description:
      "Master email marketing strategies to grow your audience and boost conversions. Join 5,000+ professionals optimizing their campaigns.",
    longDescription:
      "Welcome to the Email Marketing community, where digital professionals learn to craft high-converting campaigns. Our group provides exclusive courses, live workshops, ready-to-use templates, and direct guidance from email marketing experts.",
    category: "Marketing",
    type: "community",
    members: 5234,
    rating: 4.9,
    price: 29,
    priceType: "monthly",
    image: require('@/assets/images/email-marketing.png'),
    coverImage: require('@/assets/images/email-marketing.png'),
    tags: ["SEO", "Social Media", "Analytics", "Strategy", "PPC", "Content Marketing"],
    featured: true,
    verified: true,
    createdDate: "2024-01-15",
    updatedDate: "2024-03-01",
    settings: {
      primaryColor: "#3b82f6",
      secondaryColor: "#1e40af",
      welcomeMessage: "Welcome to our professional marketing community!",
      features: [
        "Live Workshops",
        "1-on-1 Mentoring",
        "Resource Library",
        "Private Discord",
        "Weekly Webinars",
        "Expert Q&A",
      ],
      benefits: [
        "Weekly live training sessions with industry experts",
        "Access to exclusive marketing tools and templates",
        "Direct feedback on your campaigns and strategies",
        "Networking with 5000+ professional marketers",
        "Monthly case study reviews and analysis",
        "Priority support and consultation opportunities",
      ],
      template: "modern",
      fontFamily: "inter",
      borderRadius: 12,
      backgroundStyle: "gradient",
      heroLayout: "centered",
      showStats: true,
      showFeatures: true,
      showTestimonials: true,
      showPosts: true,
      showFAQ: true,
      enableAnimations: true,
      enableParallax: false,
      logo: "https://via.placeholder.com/80",
      heroBackground: "https://via.placeholder.com/1200x600",
      gallery: [
        "https://via.placeholder.com/400x300",
        "https://via.placeholder.com/400x300",
        "https://via.placeholder.com/400x300",
      ],
      videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      socialLinks: {
        twitter: "https://twitter.com/community",
        instagram: "https://instagram.com/community",
        linkedin: "https://linkedin.com/company/community",
        discord: "https://discord.gg/community",
      },
      customSections: [
        {
          id: 1,
          type: "text",
          title: "About Our Community",
          content: "We're a passionate group of marketers dedicated to sharing knowledge and growing together.",
          visible: true,
        },
      ],
      metaTitle: "Digital Marketing Mastery - Learn from Industry Experts",
      metaDescription:
        "Join 5,000+ marketers learning advanced digital marketing strategies from industry experts. Exclusive courses, live workshops, and networking opportunities.",
    },
    stats: {
      totalRevenue: 152460,
      monthlyGrowth: 12.5,
      engagementRate: 78,
      retentionRate: 89,
    },
  },
  {
    id: "2",
    slug: "creative-design-hub",
    name: "Branding Community",
    creator: "Sarah Johnson",
    creatorId: "1",
    creatorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b550?w=150&h=150&fit=crop&crop=face",
    description: "A community for designers and marketers passionate about building strong brand identities.",
    longDescription:
      "Join thousands of creative professionals in our branding community. Share your work, get constructive feedback, participate in branding challenges, and grow your creative network.",
    category: "Design",
    type: "community",
    members: 3456,
    rating: 4.8,
    price: 0,
    priceType: "free",
    image: require('@/assets/images/branding-hero.png'),
    coverImage: require('@/assets/images/branding-hero.png'),
    tags: ["UI/UX", "Branding", "Illustration", "Portfolio", "Typography"],
    featured: false,
    verified: true,
    createdDate: "2024-02-01",
    settings: {
      primaryColor: "#ec4899",
      secondaryColor: "#8b5cf6",
      welcomeMessage: "Welcome to the creative hub where imagination comes to life!",
      features: [
        "Design Challenges",
        "Portfolio Reviews",
        "Resource Sharing",
        "Collaboration Board",
        "Creative Workshops",
        "Inspiration Gallery",
      ],
      benefits: [
        "Weekly design challenges with amazing prizes",
        "Portfolio feedback sessions with industry experts",
        "Access to premium design resources and tools",
        "Collaboration opportunities with fellow creatives",
        "Monthly creative workshops and masterclasses",
        "Showcase your work to potential clients",
      ],
      template: "creative",
      fontFamily: "poppins",
      borderRadius: 16,
      backgroundStyle: "pattern",
      heroLayout: "split",
      showStats: true,
      showFeatures: true,
      showTestimonials: false,
      showPosts: true,
      showFAQ: false,
      enableAnimations: true,
      enableParallax: true,
      logo: "https://via.placeholder.com/80",
      heroBackground: "https://via.placeholder.com/1200x600",
      gallery: ["https://via.placeholder.com/400x300", "https://via.placeholder.com/400x300"],
      socialLinks: {
        instagram: "https://instagram.com/designhub",
        behance: "https://behance.net/designhub",
      },
      customSections: [],
      metaTitle: "Creative Design Hub - Share, Learn, and Collaborate",
      metaDescription:
        "Join thousands of creative professionals sharing work, getting feedback, and collaborating on design projects. Free community for designers.",
    },
    stats: {
      totalRevenue: 0,
      monthlyGrowth: 8.3,
      engagementRate: 85,
      retentionRate: 92,
    },
  },
  {
    id: "3",
    slug: "website-vitrine",
    name: "Website Vitrine",
    creator: "Soumaya Chen",
    creatorId: "2",
    creatorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    description: "Design, SEO et conversion pour des sites vitrines simples et efficaces.",
    longDescription:
      "Rejoignez une communauté dédiée aux sites vitrines. Apprenez les meilleures pratiques de design, SEO et conversion pour créer des sites web performants.",
    category: "Web Design",
    type: "community",
    members: 2156,
    rating: 4.7,
    price: 15,
    priceType: "monthly",
    image: require('@/assets/images/website-vitrine.png'),
    coverImage: require('@/assets/images/website-vitrine.png'),
    tags: ["Programming", "Minimalism", "Focus", "Quality"],
    featured: false,
    verified: true,
    createdDate: "2024-03-01",
    settings: {
      primaryColor: "#1f2937",
      secondaryColor: "#6b7280",
      welcomeMessage: "Welcome to focused learning and meaningful connections.",
      features: [
        "Code Reviews",
        "Tech Talks",
        "Mentorship",
        "Resource Curation",
        "Focus Sessions",
        "Quality Discussions",
      ],
      benefits: [
        "Distraction-free learning environment",
        "Quality over quantity content and discussions",
        "Direct access to industry experts and mentors",
        "Focused skill development programs",
        "Curated resources and learning materials",
        "Meaningful professional connections",
      ],
      template: "creative",
      fontFamily: "inter",
      borderRadius: 8,
      backgroundStyle: "solid",
      heroLayout: "centered",
      showStats: true,
      showFeatures: true,
      showTestimonials: false,
      showPosts: true,
      showFAQ: false,
      enableAnimations: false,
      enableParallax: false,
      logo: "https://via.placeholder.com/80",
      heroBackground: "https://via.placeholder.com/1200x600",
      gallery: [],
      socialLinks: {
        github: "https://github.com/techcommunity",
        linkedin: "https://linkedin.com/company/techcommunity",
      },
      customSections: [],
      metaTitle: "Minimal Tech Community - Focused Learning for Tech Professionals",
      metaDescription:
        "A distraction-free community for tech professionals who value simplicity and quality. Connect, learn, and grow with like-minded developers.",
    },
    stats: {
      totalRevenue: 32340,
      monthlyGrowth: 5.2,
      engagementRate: 92,
      retentionRate: 95,
    },
  },
  {
    id: "4",
    slug: "premium-design-assets",
    name: "Premium Design Assets",
    creator: "Emily Rodriguez",
    creatorId: "3",
    creatorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    description: "High-quality design assets, templates, and resources for creative professionals.",
    longDescription:
      "Access our premium collection of design assets including UI kits, icons, illustrations, templates, and more. Perfect for designers and developers looking for high-quality resources.",
    category: "Design",
    type: "product",
    members: 1829,
    rating: 4.9,
    price: 49,
    priceType: "one-time",
    image: "https://via.placeholder.com/400x600",
    coverImage: "https://via.placeholder.com/800x300",
    tags: ["UI Kits", "Icons", "Templates", "Illustrations", "Assets"],
    featured: true,
    verified: true,
    createdDate: "2024-02-15",
    updatedDate: "2024-03-05",
    settings: {
      primaryColor: "#6366f1",
      secondaryColor: "#4f46e5",
      welcomeMessage: "Welcome to our premium design asset store!",
      features: [
        "High-Quality Assets",
        "Commercial License",
        "Regular Updates",
        "Instant Download",
        "Photoshop & Figma Files",
        "24/7 Support",
      ],
      benefits: [
        "Save hours of design work with ready-to-use assets",
        "Commercial license included for all products",
        "Regular updates with new assets added monthly",
        "Instant access to all downloads after purchase",
        "Compatible with popular design tools",
        "Professional support when you need help",
      ],
      template: "modern",
      fontFamily: "inter",
      borderRadius: 12,
      backgroundStyle: "gradient",
      heroLayout: "centered",
      showStats: true,
      showFeatures: true,
      showTestimonials: true,
      showPosts: false,
      showFAQ: true,
      enableAnimations: true,
      enableParallax: false,
      logo: "https://via.placeholder.com/80",
      heroBackground: "https://via.placeholder.com/1200x600",
      gallery: [
        "https://via.placeholder.com/400x300",
        "https://via.placeholder.com/400x300",
      ],
      socialLinks: {
        instagram: "https://instagram.com/designassets",
        behance: "https://behance.net/designassets",
      },
      customSections: [],
      metaTitle: "Premium Design Assets - High-Quality Resources for Creatives",
      metaDescription:
        "Download premium design assets including UI kits, icons, templates and more. Commercial license included.",
    },
    stats: {
      totalRevenue: 89750,
      monthlyGrowth: 15.7,
      engagementRate: 72,
      retentionRate: 88,
    },
  },
  {
    id: "5",
    slug: "personal-coaching-sessions",
    name: "Personal Coaching Sessions",
    creator: "David Kim",
    creatorId: "4",
    creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    description: "One-on-one coaching sessions for career development and personal growth.",
    longDescription:
      "Get personalized coaching and mentorship from experienced professionals. Book individual sessions tailored to your specific goals and challenges.",
    category: "Coaching",
    type: "oneToOne",
    members: 234,
    rating: 4.8,
    price: 150,
    priceType: "per session",
    image: require('@/assets/images/Personal-coaching-fitness.png'),
    coverImage: require('@/assets/images/Personal-coaching-fitness.png'),
    tags: ["Coaching", "Mentorship", "Career", "Growth", "Personal Development"],
    featured: false,
    verified: true,
    createdDate: "2024-03-01",
    updatedDate: "2024-03-10",
    settings: {
      primaryColor: "#F7567C",
      secondaryColor: "#e11d48",
      welcomeMessage: "Welcome to personalized coaching and mentorship!",
      features: [
        "1-on-1 Sessions",
        "Personalized Plans",
        "Flexible Scheduling",
        "Goal Tracking",
        "Follow-up Support",
        "Resource Library",
      ],
      benefits: [
        "Personalized coaching tailored to your specific needs",
        "Flexible scheduling to fit your busy lifestyle",
        "Expert guidance from experienced professionals",
        "Goal-oriented approach with measurable outcomes",
        "Ongoing support between sessions",
        "Access to exclusive resources and tools",
      ],
      template: "modern",
      fontFamily: "inter",
      borderRadius: 12,
      backgroundStyle: "solid",
      heroLayout: "centered",
      showStats: true,
      showFeatures: true,
      showTestimonials: true,
      showPosts: false,
      showFAQ: true,
      enableAnimations: true,
      enableParallax: false,
      logo: "https://via.placeholder.com/80",
      heroBackground: "https://via.placeholder.com/1200x600",
      gallery: [],
      socialLinks: {
        linkedin: "https://linkedin.com/in/coaching",
      },
      customSections: [],
      metaTitle: "Personal Coaching Sessions - One-on-One Professional Development",
      metaDescription:
        "Book personalized coaching sessions for career development and personal growth. Expert guidance tailored to your goals.",
    },
    stats: {
      totalRevenue: 35100,
      monthlyGrowth: 8.9,
      engagementRate: 95,
      retentionRate: 91,
    },
  },
  {
    id: "6",
    slug: "tech-conference-2024",
    name: "Tech Conference 2024",
    creator: "Alex Thompson",
    creatorId: "5",
    creatorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    description: "Annual tech conference featuring industry leaders and cutting-edge technologies.",
    longDescription:
      "Join us for the biggest tech event of the year. Network with industry professionals, learn about the latest technologies, and gain insights from thought leaders.",
    category: "Technology",
    type: "event",
    members: 2847,
    rating: 4.7,
    price: 299,
    priceType: "ticket",
    image: "https://via.placeholder.com/400x600",
    coverImage: "https://via.placeholder.com/800x300",
    tags: ["Conference", "Networking", "Technology", "Innovation", "Learning"],
    featured: true,
    verified: true,
    createdDate: "2024-01-10",
    updatedDate: "2024-03-15",
    settings: {
      primaryColor: "#9333ea",
      secondaryColor: "#7c3aed",
      welcomeMessage: "Welcome to the premier tech conference experience!",
      features: [
        "Keynote Speakers",
        "Technical Sessions",
        "Networking Events",
        "Exhibition Hall",
        "Workshops",
        "Live Streaming",
      ],
      benefits: [
        "Learn from industry-leading experts and innovators",
        "Network with thousands of tech professionals",
        "Discover the latest technologies and trends",
        "Hands-on workshops and interactive sessions",
        "Access to exclusive content and resources",
        "Professional development opportunities",
      ],
      template: "modern",
      fontFamily: "inter",
      borderRadius: 12,
      backgroundStyle: "gradient",
      heroLayout: "split",
      showStats: true,
      showFeatures: true,
      showTestimonials: true,
      showPosts: true,
      showFAQ: true,
      enableAnimations: true,
      enableParallax: true,
      logo: "https://via.placeholder.com/80",
      heroBackground: "https://via.placeholder.com/1200x600",
      gallery: [
        "https://via.placeholder.com/400x300",
        "https://via.placeholder.com/400x300",
        "https://via.placeholder.com/400x300",
      ],
      socialLinks: {
        twitter: "https://twitter.com/techconf2024",
        linkedin: "https://linkedin.com/company/techconf",
      },
      customSections: [
        {
          id: 1,
          type: "schedule",
          title: "Event Schedule",
          content: "Check out our comprehensive schedule with all sessions, workshops, and networking events.",
          visible: true,
        },
      ],
      metaTitle: "Tech Conference 2024 - Premier Technology Event",
      metaDescription:
        "Join the biggest tech conference of the year. Network with industry leaders and discover cutting-edge technologies.",
    },
    stats: {
      totalRevenue: 851653,
      monthlyGrowth: 22.3,
      engagementRate: 89,
      retentionRate: 76,
    },
  },
];

// Mock courses data
const mockCourseResources: CourseResource[] = [
  {
    id: "1",
    title: "HTML5 Cheat Sheet",
    type: "pdf",
    url: "/resources/html5-cheat-sheet.pdf",
    description: "Complete HTML5 elements and attributes reference",
    order: 1,
  },
  {
    id: "2",
    title: "CSS Grid Generator",
    type: "tool",
    url: "https://cssgrid-generator.netlify.app/",
    description: "Interactive CSS Grid layout generator",
    order: 2,
  },
];

// Mock courses
export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, and Node.js from scratch.",
    thumbnail: "https://via.placeholder.com/300x200",
    communityId: "1",
    community: communities[0],
    creatorId: "1",
    creator: mockUsers[0],
    price: 199,
    currency: "USD",
    isPublished: true,
    sections: [],
    enrollments: [],
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
    category: "Web Development",
    level: "Beginner",
    duration: "40 hours",
    learningObjectives: [
      "Build responsive websites with HTML, CSS, and JavaScript",
      "Create interactive web applications with React",
    ],
    requirements: ["Basic computer skills", "Internet connection"],
    notes: "This is a comprehensive course that covers all aspects of modern web development.",
    resources: mockCourseResources,
  },
  {
    id: "2",
    title: "React Mastery Course",
    description: "Master React hooks, context, performance optimization, and testing strategies.",
    thumbnail: "https://via.placeholder.com/300x200",
    communityId: "1",
    community: communities[0],
    creatorId: "1",
    creator: mockUsers[0],
    price: 0,
    currency: "USD",
    isPublished: true,
    sections: [],
    enrollments: [],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    category: "Web Development",
    level: "Intermediate",
    duration: "15 hours",
    learningObjectives: [
      "Master React hooks and state management",
      "Understand component lifecycle and optimization",
    ],
    requirements: ["Basic JavaScript knowledge", "Understanding of HTML and CSS"],
    notes: "Focus on understanding React concepts deeply rather than rushing through the content.",
    resources: mockCourseResources,
  },
];

// Mock challenges
export const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "30-Day Coding Challenge",
    description: "Build 30 projects in 30 days to master web development fundamentals",
    communityId: "1",
    community: communities[0],
    creatorId: "1",
    creator: mockUsers[0],
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-03-01"),
    isActive: true,
    participants: [],
    posts: [],
    createdAt: new Date("2024-01-25"),
    depositAmount: 50,
    maxParticipants: 100,
    completionReward: 25,
    topPerformerBonus: 100,
    streakBonus: 10,
    category: "Web Development",
    difficulty: "Beginner",
    duration: "30 days",
    thumbnail: "https://via.placeholder.com/300x200",
    notes: "This challenge is designed to build consistent coding habits. Focus on completing each day's task.",
    resources: [],
  },
];

// Mock products data
export const mockProducts: Product[] = [
  {
    id: "1",
    title: "Modern Landing Page Template",
    description: "Beautiful responsive landing page template with modern design and smooth animations",
    images: ["https://picsum.photos/400/300?random=1", "https://picsum.photos/400/300?random=2"],
    communityId: "1",
    creatorId: "1",
    creator: mockUsers[0],
    price: 29,
    currency: "USD",
    category: "Templates",
    tags: ["HTML", "CSS", "JavaScript", "Responsive"],
    files: [
      {
        id: "1",
        name: "landing-page.html",
        type: "html",
        size: "45 KB",
        url: "/downloads/landing-page.html",
        productId: "1",
        previewUrl: "https://picsum.photos/600/400?random=10"
      },
      {
        id: "2",
        name: "styles.css",
        type: "css",
        size: "12 KB",
        url: "/downloads/styles.css",
        productId: "1"
      },
      {
        id: "3",
        name: "script.js",
        type: "js",
        size: "8 KB",
        url: "/downloads/script.js",
        productId: "1"
      }
    ],
    features: [
      "Fully responsive design",
      "Modern animations",
      "Clean code structure",
      "Cross-browser compatible"
    ],
    licenseTerms: "Personal and commercial use allowed. Cannot be resold or redistributed.",
    rating: 4.8,
    sales: 156,
    isPublished: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    // Additional properties for mobile UI
    thumbnail: "https://picsum.photos/400/300?random=1",
    author: "Sarah Johnson",
    views: 1250,
    downloads: 156,
    duration: "1-2 hours setup"
  },
  {
    id: "2",
    title: "React Dashboard Kit",
    description: "Complete dashboard UI kit with React components and charts",
    images: ["https://picsum.photos/400/300?random=3", "https://picsum.photos/400/300?random=4"],
    communityId: "1",
    creatorId: "1",
    creator: mockUsers[0],
    price: 0,
    currency: "USD",
    category: "Assets",
    tags: ["React", "Dashboard", "UI Kit", "Components"],
    files: [
      {
        id: "4",
        name: "dashboard-components.zip",
        type: "zip",
        size: "2.5 MB",
        url: "/downloads/dashboard-components.zip",
        productId: "2",
        previewUrl: "https://picsum.photos/600/400?random=11"
      },
      {
        id: "5",
        name: "documentation.pdf",
        type: "pdf",
        size: "1.2 MB",
        url: "/downloads/documentation.pdf",
        productId: "2"
      }
    ],
    features: [
      "20+ React components",
      "Chart.js integration",
      "TypeScript support",
      "Responsive design"
    ],
    rating: 4.9,
    sales: 243,
    isPublished: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    // Additional properties for mobile UI
    thumbnail: "https://picsum.photos/400/300?random=3",
    author: "Sarah Johnson",
    views: 892,
    downloads: 243,
    duration: "30 min setup"
  },
  {
    id: "3",
    title: "SEO Optimization Course",
    description: "Complete guide to SEO optimization with practical examples and tools",
    images: ["https://picsum.photos/400/300?random=5"],
    communityId: "1",
    creatorId: "1",
    creator: mockUsers[0],
    price: 89,
    currency: "USD",
    category: "Courses",
    tags: ["SEO", "Marketing", "Analytics", "Strategy"],
    files: [
      {
        id: "6",
        name: "seo-course-videos.zip",
        type: "zip",
        size: "850 MB",
        url: "/downloads/seo-course-videos.zip",
        productId: "3"
      },
      {
        id: "7",
        name: "seo-checklist.pdf",
        type: "pdf",
        size: "2.1 MB",
        url: "/downloads/seo-checklist.pdf",
        productId: "3"
      }
    ],
    features: [
      "10 hours of video content",
      "SEO tools and resources",
      "Case studies included",
      "Lifetime access"
    ],
    rating: 4.7,
    sales: 89,
    isPublished: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01")
  },
  {
    id: "4",
    title: "Mobile App UI Designs",
    description: "Collection of modern mobile app UI designs in Figma format",
    images: ["https://picsum.photos/400/300?random=6", "https://picsum.photos/400/300?random=7"],
    communityId: "2",
    creatorId: "5",
    creator: mockUsers[4],
    price: 45,
    currency: "USD",
    category: "Assets",
    tags: ["UI", "Mobile", "Figma", "Design"],
    files: [
      {
        id: "8",
        name: "mobile-ui-kit.fig",
        type: "figma",
        size: "15.3 MB",
        url: "/downloads/mobile-ui-kit.fig",
        productId: "4"
      },
      {
        id: "9",
        name: "design-guidelines.pdf",
        type: "pdf",
        size: "5.2 MB",
        url: "/downloads/design-guidelines.pdf",
        productId: "4"
      }
    ],
    features: [
      "50+ screen designs",
      "Component library",
      "Design system included",
      "Dark/Light themes"
    ],
    rating: 4.6,
    sales: 67,
    isPublished: true,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10")
  }
];

// Mock events data
export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Conference 2024",
    description: "Annual technology conference featuring the latest innovations.",
    image: "https://via.placeholder.com/400x300",
    communityId: "6",
    creatorId: "5",
    creator: mockUsers[4],
    startDate: new Date("2024-06-15"),
    endDate: new Date("2024-06-16"),
    startTime: "09:00",
    endTime: "18:00",
    location: "Convention Center",
    type: "Hybrid",
    onlineUrl: "https://live.techconf2024.com",
    maxAttendees: 1000,
    currentAttendees: 847,
    isPublished: true,
    tickets: [],
    speakers: [],
    tags: ["Technology", "Innovation", "Networking"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-03-15")
  }
];

// Mock purchases data
export const mockPurchases: Purchase[] = [
  {
    id: "1",
    userId: "2",
    user: mockUsers[1],
    productId: "2",
    product: mockProducts[1],
    purchasedAt: new Date("2024-02-01"),
    downloadCount: 3,
    amount: 0,
    currency: "USD",
    status: "completed"
  },
  {
    id: "2",
    userId: "2",
    user: mockUsers[1],
    productId: "1",
    product: mockProducts[0],
    purchasedAt: new Date("2024-01-25"),
    downloadCount: 1,
    amount: 29,
    currency: "USD",
    status: "completed"
  }
];

// Mock posts data
export const mockPosts = [
  {
    id: "1",
    content: "Just completed Day 18 of the 30-Day Coding Challenge! 🎉 Built a weather app with React and integrated with OpenWeatherMap API.",
    author: {
      id: "2",
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      role: "member",
    },
    createdAt: new Date("2024-02-20T14:30:00"),
    likes: 24,
    comments: 8,
    shares: 3,
    images: ["https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop"],
    tags: ["challenge", "react", "api"],
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: "2",
    content: "Quick tip for anyone struggling with CSS Flexbox: Use 'justify-content' for horizontal alignment and 'align-items' for vertical alignment.",
    author: {
      id: "3",
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      role: "member",
    },
    createdAt: new Date("2024-02-20T10:15:00"),
    likes: 42,
    comments: 12,
    shares: 8,
    images: [],
    tags: ["css", "flexbox", "tip"],
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: "3",
    content: "Excited to announce that I just landed my first developer job! 🚀 The portfolio projects from this community really made the difference.",
    author: {
      id: "4",
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      role: "member",
    },
    createdAt: new Date("2024-02-19T16:45:00"),
    likes: 89,
    comments: 23,
    shares: 15,
    images: [],
    tags: ["success", "job", "portfolio"],
    isLiked: true,
    isBookmarked: true,
  },
];

// Helper functions
export const getCommunityBySlug = (slug: string): Community | undefined => {
  return communities.find((community) => community.slug === slug);
};

export const getActiveChallengesByCommunity = (communityId: string): Challenge[] => {
  return mockChallenges.filter((challenge) => challenge.communityId === communityId && challenge.isActive);
};

export const getCoursesByCommunity = (communityId: string): Course[] => {
  return mockCourses.filter((course) => course.communityId === communityId);
};

export const getUserChallengeParticipation = (userId: string, challengeId: string): ChallengeParticipant | undefined => {
  // This would typically query the challenge participants, but for now we'll return a mock
  return {
    id: "1",
    userId,
    user: mockUsers.find(user => user.id === userId) as User,
    challengeId,
    challenge: mockChallenges.find(challenge => challenge.id === challengeId) as Challenge,
    joinedAt: new Date("2024-02-01"),
    isActive: true,
    progress: 65,
  };
};

export const getCurrentUser = (): User | null => {
  // In a real app, this would check authentication
  return {
    ...mockUsers[1], // Return Mike Chen as the current user
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  };
};

export const getProductsByCommunity = (communityId: string): Product[] => {
  return mockProducts.filter((product) => product.communityId === communityId);
};

export const getProductById = (productId: string): Product | undefined => {
  return mockProducts.find((product) => product.id === productId);
};

export const getUserPurchases = (userId: string): Purchase[] => {
  return mockPurchases.filter((purchase) => purchase.userId === userId);
};

export const isPurchased = (productId: string, userPurchases: Purchase[]): boolean => {
  return userPurchases.some(
    (purchase) => purchase.productId === productId
  );
};

// Mock active members for fallback
export const mockActiveMembers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b550?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isOnline: false,
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
  },
  {
    id: '5',
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    isOnline: false,
  },
  {
    id: '6',
    name: 'Jessica Park',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
  },
  {
    id: '7',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    isOnline: false,
  },
  {
    id: '8',
    name: 'Maria Garcia',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
  },
];


// Mock event speakers
export const mockEventSpeakers: EventSpeaker[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "Senior Marketing Director",
    company: "TechCorp",
    bio: "10+ years of experience in digital marketing and growth strategies",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b550?w=150&h=150&fit=crop&crop=face",
    socialLinks: {
      twitter: "https://twitter.com/sarahj",
      linkedin: "https://linkedin.com/in/sarahj"
    }
  },
  {
    id: "2",
    name: "Mike Chen",
    title: "Lead Developer",
    company: "DevStudio",
    bio: "Full-stack developer specializing in React and Node.js",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    socialLinks: {
      linkedin: "https://linkedin.com/in/mikechen"
    }
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    title: "UX Design Lead",
    company: "DesignHub",
    bio: "Passionate about creating user-centered digital experiences",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    socialLinks: {
      website: "https://emilyrodriguez.design"
    }
  }
];

// Mock events
export const availableEvents: Event[] = [
  {
    id: "1",
    title: "Digital Marketing Summit 2024",
    description: "Join industry leaders for a comprehensive overview of the latest digital marketing trends and strategies.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    communityId: "1",
    creatorId: "1",
    creator: mockUsers[0],
    startDate: new Date("2024-04-15"),
    endDate: new Date("2024-04-15"),
    startTime: "09:00",
    endTime: "17:00",
    location: "Convention Center, San Francisco",
    type: "In-person",
    maxAttendees: 200,
    currentAttendees: 87,
    isPublished: true,
    tickets: [
      {
        id: "1",
        eventId: "1",
        name: "Early Bird",
        description: "Limited time early bird pricing",
        price: 99,
        currency: "USD",
        maxQuantity: 50,
        sold: 45,
        isActive: true,
        benefits: ["All sessions access", "Networking lunch", "Event materials"]
      },
      {
        id: "2",
        eventId: "1",
        name: "Regular",
        description: "Standard conference ticket",
        price: 149,
        currency: "USD",
        maxQuantity: 100,
        sold: 42,
        isActive: true,
        benefits: ["All sessions access", "Networking lunch", "Event materials"]
      },
      {
        id: "3",
        eventId: "1",
        name: "VIP",
        description: "Premium experience with exclusive benefits",
        price: 299,
        currency: "USD",
        maxQuantity: 50,
        sold: 15,
        isActive: true,
        benefits: ["All sessions access", "VIP networking dinner", "1-on-1 speaker meetings", "Premium seating"]
      }
    ],
    speakers: [mockEventSpeakers[0], mockEventSpeakers[1]],
    tags: ["marketing", "conference", "networking"],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-15")
  },
  {
    id: "2",
    title: "React Workshop: Advanced Patterns",
    description: "Deep dive into advanced React patterns including custom hooks, compound components, and performance optimization.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    communityId: "1",
    creatorId: "2",
    creator: mockUsers[1],
    startDate: new Date("2024-03-20"),
    endDate: new Date("2024-03-20"),
    startTime: "14:00",
    endTime: "18:00",
    location: "Online",
    type: "Online",
    onlineUrl: "https://zoom.us/j/123456789",
    maxAttendees: 50,
    currentAttendees: 32,
    isPublished: true,
    tickets: [
      {
        id: "4",
        eventId: "2",
        name: "Workshop Access",
        description: "4-hour intensive React workshop",
        price: 79,
        currency: "USD",
        maxQuantity: 50,
        sold: 32,
        isActive: true,
        benefits: ["Live workshop access", "Recording access", "Workshop materials", "Q&A session"]
      }
    ],
    speakers: [mockEventSpeakers[1]],
    tags: ["react", "workshop", "development"],
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-20")
  },
  {
    id: "3",
    title: "UX Design Masterclass",
    description: "Learn the fundamentals of user experience design from industry experts. Perfect for beginners and intermediate designers.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    communityId: "2",
    creatorId: "5",
    creator: mockUsers[4],
    startDate: new Date("2024-04-02"),
    endDate: new Date("2024-04-02"),
    startTime: "10:00",
    endTime: "16:00",
    location: "Design Studio, New York",
    type: "Hybrid",
    onlineUrl: "https://zoom.us/j/987654321",
    maxAttendees: 30,
    currentAttendees: 18,
    isPublished: true,
    tickets: [
      {
        id: "5",
        eventId: "3",
        name: "In-Person",
        description: "Attend the masterclass in person",
        price: 199,
        currency: "USD",
        maxQuantity: 20,
        sold: 12,
        isActive: true,
        benefits: ["Hands-on activities", "Networking lunch", "Design kit", "Certificate"]
      },
      {
        id: "6",
        eventId: "3",
        name: "Virtual",
        description: "Join online via video conference",
        price: 99,
        currency: "USD",
        maxQuantity: 10,
        sold: 6,
        isActive: true,
        benefits: ["Live session access", "Recording access", "Digital materials", "Certificate"]
      }
    ],
    speakers: [mockEventSpeakers[2]],
    tags: ["ux", "design", "masterclass"],
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-02-10")
  }
];

// Mock event registrations (user's tickets)
export const myTickets: EventRegistration[] = [
  {
    id: "1",
    eventId: "2",
    event: availableEvents[1],
    userId: "2",
    user: mockUsers[1],
    ticketId: "4",
    ticket: availableEvents[1].tickets[0],
    quantity: 1,
    totalAmount: 79,
    currency: "USD",
    status: "confirmed",
    notes: "Looking forward to learning advanced React patterns!",
    registeredAt: new Date("2024-02-12"),
    updatedAt: new Date("2024-02-12")
  },
  {
    id: "2",
    eventId: "3",
    event: availableEvents[2],
    userId: "2",
    user: mockUsers[1],
    ticketId: "6",
    ticket: availableEvents[2].tickets[1],
    quantity: 1,
    totalAmount: 99,
    currency: "USD",
    status: "confirmed",
    registeredAt: new Date("2024-01-28"),
    updatedAt: new Date("2024-01-28")
  }
];
