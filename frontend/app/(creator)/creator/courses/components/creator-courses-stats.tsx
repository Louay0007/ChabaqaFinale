"use client"

import { MetricCard } from "@/components/ui/metric-card"
import { BookOpen, Eye, Users, DollarSign } from "lucide-react"
import { Course } from "@/lib/models" // Make sure this type is properly defined

interface CreatorCoursesStatsProps {
  allCourses: Course[]
}

export function CreatorCoursesStats({ allCourses }: CreatorCoursesStatsProps) {
  const stats = [
    {
      title: "Total Courses",
      value: allCourses.length,
      change: { value: "+2", trend: "up" as const },
      icon: BookOpen,
      color: "courses" as const,
    },
    {
      title: "Published Courses",
      value: allCourses.filter((c) => c.isPublished).length,
      change: { value: "+1", trend: "up" as const },
      icon: Eye,
      color: "success" as const,
    },
    {
      title: "Total Enrollments",
      value: allCourses.reduce((acc, c) => acc + c.enrollments.length, 0),
      change: { value: "+15", trend: "up" as const },
      icon: Users,
      color: "primary" as const,
    },
    {
      title: "Course Revenue",
      value: "$8,920",
      change: { value: "+18%", trend: "up" as const },
      icon: DollarSign,
      color: "success" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <MetricCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  )
}