
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Upload } from "lucide-react"

interface BasicInfoStepProps {
  formData: {
    title: string
    description: string
    thumbnail: string
  }
  handleInputChange: (field: string, value: any) => void
}

export function BasicInfoStep({ formData, handleInputChange }: BasicInfoStepProps) {
  return (
    <EnhancedCard>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-courses-500" />
          Basic Course Information
        </CardTitle>
        <CardDescription>Start with the fundamentals of your course</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Complete Web Development Bootcamp"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Course Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe what students will learn in this course..."
            rows={4}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Course Thumbnail</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-courses-500 transition-colors cursor-pointer">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB (1280x720 recommended)</p>
          </div>
        </div>
      </CardContent>
    </EnhancedCard>
  )
}