"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChallengeHeader } from "./challenge-header"
import { ChallengeProgress } from "./challenge-progress"
import { BasicInfoStep } from "./basic-info-step"
import { TimelinePricingStep } from "./timeline-pricing-step"
import { ChallengeStepsStep } from "./challenge-steps-step"
import { ReviewPublishStep } from "./review-publish-step"
import { ChallengeNavigation } from "./challenge-navigation"

export function CreateChallengeForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [formData, setFormData] = useState(initialFormData)

  const steps = [
    { id: 1, title: "Basic Info", description: "Challenge title, description, and settings" },
    { id: 2, title: "Timeline & Pricing", description: "Set dates, deposit, and rewards" },
    { id: 3, title: "Challenge Steps", description: "Define daily tasks and deliverables" },
    { id: 4, title: "Review & Publish", description: "Review and publish your challenge" },
  ]

  const handleSubmit = () => {
    console.log("Challenge data:", { ...formData, startDate, endDate })
    router.push("/creator/challenges")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-5">
      <ChallengeHeader />
      
      <ChallengeProgress 
        currentStep={currentStep} 
        steps={steps} 
        setCurrentStep={setCurrentStep}
      />

      {currentStep === 1 && (
        <BasicInfoStep 
          formData={formData} 
          setFormData={setFormData} 
        />
      )}

      {currentStep === 2 && (
        <TimelinePricingStep 
          formData={formData} 
          setFormData={setFormData} 
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      )}

      {currentStep === 3 && (
        <ChallengeStepsStep 
          formData={formData} 
          setFormData={setFormData} 
        />
      )}

      {currentStep === 4 && (
        <ReviewPublishStep 
          formData={formData} 
          setFormData={setFormData} 
          startDate={startDate}
          endDate={endDate}
        />
      )}

      <ChallengeNavigation 
        currentStep={currentStep} 
        steps={steps} 
        setCurrentStep={setCurrentStep}
        onSubmit={handleSubmit}
        isPublished={formData.isPublished}
      />
    </div>
  )
}

const initialFormData = {
  title: "",
  description: "",
  thumbnail: "",
  depositAmount: "",
  maxParticipants: "",
  category: "",
  difficulty: "",
  duration: "",
  isPublished: false,
  tags: [] as string[],
  rewards: {
    completionReward: "",
    topPerformerBonus: "",
    streakBonus: "",
  },
  steps: [] as Array<{
    day: number
    title: string
    description: string
    deliverable: string
    points: number
    resources: Array<{
      id: string
      title: string
      type: "video" | "article" | "code" | "tool"
      url: string
      description: string
    }>
    instructions: string
  }>,
}