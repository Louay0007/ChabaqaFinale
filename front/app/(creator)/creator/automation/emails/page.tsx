"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { EmailCampaignList } from "./components/email-campaign-list"
import { CampaignStats } from "./components/campaign-stats"
import { CreateCampaignDialog } from "./components/create-campaign-dialog"
import { EmailTemplateCards } from "./components/email-template-cards"

export default function EmailCampaignsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Email Campaigns</h1>
          <p className="text-gray-500">Manage and track your email campaigns</p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-chabaqa-primary hover:bg-chabaqa-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <CampaignStats />
      <EmailTemplateCards />
      <EmailCampaignList />
      
      <CreateCampaignDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  )
}