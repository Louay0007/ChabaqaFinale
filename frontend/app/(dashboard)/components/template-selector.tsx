"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Monitor, Smartphone, Tablet, Eye, Check } from "lucide-react"
import { useState } from "react"
import { getTemplateComponent } from "@/lib/template-renderer"
import { cn } from "@/lib/utils"

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateChange: (template: string) => void
  community: any
}

const templates = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean, professional design perfect for business communities",
    features: ["Professional Layout", "Business-focused", "Clean Typography", "Corporate Colors"],
    preview: "/placeholder.svg?height=200&width=300",
    category: "Business",
    color: "blue",
  },
  {
    id: "creative",
    name: "Creative Explosion",
    description: "Bold, vibrant design for creative communities and artists",
    features: ["Vibrant Colors", "Creative Animations", "Artistic Layout", "Bold Typography"],
    preview: "/placeholder.svg?height=200&width=300",
    category: "Creative",
    color: "purple",
  },
  {
    id: "minimal",
    name: "Minimal Elegance",
    description: "Clean, minimal design focused on content and clarity",
    features: ["Minimal Design", "Typography Focus", "Clean Layout", "Subtle Animations"],
    preview: "/placeholder.svg?height=200&width=300",
    category: "Minimal",
    color: "gray",
  },
]

export function TemplateSelector({ selectedTemplate, onTemplateChange, community }: TemplateSelectorProps) {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "tablet" | "mobile">("desktop")

  const getPreviewViewportClass = () => {
    switch (previewViewport) {
      case "mobile":
        return "w-[375px] h-[667px]"
      case "tablet":
        return "w-[768px] h-[1024px]"
      default:
        return "w-full h-full"
    }
  }

  const PreviewComponent = previewTemplate ? getTemplateComponent(previewTemplate) : null

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id
          const colorClasses = {
            blue: "border-blue-200 bg-blue-50",
            purple: "border-purple-200 bg-purple-50",
            gray: "border-gray-200 bg-gray-50",
          }

          return (
            <Card
              key={template.id}
              className={cn(
                "cursor-pointer transition-all duration-300 hover:shadow-lg",
                isSelected
                  ? `ring-2 ring-${template.color}-500 ${colorClasses[template.color as keyof typeof colorClasses]}`
                  : "hover:shadow-md",
              )}
              onClick={() => onTemplateChange(template.id)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Template Preview */}
                  <div className="relative">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={template.preview || "/placeholder.svg"}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div
                          className={`w-6 h-6 bg-${template.color}-500 rounded-full flex items-center justify-center`}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPreviewTemplate(template.id)
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>

                  {/* Template Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <Badge
                        variant="outline"
                        className={cn(
                          template.color === "blue" && "border-blue-200 text-blue-800",
                          template.color === "purple" && "border-purple-200 text-purple-800",
                          template.color === "gray" && "border-gray-200 text-gray-800",
                        )}
                      >
                        {template.category}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Features</p>
                      <div className="flex flex-wrap gap-1">
                        {template.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => onTemplateChange(template.id)}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPreviewTemplate(template.id)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Template Preview Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-7xl w-full h-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{templates.find((t) => t.id === previewTemplate)?.name} Preview</DialogTitle>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Button
                    variant={previewViewport === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewViewport("desktop")}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewViewport === "tablet" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewViewport("tablet")}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewViewport === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewViewport("mobile")}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={() => {
                    if (previewTemplate) {
                      onTemplateChange(previewTemplate)
                      setPreviewTemplate(null)
                    }
                  }}
                >
                  Use This Template
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex items-center justify-center bg-gray-100">
              <div className={`bg-white shadow-2xl transition-all duration-300 ${getPreviewViewportClass()}`}>
                <div className="h-full overflow-y-auto">
                  {PreviewComponent && <PreviewComponent community={community} posts={community.posts || []} />}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
