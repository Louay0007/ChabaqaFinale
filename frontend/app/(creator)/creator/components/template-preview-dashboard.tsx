"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Settings, Monitor, Tablet, Smartphone } from "lucide-react"
import { communitiesData } from "@/lib/data-communities"
import { TemplatePreviewModal } from "@/app/(creator)/creator/components/template-preview-modal-enhanced"
import { cn } from "@/lib/utils"

export function TemplatePreviewDashboard() {
  const [selectedCommunity, setSelectedCommunity] = useState(communitiesData.communities[0])
  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [showPreview, setShowPreview] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")

  const templates = [
    {
      id: "modern",
      name: "Modern Professional",
      description: "Clean, professional design for business communities",
      color: "blue",
      preview: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "creative",
      name: "Creative Studio",
      description: "Vibrant, artistic design for creative communities",
      color: "purple",
      preview: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "minimal",
      name: "Minimal Clean",
      description: "Ultra-clean, distraction-free design",
      color: "gray",
      preview: "/placeholder.svg?height=200&width=300",
    },
  ]

  const currentTemplate = templates.find((t) => t.id === selectedTemplate) || templates[0]

  const getDevicePreviewClass = () => {
    switch (previewDevice) {
      case "mobile":
        return "w-[320px] h-[568px] mx-auto"
      case "tablet":
        return "w-[768px] h-[1024px] mx-auto max-w-full"
      default:
        return "w-full h-[600px]"
    }
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "mobile":
        return Smartphone
      case "tablet":
        return Tablet
      default:
        return Monitor
    }
  }

  return (
    <>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Template Preview
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">Preview your community with different templates and devices</p>
            </div>

            {/* Device Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {(["desktop", "tablet", "mobile"] as const).map((device) => {
                const Icon = getDeviceIcon(device)
                return (
                  <Button
                    key={device}
                    variant={previewDevice === device ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setPreviewDevice(device)}
                    className={cn(
                      "px-3 py-2 transition-all duration-200",
                      previewDevice === device ? "bg-white shadow-sm" : "hover:bg-gray-200",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="ml-2 hidden sm:inline capitalize">{device}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Community</label>
              <Select
                value={selectedCommunity.slug}
                onValueChange={(value) => {
                  const community = communitiesData.communities.find((c) => c.slug === value)
                  if (community) setSelectedCommunity(community)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {communitiesData.communities.map((community) => (
                    <SelectItem key={community.slug} value={community.slug}>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: community.settings.primaryColor }}
                        ></div>
                        <span>{community.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Template</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center space-x-2">
                        <div
                          className={cn(
                            "w-3 h-3 rounded-full",
                            template.color === "blue" && "bg-blue-500",
                            template.color === "purple" && "bg-purple-500",
                            template.color === "gray" && "bg-gray-500",
                          )}
                        ></div>
                        <span>{template.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Responsive Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className="capitalize"
                  style={{
                    borderColor: selectedCommunity.settings.primaryColor,
                    color: selectedCommunity.settings.primaryColor,
                  }}
                >
                  {previewDevice}
                </Badge>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: selectedCommunity.settings.secondaryColor,
                    color: selectedCommunity.settings.secondaryColor,
                  }}
                >
                  {currentTemplate.name}
                </Badge>
              </div>
            </div>

            {/* Device Frame */}
            <div className="bg-gray-100 rounded-xl p-4 sm:p-6 lg:p-8 min-h-[400px] flex items-center justify-center">
              <div
                className={cn(
                  "bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300",
                  getDevicePreviewClass(),
                )}
              >
                {/* Device Header */}
                {previewDevice === "mobile" && (
                  <div className="h-6 bg-gray-900 rounded-t-lg flex items-center justify-center">
                    <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
                  </div>
                )}

                {/* Preview Content */}
                <div className="h-full overflow-hidden relative">
                  {/* Simulated Hero Section */}
                  <div
                    className="h-full flex items-center justify-center relative"
                    style={{
                      background:
                        selectedTemplate === "modern"
                          ? `linear-gradient(135deg, ${selectedCommunity.settings.primaryColor}20 0%, ${selectedCommunity.settings.secondaryColor}20 100%), linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3730a3 100%)`
                          : selectedTemplate === "creative"
                            ? `linear-gradient(135deg, ${selectedCommunity.settings.primaryColor}30 0%, ${selectedCommunity.settings.secondaryColor}30 100%), linear-gradient(135deg, #7c2d12 0%, #be185d 50%, #ea580c 100%)`
                            : "#ffffff",
                    }}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      {selectedTemplate === "minimal" ? (
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                      ) : (
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 text-center space-y-4 p-4 sm:p-6 lg:p-8">
                      {/* Community Avatar */}
                      <div
                        className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg sm:text-xl lg:text-2xl shadow-lg"
                        style={{ backgroundColor: selectedCommunity.settings.primaryColor }}
                      >
                        {selectedCommunity.name.charAt(0)}
                      </div>

                      {/* Community Name */}
                      <div>
                        <h3
                          className={cn(
                            "font-bold mb-2",
                            previewDevice === "mobile" ? "text-lg" : "text-xl sm:text-2xl lg:text-3xl",
                            selectedTemplate === "minimal" ? "text-gray-900" : "text-white",
                          )}
                        >
                          {selectedCommunity.name}
                        </h3>
                        <p
                          className={cn(
                            "text-sm opacity-80 max-w-md mx-auto",
                            selectedTemplate === "minimal" ? "text-gray-600" : "text-white",
                          )}
                        >
                          {selectedCommunity.description}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-center space-x-4 sm:space-x-6">
                        <div className="text-center">
                          <div
                            className={cn(
                              "font-bold",
                              previewDevice === "mobile" ? "text-sm" : "text-base",
                              selectedTemplate === "minimal" ? "text-gray-900" : "text-white",
                            )}
                          >
                            {selectedCommunity.members.toLocaleString()}
                          </div>
                          <div
                            className={cn(
                              "text-xs opacity-70",
                              selectedTemplate === "minimal" ? "text-gray-600" : "text-white",
                            )}
                          >
                            Members
                          </div>
                        </div>
                        <div className="text-center">
                          <div
                            className={cn(
                              "font-bold",
                              previewDevice === "mobile" ? "text-sm" : "text-base",
                              selectedTemplate === "minimal" ? "text-gray-900" : "text-white",
                            )}
                          >
                            {selectedCommunity.rating}
                          </div>
                          <div
                            className={cn(
                              "text-xs opacity-70",
                              selectedTemplate === "minimal" ? "text-gray-600" : "text-white",
                            )}
                          >
                            Rating
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        className={cn(
                          "px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105",
                          previewDevice === "mobile" ? "text-sm" : "text-base",
                        )}
                        style={{
                          backgroundColor:
                            selectedTemplate === "minimal"
                              ? selectedCommunity.settings.primaryColor
                              : "rgba(255,255,255,0.2)",
                          color:
                            selectedTemplate === "minimal"
                              ? "white"
                              : selectedTemplate === "creative"
                                ? selectedCommunity.settings.primaryColor
                                : "white",
                          border: selectedTemplate === "minimal" ? "none" : "1px solid rgba(255,255,255,0.3)",
                        }}
                      >
                        Join Community
                      </button>
                    </div>

                    {/* Template Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        className="text-xs"
                        style={{
                          backgroundColor: `${selectedCommunity.settings.primaryColor}20`,
                          color: selectedTemplate === "minimal" ? selectedCommunity.settings.primaryColor : "white",
                          border: `1px solid ${selectedCommunity.settings.primaryColor}30`,
                        }}
                      >
                        {currentTemplate.name}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Template Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentTemplate.name}</h3>
                <p className="text-gray-600">{currentTemplate.description}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Template Features:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedCommunity.settings.primaryColor }}
                    ></div>
                    <span>Responsive design optimized for all devices</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedCommunity.settings.secondaryColor }}
                    ></div>
                    <span>Customizable colors and branding</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedCommunity.settings.primaryColor }}
                    ></div>
                    <span>Mobile-first optimization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedCommunity.settings.secondaryColor }}
                    ></div>
                    <span>SEO friendly structure</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setShowPreview(true)}
                className="w-full"
                style={{ backgroundColor: selectedCommunity.settings.primaryColor }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Full Preview
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                style={{
                  borderColor: selectedCommunity.settings.primaryColor,
                  color: selectedCommunity.settings.primaryColor,
                }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {showPreview && (
        <TemplatePreviewModal
          community={selectedCommunity}
          template={selectedTemplate}
          device={previewDevice}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  )
}
