"use client"

import { useState } from "react"
import SessionCard from "@/app/(community)/[slug]/(loggedUser)/sessions/components/SessionCard"

const availableSessions = [
  {
    id: "1",
    title: "1-on-1 Code Review Session",
    description: "Get personalized feedback on your code and projects",
    duration: 60,
    price: 150,
    mentor: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Senior Developer",
      rating: 4.9,
      reviews: 124,
    },
    category: "Code Review",
    tags: ["JavaScript", "React", "Best Practices"],
  },
  {
    id: "2",
    title: "Career Mentorship Session",
    description: "Get guidance on your web development career path",
    duration: 45,
    price: 120,
    mentor: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Senior Developer",
      rating: 4.9,
      reviews: 124,
    },
    category: "Career",
    tags: ["Career", "Interview Prep", "Portfolio"],
  },
  {
    id: "3",
    title: "Project Planning & Architecture",
    description: "Plan your next project with proper architecture",
    duration: 90,
    price: 200,
    mentor: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Senior Developer",
      rating: 4.9,
      reviews: 124,
    },
    category: "Architecture",
    tags: ["Planning", "Architecture", "Best Practices"],
  },
]

export default function AvailableSessions() {
  const [selectedSession, setSelectedSession] = useState("")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {availableSessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
        />
      ))}
    </div>
  )
}