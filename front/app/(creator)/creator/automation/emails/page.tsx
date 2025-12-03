"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { EmailCampaignList } from "./components/email-campaign-list"
import { CampaignStats } from "./components/campaign-stats"
import { CreateCampaignDialog } from "./components/create-campaign-dialog"
import { EmailTemplateCards } from "./components/email-template-cards"
import { emailCampaignsApi, EmailCampaign, CampaignStats as CampaignStatsType } from "@/lib/api"
import { useCommunityContext } from "@/app/providers/community-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function EmailCampaignsPage() {
  const { selectedCommunity } = useCommunityContext()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Campaign list state
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [campaignsLoading, setcampaignsLoading] = useState(true)
  const [campaignsError, setCampaignsError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCampaigns, setTotalCampaigns] = useState(0)
  const limit = 10

  // Stats state
  const [stats, setStats] = useState<CampaignStatsType | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  // Fetch campaigns
  const fetchCampaigns = async (page: number = 1) => {
    if (!selectedCommunity?.id) return

    try {
      setcampaignsLoading(true)
      setCampaignsError(null)

      const response = await emailCampaignsApi.getCommunityCampaigns(
        selectedCommunity.id,
        { page, limit }
      )

      setCampaigns(response.campaigns)
      setCurrentPage(response.page)
      setTotalPages(Math.ceil(response.total / response.limit))
      setTotalCampaigns(response.total)
    } catch (error: any) {
      console.error('Error fetching campaigns:', error)
      setCampaignsError(error.message || 'Failed to load campaigns')
      setCampaigns([])
    } finally {
      setcampaignsLoading(false)
    }
  }

  // Fetch stats
  const fetchStats = async () => {
    if (!selectedCommunity?.id) return

    try {
      setStatsLoading(true)
      setStatsError(null)

      const response = await emailCampaignsApi.getCampaignStats(selectedCommunity.id)
      setStats(response)
    } catch (error: any) {
      console.error('Error fetching stats:', error)
      setStatsError(error.message || 'Failed to load statistics')
      setStats(null)
    } finally {
      setStatsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (selectedCommunity?.id) {
      fetchCampaigns()
      fetchStats()
    }
  }, [selectedCommunity?.id])

  // Refresh data after creating a campaign
  const handleCampaignCreated = () => {
    fetchCampaigns(currentPage)
    fetchStats()
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchCampaigns(page)
  }

  if (!selectedCommunity) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a community to manage email campaigns
          </AlertDescription>
        </Alert>
      </div>
    )
  }

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
          disabled={!selectedCommunity}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Campaign Stats */}
      <CampaignStats
        stats={stats}
        loading={statsLoading}
        error={statsError}
      />

      {/* Email Templates */}
      <EmailTemplateCards />

      {/* Campaign List */}
      {campaignsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{campaignsError}</AlertDescription>
        </Alert>
      )}

      <EmailCampaignList
        campaigns={campaigns}
        loading={campaignsLoading}
        pagination={{
          page: currentPage,
          limit: limit,
          total: totalCampaigns,
          totalPages: totalPages
        }}
        onPageChange={handlePageChange}
      />

      {/* Create Campaign Dialog */}
      <CreateCampaignDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  )
}