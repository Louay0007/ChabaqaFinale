"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Monitor, Smartphone, Tablet } from "lucide-react"
import { useState } from "react"
import { getTemplateComponent } from "@/lib/template-renderer"
import { mockPosts } from "@/lib/data-communities"

interface TemplatePreviewModalEnhancedProps {
  community: any
  template: string
  device?: "desktop" | "tablet" | "mobile"
  onClose: () => void
}

export function TemplatePreviewModal({ community, template, onClose }: TemplatePreviewModalEnhancedProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")

  // Create a community with the selected template
  const previewCommunity = {
    ...community,
    settings: {
      ...community.settings,
      template: template,
    },
  }

  const communityPosts = mockPosts.filter((p) => p.communityId === community.id)
  const TemplateComponent = getTemplateComponent(template)

  const getViewportClass = () => {
    switch (viewMode) {
      case "mobile":
        return "w-[375px] h-[667px]"
      case "tablet":
        return "w-[768px] h-[1024px]"
      default:
        return "w-full h-full"
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <DialogHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <DialogTitle className="text-2xl">{community.name}</DialogTitle>
                <p className="text-gray-600 mt-1">Template: {template}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Preview Mode</Badge>
            </div>

            <div className="flex items-center space-x-4">
              {/* Viewport Controls */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "desktop" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("desktop")}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "tablet" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("tablet")}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "mobile" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("mobile")}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 bg-gray-100 flex items-center justify-center p-6 overflow-hidden">
          <div
            className={`${getViewportClass()} bg-white rounded-lg shadow-2xl overflow-auto transition-all duration-300`}
          >
            <TemplateComponent community={previewCommunity} posts={communityPosts} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
