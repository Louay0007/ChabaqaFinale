
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Star } from "lucide-react"

interface Course {
  id: string
  title: string
  price: number
  enrollments: Array<any>
}

interface CreatorCoursesPerformanceProps {
  allCourses: Course[]
}

export function CreatorCoursesPerformance({ allCourses }: CreatorCoursesPerformanceProps) {
  return (
    <EnhancedCard variant="glass" className="bg-gradient-to-r from-courses-50 to-blue-50 border-courses-200">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-courses-600" />
          Course Performance Overview
        </CardTitle>
        <CardDescription>Your most popular courses this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allCourses.slice(0, 3).map((course, index) => (
            <div key={course.id} className="flex items-center space-x-4 p-4 bg-white/50 rounded-lg">
              <div className="flex-shrink-0">
                <Badge
                  variant="secondary"
                  className={`w-8 h-8 rounded-full p-0 flex items-center justify-center ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-800"
                      : index === 1
                        ? "bg-gray-100 text-gray-800"
                        : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {index + 1}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{course.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <span>{course.enrollments.length} enrollments</span>
                  <span>${course.price * course.enrollments.length} revenue</span>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-500" />
                    4.8 rating
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </EnhancedCard>
  )
}