"use client"
import { CreateEventHeader } from "./components/create-event-header"
import { CreateEventProgress } from "./components/create-event-progress"
import { BasicInfoStep } from "./components/basic-info-step"
import { DateLocationStep } from "./components/date-location-step"
import { SpeakersTicketsStep } from "./components/speakers-tickets-step"
import { ReviewPublishStep } from "./components/review-publish-step"
import { CreateEventNavigation } from "./components/create-event-navigation"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { EventFormData, Step } from "@/lib/models"

export default function CreateEventPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    image: "",
    location: "",
    onlineUrl: "",
    category: "",
    type: "",
    isPublished: false,
    tags: [],
    schedule: {
      startTime: "",
      endTime: "",
      timezone: "UTC",
    },
    speakers: [],
    tickets: [],
  })

  const steps: Step[] = [
    { id: 1, title: "Basic Info", description: "Event title, description, and settings" },
    { id: 2, title: "Date & Location", description: "Set dates, location, and event type" },
    { id: 3, title: "Speakers & Tickets", description: "Add speakers and ticket options" },
    { id: 4, title: "Review & Publish", description: "Review and publish your event" },
  ]

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...(prev[parent as keyof typeof prev] as Record<string, any>), [child]: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const addEventSpeaker = () => {
    const newSpeaker = {
      id: `speaker-${Date.now()}`,
      name: "",
      title: "",
      bio: "",
      photo: "",
    }
    setFormData((prev) => ({
      ...prev,
      speakers: [...prev.speakers, newSpeaker],
    }))
  }

  const updateEventSpeaker = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      speakers: prev.speakers.map((speaker, i) => (i === index ? { ...speaker, [field]: value } : speaker)),
    }))
  }

  const removeEventSpeaker = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index),
    }))
  }

  const addEventTicket = () => {
    const newTicket = {
      id: `ticket-${Date.now()}`,
      type: "regular" as "regular" | "vip" | "early-bird",
      name: "",
      price: "",
      description: "",
      quantity: "",
    }
    setFormData((prev) => ({
      ...prev,
      tickets: [...prev.tickets, newTicket],
    }))
  }

  const updateEventTicket = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      tickets: prev.tickets.map((ticket, i) => (i === index ? { ...ticket, [field]: value } : ticket)),
    }))
  }

  const removeEventTicket = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tickets: prev.tickets.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = () => {
    console.log("Event data:", { ...formData, startDate, endDate })
    router.push("/creator/events")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-5">
      <CreateEventHeader />
      <CreateEventProgress 
        steps={steps} 
        currentStep={currentStep} 
        setCurrentStep={setCurrentStep} 
      />
      
      {/* Step Content */}
      {currentStep === 1 && (
        <BasicInfoStep 
          formData={formData} 
          handleInputChange={handleInputChange} 
        />
      )}
      {currentStep === 2 && (
        <DateLocationStep 
          formData={formData} 
          handleInputChange={handleInputChange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      )}
      {currentStep === 3 && (
        <SpeakersTicketsStep 
          formData={formData} 
          addEventSpeaker={addEventSpeaker}
          updateEventSpeaker={updateEventSpeaker}
          removeEventSpeaker={removeEventSpeaker}
          addEventTicket={addEventTicket}
          updateEventTicket={updateEventTicket}
          removeEventTicket={removeEventTicket}
        />
      )}
      {currentStep === 4 && (
        <ReviewPublishStep 
          formData={formData} 
          handleInputChange={handleInputChange}
          startDate={startDate}
          endDate={endDate}
        />
      )}

      <CreateEventNavigation 
        currentStep={currentStep} 
        steps={steps}
        setCurrentStep={setCurrentStep}
        handleSubmit={handleSubmit}
        formData={formData}
      />
    </div>
  )
}