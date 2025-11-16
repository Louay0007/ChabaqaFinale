"use client"

import { EnhancedCard } from "@/components/ui/enhanced-card"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, TrendingUp, BarChart3 } from "lucide-react"
import { Course } from "@/lib/models"

export function AnalyticsTab({ course, totalRevenue }: { course: Course; totalRevenue: number }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EnhancedCard>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{course.enrollments.length}</p>
                <p className="text-sm text-muted-foreground">Total Enrollments</p>
              </div>
            </div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">${totalRevenue}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </EnhancedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnhancedCard>
          <CardHeader>
            <CardTitle>Enrollment Trends</CardTitle>
            <CardDescription>Track your course enrollment over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>Enrollment chart would be displayed here</p>
            </div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard>
          <CardHeader>
            <CardTitle>Chapter Completion Rates</CardTitle>
            <CardDescription>See which chapters students complete most</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {course.sections.slice(0, 3).map((section) =>
                section.chapters.slice(0, 2).map((chapter, index) => (
                  <div key={chapter.id} className="flex items-center justify-between">
                    <span className="text-sm">{chapter.title}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${85 - index * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">{85 - index * 10}%</span>
                    </div>
                  </div>
                )),
              )}
            </div>
          </CardContent>
        </EnhancedCard>
      </div>
    </div>
  )
}