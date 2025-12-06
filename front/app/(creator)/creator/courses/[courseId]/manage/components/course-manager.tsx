"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import { Course } from "@/lib/models"
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
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await apiClient.get<any>(`/cours/${courseId}`)

        // Transform API response to match expected Course interface
        const transformedCourse: Course = {
          id: response.id,
          title: response.titre,
          description: response.description,
          thumbnail: response.thumbnail || '',
          price: response.prix,
          currency: response.devise,
          category: response.category || '',
          level: response.niveau || '',
          duration: response.duree || '',
          isPublished: response.isPublished,
          learningObjectives: response.learningObjectives || [],
          requirements: response.requirements || [],
          sections: response.sections.map((section: any) => ({
            id: section.id,
            title: section.titre,
            description: section.description || '',
            courseId: section.courseId,
            order: section.ordre,
            chapters: section.chapitres.map((chapitre: any) => ({
              id: chapitre.id,
              title: chapitre.titre,
              content: chapitre.contenu,
              videoUrl: chapitre.videoUrl || '',
              duration: chapitre.duree || 0,
              sectionId: chapitre.sectionId,
              order: chapitre.ordre,
              isPreview: chapitre.isPreview,
              price: chapitre.prix || 0,
            })),
            createdAt: section.createdAt,
          })),
          enrollments: [], // API doesn't return enrollments in this endpoint
          createdAt: new Date(response.createdAt),
          updatedAt: new Date(response.createdAt),
          communityId: response.communityId,
          creatorId: response.creatorId,
          creator: response.creator,
        }

        setCourse(transformedCourse)
      } catch (error) {
        console.error('Failed to fetch course:', error)
        // If course not found, redirect to courses list
        router.push('/creator/courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId, router])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    price: "",
    currency: "USD",
    category: "",
    level: "",
    duration: "",
    isPublished: false,
    learningObjectives: [""],
    requirements: [""],
    notes: "",
  })

  // Update formData when course loads
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.titre || "",
        description: course.description || "",
        longDescription: course.description || "",
        price: course.prix?.toString() || "",
        currency: course.devise || "USD",
        category: course.category || "",
        level: course.niveau || "",
        duration: course.duree || "",
        isPublished: course.isPublished || false,
        learningObjectives: course.learningObjectives || [""],
        requirements: course.requirements || [""],
        notes: course.notes || "",
      })
    }
  }, [course])

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

  const totalChapters = course.sections?.reduce((acc, s) => acc + s.chapters.length, 0) || 0
  const previewChapters = course.sections?.reduce((acc, s) => acc + s.chapters.filter((c) => c.isPreview).length, 0) || 0
  const totalRevenue = (course.enrollments?.length || 0) * (course.price || 0)

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
