"use client"

import { EnhancedCard } from "@/components/ui/enhanced-card"
import { CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, X, ShoppingBag, Upload } from "lucide-react"
import { useProductForm } from "./product-form-context"

const categories = [
  "E-books",
  "Software",
  "Templates",
  "Courses",
  "Music",
  "Art",
  "Photography",
  "Membership",
]

export function BasicInfoStep() {
  const { formData, handleInputChange, handleArrayChange, addArrayItem, removeArrayItem } = useProductForm()

  return (
    <EnhancedCard>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2 text-primary-500" />
          Basic Product Information
        </CardTitle>
        <CardDescription>Start with the fundamentals of your digital product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Product Name *</Label>
          <Input
            id="title"
            placeholder="e.g., Ultimate Photoshop Toolkit"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Product Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe what customers will get with this product..."
            rows={4}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Product Thumbnail</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB (800x800 recommended)</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Key Features *</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("features")}>
              <Plus className="h-4 w-4 mr-1" />
              Add Feature
            </Button>
          </div>
          {formData.features.map((feature: any, index: number) => (
            <div key={index} className="flex space-x-2">
              <Input
                placeholder="e.g., 50+ high-quality templates"
                value={feature}
                onChange={(e) => handleArrayChange("features", index, e.target.value)}
              />
              {formData.features.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem("features", index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </EnhancedCard>
  )
}