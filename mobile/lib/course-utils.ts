// Données mockées pour les cours

export interface Chapter {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration?: number; // en minutes
  price?: number;
  isPreview?: boolean;
}

export interface Section {
  id: string;
  title: string;
  chapters: Chapter[];
}

export interface Creator {
  id: string;
  name: string;
  avatar?: string;
}

export interface Progress {
  chapterId: string;
  isCompleted: boolean;
  lastAccessed: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: Progress[];
}

export interface Course {
  id: string;
  communityId: string;
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  level?: string;
  sections: Section[];
  creator: Creator;
  enrollments: { userId: string }[];
  learningObjectives?: string[];
}

// Données mockées pour les cours
const mockCourses: Course[] = [
  {
    id: "1",
    communityId: "1",
    title: "Web Development Fundamentals",
    description: "Learn the fundamentals of web development with HTML, CSS, and JavaScript.",
    thumbnail: "https://picsum.photos/seed/course1/800/600",
    price: 0,
    level: "Beginner",
    creator: {
      id: "1",
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    sections: [
      {
        id: "s1",
        title: "Introduction to HTML",
        chapters: [
          {
            id: "c1",
            title: "HTML Basics",
            content: "Learn the basic structure of HTML documents and common tags.",
            videoUrl: "https://www.youtube.com/embed/UB1O30fR-EE",
            duration: 15,
            isPreview: true
          },
          {
            id: "c2",
            title: "HTML Forms",
            content: "Create interactive forms using HTML form elements.",
            videoUrl: "https://www.youtube.com/embed/zcTSytV5oyU",
            duration: 20
          }
        ]
      },
      {
        id: "s2",
        title: "CSS Styling",
        chapters: [
          {
            id: "c3",
            title: "CSS Basics",
            content: "Learn how to style your HTML with CSS.",
            videoUrl: "https://www.youtube.com/embed/1PnVor36_40",
            duration: 18
          },
          {
            id: "c4",
            title: "CSS Layout",
            content: "Master CSS layout techniques including Flexbox and Grid.",
            videoUrl: "https://www.youtube.com/embed/jV8B24rSN5o",
            duration: 25
          }
        ]
      }
    ],
    enrollments: [
      { userId: "2" },
      { userId: "3" }
    ],
    learningObjectives: [
      "Understand HTML document structure",
      "Create styled web pages with CSS",
      "Build interactive elements with JavaScript",
      "Deploy a simple website"
    ]
  },
  {
    id: "2",
    communityId: "1",
    title: "React Masterclass",
    description: "Master React.js and build modern web applications with the most popular frontend library.",
    thumbnail: "https://picsum.photos/seed/course2/800/600",
    price: 49.99,
    level: "Intermediate",
    creator: {
      id: "2",
      name: "Jane Smith",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    sections: [
      {
        id: "s3",
        title: "React Fundamentals",
        chapters: [
          {
            id: "c5",
            title: "Introduction to React",
            content: "Learn the core concepts of React and component-based architecture.",
            videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0",
            duration: 22,
            isPreview: true
          },
          {
            id: "c6",
            title: "State and Props",
            content: "Understanding React's state and props system.",
            videoUrl: "https://www.youtube.com/embed/4pO-HcG2igk",
            duration: 28
          }
        ]
      },
      {
        id: "s4",
        title: "Advanced React",
        chapters: [
          {
            id: "c7",
            title: "Hooks in Depth",
            content: "Master React Hooks for functional components.",
            videoUrl: "https://www.youtube.com/embed/TNhaISOUy6Q",
            duration: 35
          },
          {
            id: "c8",
            title: "Context API",
            content: "Learn state management with Context API.",
            videoUrl: "https://www.youtube.com/embed/35lXWvCuM8o",
            duration: 30
          }
        ]
      }
    ],
    enrollments: [
      { userId: "1" }
    ]
  },
  {
    id: "3",
    communityId: "1",
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile apps using React Native and JavaScript.",
    thumbnail: "https://picsum.photos/seed/course3/800/600",
    price: 59.99,
    level: "Advanced",
    creator: {
      id: "3",
      name: "Robert Johnson",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    sections: [
      {
        id: "s5",
        title: "React Native Basics",
        chapters: [
          {
            id: "c9",
            title: "Setting Up Your Environment",
            content: "Configure your development environment for React Native.",
            videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc",
            duration: 20,
            isPreview: true
          },
          {
            id: "c10",
            title: "Core Components",
            content: "Learn the essential components of React Native.",
            videoUrl: "https://www.youtube.com/embed/ur6I5m2nTvk",
            duration: 25
          }
        ]
      },
      {
        id: "s6",
        title: "Navigation and State Management",
        chapters: [
          {
            id: "c11",
            title: "React Navigation",
            content: "Implement navigation in your React Native app.",
            videoUrl: "https://www.youtube.com/embed/nQVCkqvU1uE",
            duration: 30
          },
          {
            id: "c12",
            title: "Redux with React Native",
            content: "Manage application state with Redux in React Native.",
            videoUrl: "https://www.youtube.com/embed/Hn2zEpht3A0",
            duration: 35
          }
        ]
      }
    ],
    enrollments: []
  }
];

// Données mockées pour les inscriptions aux cours
const mockEnrollments: Enrollment[] = [
  {
    id: "e1",
    userId: "2", // utilisateur actuel pour démo
    courseId: "1",
    enrolledAt: "2023-05-15T10:30:00Z",
    progress: [
      {
        chapterId: "c1",
        isCompleted: true,
        lastAccessed: "2023-05-16T14:20:00Z"
      },
      {
        chapterId: "c2",
        isCompleted: true,
        lastAccessed: "2023-05-17T09:45:00Z"
      },
      {
        chapterId: "c3",
        isCompleted: false,
        lastAccessed: "2023-05-18T16:10:00Z"
      }
    ]
  }
];

// Fonctions d'aide pour récupérer les données
export function getCoursesByCommunity(communityId: string): Course[] {
  return mockCourses.filter(course => course.communityId === communityId);
}

export function getCourseById(courseId: string): Course | undefined {
  return mockCourses.find(course => course.id === courseId);
}

export function getUserEnrollments(userId: string): Enrollment[] {
  return mockEnrollments.filter(enrollment => enrollment.userId === userId);
}
