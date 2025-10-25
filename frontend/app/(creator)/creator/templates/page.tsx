import { DashboardLayout } from "@/app/(creator)/creator/components/dashboard-layout"
import { TemplateGalleryEnhanced } from "@/app/(creator)/creator/components/template-gallery-enhanced"
import { TemplatePreviewDashboard } from "@/app/(creator)/creator/components/template-preview-dashboard"

export default function TemplatesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-600 mt-2">Choose and customize your community template</p>
        </div>

        <TemplatePreviewDashboard />

        <TemplateGalleryEnhanced />
      </div>
    </DashboardLayout>
  )
}
