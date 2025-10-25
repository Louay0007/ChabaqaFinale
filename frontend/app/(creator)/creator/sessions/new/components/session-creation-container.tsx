"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SessionHeader } from "./session-header"
import { SessionProgress } from "./session-progress"
import { BasicInfoStep } from "./basic-info-step"
import { PricingDurationStep } from "./pricing-duration-step"
import { SessionDetailsStep } from "./session-details-step"
import { ReviewPublishStep } from "./review-publish-step"
import { NavigationButtons } from "./navigation-buttons"

export function SessionCreationContainer() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    price: "",
    currency: "USD",
    maxBookingsPerWeek: "",
    isActive: true,
    requirements: "",
    whatYoullGet: [""],
    availableDays: [] as string[],
    availableHours: {
      start: "",
      end: "",
    },
    preparationMaterials: "",
    sessionFormat: "",
    targetAudience: "",
  })

  const steps = [
    { id: 1, title: "Basic Info", description: "Session title, description, and category" },
    { id: 2, title: "Pricing & Duration", description: "Set price, duration, and availability" },
    { id: 3, title: "Session Details", description: "Format, requirements, and what participants get" },
    { id: 4, title: "Review & Publish", description: "Review and publish your session" },
  ]

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: typeof prev[parent as keyof typeof prev] === 'object' ? { ...prev[parent as keyof typeof prev] as object, [child]: value } : { [child]: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
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
      [field]: Array.isArray(prev[field as keyof typeof prev]) ? [...(prev[field as keyof typeof prev] as string[]), ""] : [prev[field as keyof typeof prev], ""],
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field as keyof typeof prev]) 
        ? (prev[field as keyof typeof prev] as string[]).filter((_: any, i: number) => i !== index)
        : prev[field as keyof typeof prev],
    }))
  }

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }))
  }

  const handleSubmit = () => {
    console.log("Session data:", formData)
    router.push("/creator/sessions")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-5">
      <SessionHeader />
      <SessionProgress currentStep={currentStep} setCurrentStep={setCurrentStep} steps={steps} />
      
      {currentStep === 1 && (
        <BasicInfoStep formData={formData} handleInputChange={handleInputChange} />
      )}

      {currentStep === 2 && (
        <PricingDurationStep
          formData={formData}
          handleInputChange={handleInputChange}
          handleDayToggle={handleDayToggle}
        />
      )}

      {currentStep === 3 && (
        <SessionDetailsStep
          formData={formData}
          handleInputChange={handleInputChange}
          handleArrayChange={handleArrayChange}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
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