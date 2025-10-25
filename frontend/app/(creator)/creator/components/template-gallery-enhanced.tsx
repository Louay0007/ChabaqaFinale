"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Star, Settings, Palette, Layout, Zap } from "lucide-react"
import { useState } from "react"
import { TemplatePreviewModal } from "@/app/(creator)/creator/components/template-preview-modal-enhanced"
import { communitiesData } from "@/lib/data-communities"

export function TemplateGalleryEnhanced() {
  const [previewTemplate, setPreviewTemplate] = useState<any>(null)

  const templates = [
    {
      id: "modern",
      name: "Modern Professional",
      description: "Perfect for business and professional communities",
      category: "business",
      style: "professional",
      image: "/placeholder.svg?height=300&width=400",
      preview: "/placeholder.svg?height=600&width=800",
      rating: 4.9,
      downloads: 1234,
      tags: ["Professional", "Clean", "Business"],
      isPremium: false,
      colors: ["#3b82f6", "#1e40af"],
      features: ["Responsive Design", "SEO Optimized", "Analytics Ready", "Mobile First"],
      customizable: {
        colors: true,
        fonts: true,
        layout: true,
        sections: true,
      },
    },
    {
      id: "creative",
      name: "Creative Studio",
      description: "Vibrant design for creative professionals and artists",
      category: "design",
      style: "creative",
      image: "/placeholder.svg?height=300&width=400",
      preview: "/placeholder.svg?height=600&width=800",
      rating: 4.8,
      downloads: 987,
      tags: ["Creative", "Artistic", "Vibrant"],
      isPremium: true,
      colors: ["#ec4899", "#8b5cf6"],
      features: ["Animation Effects", "Portfolio Showcase", "Creative Layouts", "Color Gradients"],
      customizable: {
        colors: true,
        fonts: true,
        layout: true,
        sections: true,
        animations: true,
      },
    },
    {
      id: "minimal",
      name: "Minimal Clean",
      description: "Ultra-clean design focused on content and clarity",
      category: "technology",
      style: "minimal",
      image: "/placeholder.svg?height=300&width=400",
      preview: "/placeholder.svg?height=600&width=800",
      rating: 4.7,
      downloads: 756,
      tags: ["Minimal", "Clean", "Focus"],
      isPremium: false,
      colors: ["#1f2937", "#6b7280"],
      features: ["Distraction Free", "Typography Focus", "Fast Loading", "Accessibility"],
      customizable: {
        colors: true,
        fonts: true,
        layout: false,
        sections: true,
      },
    },
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden"
          >
            <div className="relative">
              <img
                src={template.image || "/placeholder.svg"}
                alt={template.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

              {/* Premium Badge */}
              {template.isPremium && (
                <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                  Premium
                </Badge>
              )}

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white"
                  onClick={() => setPreviewTemplate({ template, community: communitiesData.communities[0] })}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>

              {/* Color Palette */}
              <div className="absolute bottom-3 left-3 flex space-x-1">
                {template.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-chabaqa-primary transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Features:</h4>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                    {template.features.slice(0, 4).map((feature) => (
                      <div key={feature} className="flex items-center">
                        <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customization Options */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Customizable:</h4>
                  <div className="flex space-x-3">
                    {template.customizable.colors && (
                      <div className="flex items-center text-xs text-gray-600">
                        <Palette className="w-3 h-3 mr-1" />
                        Colors
                      </div>
                    )}
                    {template.customizable.layout && (
                      <div className="flex items-center text-xs text-gray-600">
                        <Layout className="w-3 h-3 mr-1" />
                        Layout
                      </div>
                    )}
                    {template.customizable.animations && (
                      <div className="flex items-center text-xs text-gray-600">
                        <Zap className="w-3 h-3 mr-1" />
                        Animations
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {template.rating}
                    </div>
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      {template.downloads}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-chabaqa-primary to-chabaqa-secondary1 text-white"
                    size="sm"
                  >
                    Use Template
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewTemplate({ template, community: communitiesData.communities[0] })}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          community={previewTemplate.community}
          template={previewTemplate.template.id}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </>
  )
}
