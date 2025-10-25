"use client"

import { EnhancedCard } from "@/components/ui/enhanced-card"
import { CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, X, Download, Box, Link as LinkIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useProductForm } from "./product-form-context"

const fileTypes = [
  "PDF",
  "ZIP",
  "MP3",
  "MP4",
  "EXE",
  "DOC",
  "PSD",
  "AI",
  "Figma",
  "Other",
]

export function DeliveryStep() {
  const {
    formData,
    addFile,
    updateFile,
    removeFile,
    handleInputChange,
  } = useProductForm()

  return (
    <EnhancedCard>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Download className="h-5 w-5 mr-2 text-primary-500" />
            Digital Delivery
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{formData.files.length} files</Badge>
            <Button onClick={addFile} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add File
            </Button>
          </div>
        </CardTitle>
        <CardDescription>Set up how customers will receive your digital product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {formData.files.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Box className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No files added yet</h3>
            <p className="text-muted-foreground mb-6">Add the files customers will download after purchase</p>
            <Button onClick={addFile}>
              <Plus className="h-4 w-4 mr-2" />
              Add First File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.files.map((file: any, index: number) => (
              <div
                key={file.id}
                className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      File {index + 1}
                    </Badge>
                    <span className="font-medium">{file.name || `File ${index + 1}`}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.id)}
                    className="text-red-500 hover:text-red-700 h-8 w-8"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="space-y-1">
                    <Label className="text-xs">File Name *</Label>
                    <Input
                      placeholder="e.g., Ultimate Guide.pdf"
                      value={file.name}
                      onChange={(e) => updateFile(file.id, "name", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">File Type</Label>
                    <Select
                      value={file.type}
                      onValueChange={(value) => updateFile(file.id, "type", value)}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fileTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Download URL *</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="https://example.com/file.pdf"
                      value={file.url}
                      onChange={(e) => updateFile(file.id, "url", e.target.value)}
                      className="h-8 text-sm"
                    />
                    <Button variant="outline" size="sm" className="h-8">
                      <LinkIcon className="h-4 w-4 mr-1" />
                      Test
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-2">
              <Label>License Terms</Label>
              <Textarea
                placeholder="Describe how customers can use your product (e.g., personal use only, commercial license, etc.)"
                rows={4}
                value={formData.licenseTerms}
                onChange={(e) => handleInputChange("licenseTerms", e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>
    </EnhancedCard>
  )
}