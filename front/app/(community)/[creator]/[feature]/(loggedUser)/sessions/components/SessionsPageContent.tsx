"use client"

import { useState } from "react"
import HeaderSection from "@/app/(community)/[creator]/[feature]/(loggedUser)/sessions/components/HeaderSection"
import SessionsTabs from "@/app/(community)/[creator]/[feature]/(loggedUser)/sessions/components/SessionsTabs"

export default function SessionsPageContent({ slug }: { slug: string }) {
  const [activeTab, setActiveTab] = useState("available")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <HeaderSection />
        <SessionsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  )
}