// Données mockées pour les sessions de mentorat

export interface Mentor {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  role: string;
  rating: number;
  reviews: number;
  bio: string;
}

export interface SessionType {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  mentor: Mentor;
  category: string;
  tags: string[];
}

export interface BookedSession {
  id: string;
  sessionTypeId: string;
  userId: string;
  scheduledAt: string; // format ISO pour faciliter la sérialisation
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingUrl?: string;
  notes?: string;
}

// Liste des mentors
const mockMentors: Mentor[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    title: "Senior Web Developer",
    role: "Senior Developer",
    rating: 4.9,
    reviews: 124,
    bio: "10+ years of experience in web development. Specialized in React and modern JavaScript. I help developers write clean, maintainable code and improve their frontend architecture."
  },
  {
    id: "2",
    name: "David Chen",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    title: "Tech Lead & Architect",
    role: "Tech Lead",
    rating: 4.8,
    reviews: 89,
    bio: "Tech Lead with expertise in scalable architectures. I guide developers through project planning, system design, and career development in the tech industry."
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    title: "UX/UI Design Expert",
    role: "UX/UI Expert",
    rating: 4.7,
    reviews: 67,
    bio: "UX/UI specialist with background in frontend development. I help bridge the gap between design and implementation, focusing on accessible and user-friendly interfaces."
  }
];

// Types de sessions disponibles
const mockSessionTypes: SessionType[] = [
  {
    id: "1",
    title: "1-on-1 Code Review Session",
    description: "Get personalized feedback on your code and projects",
    duration: 60,
    price: 150,
    mentor: mockMentors[0],
    category: "Code Review",
    tags: ["JavaScript", "React", "Best Practices"],
  },
  {
    id: "2",
    title: "Career Mentorship Session",
    description: "Get guidance on your web development career path",
    duration: 45,
    price: 120,
    mentor: mockMentors[1],
    category: "Career",
    tags: ["Career", "Interview Prep", "Portfolio"],
  },
  {
    id: "3",
    title: "Project Planning & Architecture",
    description: "Plan your next project with proper architecture",
    duration: 90,
    price: 200,
    mentor: mockMentors[2],
    category: "Architecture",
    tags: ["Planning", "Architecture", "Best Practices"],
  },
];

// Sessions réservées
const mockBookedSessions: BookedSession[] = [
  {
    id: "1",
    sessionTypeId: "1", // Référence à la session de type code review
    userId: "2", // ID de l'utilisateur actuel
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Dans 2 jours
    status: "confirmed",
    meetingUrl: "https://meet.google.com/abc-def-ghi",
    notes: "Review React project structure and component organization",
  },
  {
    id: "2",
    sessionTypeId: "2", // Référence à la session de type career mentorship
    userId: "2", // ID de l'utilisateur actuel
    scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Dans 7 jours
    status: "pending",
    notes: "Discuss career transition from junior to mid-level developer",
  },
];

// Créneaux horaires disponibles
export const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

// Fonctions utilitaires

// Obtenir les types de sessions disponibles
export function getAvailableSessionTypes(): SessionType[] {
  return mockSessionTypes;
}

// Obtenir les sessions réservées par un utilisateur
export function getBookedSessionsByUser(userId: string): Array<BookedSession & { sessionType: SessionType }> {
  return mockBookedSessions
    .filter(session => session.userId === userId)
    .map(bookedSession => {
      const sessionType = mockSessionTypes.find(type => type.id === bookedSession.sessionTypeId);
      return {
        ...bookedSession,
        sessionType: sessionType!
      };
    });
}

// Obtenir les détails d'un type de session
export function getSessionTypeById(id: string): SessionType | undefined {
  return mockSessionTypes.find(session => session.id === id);
}

// Fonction pour réserver une nouvelle session
export function bookSession(
  userId: string,
  sessionTypeId: string,
  scheduledAt: Date,
  notes?: string
): BookedSession {
  const newBooking: BookedSession = {
    id: `booking_${Date.now()}`, // Génère un ID unique
    sessionTypeId,
    userId,
    scheduledAt: scheduledAt.toISOString(),
    status: "pending",
    notes
  };
  
  // Dans une application réelle, vous enregistreriez cette réservation dans une base de données
  // mockBookedSessions.push(newBooking);
  
  return newBooking;
}

// Formater la date en format lisible
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Formater l'heure en format lisible
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Obtenir tous les mentors disponibles
export function getAvailableMentors(): Mentor[] {
  return mockMentors;
}

// Obtenir un mentor par son ID
export function getMentorById(id: string): Mentor | undefined {
  return mockMentors.find(mentor => mentor.id === id);
}