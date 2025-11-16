"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getCourseById } from "@/lib/mock-data"
import { CourseHeader } from "./course-header"
import { CourseTabs } from "./course-tabs"
import { DetailsTab } from "./tabs/details-tab"
import { ContentTab } from "./tabs/content-tab"
import { PricingTab } from "./tabs/pricing-tab"
import { ResourcesTab } from "./tabs/resources-tab"
import { AnalyticsTab } from "./tabs/analytics-tab"
import { SettingsTab } from "./tabs/settings-tab"

export function CourseManager({ courseId }: { courseId: string }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("details")
  const [isLoading, setIsLoading] = useState(false)

  const course = getCourseById(courseId)

  const [formData, setFormData] = useState({
    title: course?.title || "",
    description: course?.description || "",
    longDescription: course?.description || "",
    price: course?.price?.toString() || "",
    currency: course?.currency || "USD",
    category: course?.category || "",
    level: course?.level || "",
    duration: course?.duration || "",
    isPublished: course?.isPublished || false,
    learningObjectives: course?.learningObjectives || [""],
    requirements: course?.requirements || [""],
    notes: course?.notes || "",
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field as keyof typeof prev]) 
        ? (prev[field as keyof typeof prev] as string[]).map((item: string, i: number) => 
            i === index ? value : item)
        : prev[field as keyof typeof prev],
    }))
  }

  const addArrayItem = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), ""],
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field as keyof typeof prev]) 
        ? (prev[field as keyof typeof prev] as string[]).filter((_: string, i: number) => i !== index)
        : prev[field as keyof typeof prev],
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  if (!course) {
    return <div>Course not found</div>
  }

  const totalChapters = course.sections.reduce((acc, s) => acc + s.chapters.length, 0)
  const previewChapters = course.sections.reduce((acc, s) => acc + s.chapters.filter((c) => c.isPreview).length, 0)
  const totalRevenue = course.enrollments.length * course.price

  return (
    <div className="space-y-8 p-5">
      <CourseHeader 
        course={course} 
        onSave={handleSave} 
        isLoading={isLoading} 
      />

      <CourseTabs activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "details" && (
          <DetailsTab
            formData={formData}
            course={course}
            onInputChange={handleInputChange}
            onArrayChange={handleArrayChange}
            onAddArrayItem={addArrayItem}
            onRemoveArrayItem={removeArrayItem}
            totalChapters={totalChapters}
            previewChapters={previewChapters}
            totalRevenue={totalRevenue}
          />
        )}

        {activeTab === "content" && (
          <ContentTab course={course} />
        )}

        {activeTab === "pricing" && (
          <PricingTab 
            formData={formData} 
            course={course} 
            onInputChange={handleInputChange} 
          />
        )}

        {activeTab === "resources" && (
          <ResourcesTab course={course} />
        )}

        {activeTab === "analytics" && (
          <AnalyticsTab 
            course={course} 
            totalRevenue={totalRevenue} 
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab />
        )}
      </CourseTabs>
    </div>
  )
}