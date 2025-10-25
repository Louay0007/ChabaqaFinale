"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Download, Star, Heart, Eye } from "lucide-react"

interface TemplatePreviewModalProps {
  template: any
  onClose: () => void
}

export function TemplatePreviewModal({ template, onClose }: TemplatePreviewModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <DialogTitle className="text-2xl">{template.name}</DialogTitle>
                <p className="text-gray-600 mt-1">{template.description}</p>
              </div>
              {template.isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">Premium</Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  {template.rating}
                </div>
                <div className="flex items-center">
                  <Download className="w-4 h-4 mr-1" />
                  {template.downloads}
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Preview */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center">
            <img
              src={template.preview || "/placeholder.svg"}
              alt={`${template.name} preview`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-white border-l p-6 space-y-6">
            {/* Tags */}
            <div>
              <h4 className="font-semibold mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <h4 className="font-semibold mb-3">Color Palette</h4>
              <div className="flex space-x-2">
                {template.colors.map((color: string, index: number) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-gray-500 mt-1">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Responsive design</li>
                <li>• Customizable colors</li>
                <li>• Multiple layouts</li>
                <li>• SEO optimized</li>
                <li>• Mobile friendly</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t">
              <Button className="w-full bg-gradient-to-r from-chabaqa-primary to-chabaqa-secondary1 text-white">
                Use This Template
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
