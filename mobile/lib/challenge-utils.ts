import { Challenge, mockChallenges } from '@/lib/mock-data';

// Mock des tâches pour les challenges
export interface ChallengeTask {
  id: string;
  challengeId: string;
  title: string;
  description: string;
  day: number;
  points: number;
  isActive: boolean;
  isCompleted: boolean;
  instructions?: string;
  resources?: Array<{
    title: string;
    url: string;
    type: string;
  }>;
}

// Tâches de challenge pour le mock
const mockChallengeTasks: ChallengeTask[] = [
  {
    id: "task1",
    challengeId: "1",
    title: "Set Up Your Environment",
    description: "Install the necessary tools and create a GitHub repository for your projects.",
    day: 1,
    points: 50,
    isActive: false,
    isCompleted: true,
    instructions: "1. Install Node.js and npm\n2. Set up a GitHub repository\n3. Initialize a basic project structure",
    resources: [
      {
        title: "Getting Started with Node.js",
        url: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
        type: "article"
      },
      {
        title: "Git and GitHub for Beginners",
        url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
        type: "video"
      }
    ]
  },
  {
    id: "task2",
    challengeId: "1",
    title: "Build a Landing Page",
    description: "Create a responsive landing page using HTML, CSS, and basic JavaScript.",
    day: 2,
    points: 75,
    isActive: false,
    isCompleted: true,
    instructions: "1. Design a simple landing page\n2. Make it responsive\n3. Add at least one interactive element with JavaScript",
  },
  {
    id: "task3",
    challengeId: "1",
    title: "Create a Weather App",
    description: "Build a weather application that fetches data from a weather API.",
    day: 3,
    points: 100,
    isActive: true,
    isCompleted: false,
    instructions: "1. Sign up for a free API key from OpenWeatherMap\n2. Create a search interface for cities\n3. Display current weather and forecast\n4. Add error handling for failed API requests",
    resources: [
      {
        title: "OpenWeatherMap API Documentation",
        url: "https://openweathermap.org/api",
        type: "tool"
      },
      {
        title: "Working with APIs in JavaScript",
        url: "https://www.javascripttutorial.net/javascript-fetch-api/",
        type: "article"
      }
    ]
  },
  {
    id: "task4",
    challengeId: "1",
    title: "Build a Todo List App",
    description: "Create a todo list application with CRUD functionality.",
    day: 4,
    points: 125,
    isActive: false,
    isCompleted: false,
    instructions: "1. Create a UI for adding, editing, and deleting tasks\n2. Implement local storage to persist data\n3. Add ability to mark tasks as complete\n4. Implement filtering by status (complete/incomplete)",
  },
  {
    id: "task5",
    challengeId: "1",
    title: "Create a Simple Game",
    description: "Build a simple browser-based game using JavaScript.",
    day: 5,
    points: 150,
    isActive: false,
    isCompleted: false,
  },
];

/**
 * Récupère tous les challenges pour une communauté spécifique
 */
export function getChallengesByCommunity(communityId: string): Challenge[] {
  return mockChallenges.filter(challenge => challenge.communityId === communityId);
}

/**
 * Récupère un challenge par son ID
 */
export function getChallengeById(challengeId: string): Challenge | undefined {
  return mockChallenges.find(challenge => challenge.id === challengeId);
}

/**
 * Récupère les tâches d'un challenge
 */
export function getChallengeTasks(challengeId: string): ChallengeTask[] {
  return mockChallengeTasks.filter(task => task.challengeId === challengeId);
}
