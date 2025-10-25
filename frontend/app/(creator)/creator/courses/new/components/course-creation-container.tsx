"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CourseCreationProgress } from "./course-creation-progress"
import { BasicInfoStep } from "./basic-info-step"
import { PricingDetailsStep } from "./pricing-details-step"
import { CourseContentStep } from "./course-content-step"
import { ReviewPublishStep } from "./review-publish-step"
import { NavigationButtons } from "./navigation-buttons"
import { PageHeader } from "./page-header"

interface CourseChapterForm {
  id: string
  title: string
  content: string
  videoUrl?: string
  duration?: number
  order: number
  isPreview: boolean
}

interface CourseSectionForm {
  id: string
  title: string
  description?: string
  order: number
  chapters: CourseChapterForm[]
}

export function CourseCreationContainer() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    price: "",
    currency: "USD",
    category: "",
    level: "",
    duration: "",
    isPublished: false,
    tags: [] as string[],
    learningObjectives: [""],
    requirements: [""],
    sections: [] as CourseSectionForm[],
  })

  const steps = [
    { id: 1, title: "Basic Info", description: "Course title, description, and thumbnail" },
    { id: 2, title: "Pricing & Details", description: "Set price, category, and level" },
    { id: 3, title: "Course Content", description: "Add sections and chapters" },
    { id: 4, title: "Review & Publish", description: "Review and publish your course" },
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field as keyof typeof prev]) 
        ? (prev[field as keyof typeof prev] as string[]).map((item: string, i: number) => 
            i === index ? value : item
          )
        : prev[field as keyof typeof prev],
    }))
  }

  const addArrayItem = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field as keyof typeof prev]) ? [...(prev[field as keyof typeof prev] as any[]), ""] : prev[field as keyof typeof prev],
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field as keyof typeof prev]) 
        ? (prev[field as keyof typeof prev] as any[]).filter((_: any, i: number) => i !== index)
        : prev[field as keyof typeof prev],
    }))
  }

  const addSection = () => {
    const newSection: CourseSectionForm = {
      id: `section-${Date.now()}`,
      title: "",
      description: "",
      order: formData.sections.length + 1,
      chapters: [],
    }
    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }))
  }

  const updateSection = (sectionId: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => (section.id === sectionId ? { ...section, [field]: value } : section)),
    }))
  }

  const removeSection = (sectionId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }))
  }

  const addChapter = (sectionId: string) => {
    const section = formData.sections.find((s) => s.id === sectionId)
    if (!section) return

    const newChapter: CourseChapterForm = {
      id: `chapter-${Date.now()}`,
      title: "",
      content: "",
      videoUrl: "",
      duration: 0,
      order: section.chapters.length + 1,
      isPreview: false,
    }

    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, chapters: [...s.chapters, newChapter] } : s)),
    }))
  }

  const updateChapter = (sectionId: string, chapterId: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              chapters: section.chapters.map((chapter) =>
                chapter.id === chapterId ? { ...chapter, [field]: value } : chapter,
              ),
            }
          : section,
      ),
    }))
  }

  const removeChapter = (sectionId: string, chapterId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, chapters: section.chapters.filter((chapter) => chapter.id !== chapterId) }
          : section,
      ),
    }))
  }

  const handleSubmit = () => {
    console.log("Course data:", formData)
    router.push("/creator/courses")
  }

  const totalChapters = formData.sections.reduce((acc, section) => acc + section.chapters.length, 0)
  const previewChapters = formData.sections.reduce(
    (acc, section) => acc + section.chapters.filter((c) => c.isPreview).length,
    0,
  )

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-5">
      <PageHeader />
      <CourseCreationProgress currentStep={currentStep} setCurrentStep={setCurrentStep} />
      
      {currentStep === 1 && (
        <BasicInfoStep formData={formData} handleInputChange={handleInputChange} />
      )}

      {currentStep === 2 && (
        <PricingDetailsStep
          formData={formData}
          handleInputChange={handleInputChange}
          handleArrayChange={handleArrayChange}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
        />
      )}

      {currentStep === 3 && (
        <CourseContentStep
          formData={formData}
          addSection={addSection}
          updateSection={updateSection}
          removeSection={removeSection}
          addChapter={addChapter}
          updateChapter={updateChapter}
          removeChapter={removeChapter}
        />
      )}

      {currentStep === 4 && (
        <ReviewPublishStep
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}

      <NavigationButtons
        currentStep={currentStep}
        stepsLength={steps.length}
        setCurrentStep={setCurrentStep}
        handleSubmit={handleSubmit}
        formData={formData}
      />
    </div>
  )
}