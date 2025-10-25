"use client"

import { EnhancedCard } from "@/components/ui/enhanced-card"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, PlayCircle, Lock, Unlock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Course } from "@/lib/models"

export function ContentTab({ course }: { course: Course }) {
  const [newSection, setNewSection] = useState({
    title: "",
    description: "",
  })

  const [newChapter, setNewChapter] = useState({
    title: "",
    content: "",
    videoUrl: "",
    duration: "",
    isPreview: false,
    price: "",
    notes: "",
  })

  const handleAddSection = () => {
    console.log("Adding section:", newSection)
    setNewSection({ title: "", description: "" })
  }

  const handleAddChapter = (sectionId: string) => {
    console.log("Adding chapter to section:", sectionId, newChapter)
    setNewChapter({
      title: "",
      content: "",
      videoUrl: "",
      duration: "",
      isPreview: false,
      price: "",
      notes: "",
    })
  }

  return (
    <EnhancedCard>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Course Content</CardTitle>
            <CardDescription>Manage your course sections and chapters</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Section</DialogTitle>
                <DialogDescription>Create a new section to organize your course content</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sectionTitle">Section Title</Label>
                  <Input
                    id="sectionTitle"
                    placeholder="e.g., HTML Fundamentals"
                    value={newSection.title}
                    onChange={(e) => setNewSection((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sectionDescription">Description</Label>
                  <Textarea
                    id="sectionDescription"
                    placeholder="Brief description of what this section covers"
                    value={newSection.description}
                    onChange={(e) => setNewSection((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddSection}>Add Section</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {course.sections.map((section, sectionIndex) => (
            <div key={section.id} className="border rounded-lg p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Section {sectionIndex + 1}: {section.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{section.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{section.chapters.length} chapters</Badge>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {section.chapters.map((chapter, chapterIndex) => (
                  <div key={chapter.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {chapter.isPreview ? (
                          <Unlock className="h-4 w-4 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 text-orange-500" />
                        )}
                        <PlayCircle className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {chapterIndex + 1}. {chapter.title}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{chapter.duration} min</span>
                          {chapter.isPreview && (
                            <Badge variant="outline" className="text-xs">
                              Free Preview
                            </Badge>
                          )}
                          {chapter.price && (
                            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                              ${chapter.price}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Chapter to {section.title}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Chapter</DialogTitle>
                      <DialogDescription>Add a new chapter to {section.title}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="chapterTitle">Chapter Title</Label>
                          <Input
                            id="chapterTitle"
                            placeholder="e.g., Introduction to HTML"
                            value={newChapter.title}
                            onChange={(e) => setNewChapter((prev) => ({ ...prev, title: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="chapterDuration">Duration (minutes)</Label>
                          <Input
                            id="chapterDuration"
                            type="number"
                            placeholder="15"
                            value={newChapter.duration}
                            onChange={(e) => setNewChapter((prev) => ({ ...prev, duration: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="chapterVideo">Video URL</Label>
                        <Input
                          id="chapterVideo"
                          placeholder="https://youtube.com/embed/..."
                          value={newChapter.videoUrl}
                          onChange={(e) => setNewChapter((prev) => ({ ...prev, videoUrl: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="chapterContent">Chapter Content</Label>
                        <Textarea
                          id="chapterContent"
                          rows={4}
                          placeholder="Describe what students will learn in this chapter..."
                          value={newChapter.content}
                          onChange={(e) => setNewChapter((prev) => ({ ...prev, content: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="chapterNotes">Chapter Notes</Label>
                        <Textarea
                          id="chapterNotes"
                          rows={3}
                          placeholder="Additional notes or instructions for this chapter..."
                          value={newChapter.notes}
                          onChange={(e) => setNewChapter((prev) => ({ ...prev, notes: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="chapterPreview"
                            checked={newChapter.isPreview}
                            onCheckedChange={(checked) =>
                              setNewChapter((prev) => ({ ...prev, isPreview: checked }))
                            }
                          />
                          <Label htmlFor="chapterPreview">Free Preview</Label>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="chapterPrice">Individual Price (optional)</Label>
                          <Input
                            id="chapterPrice"
                            type="number"
                            placeholder="9.99"
                            value={newChapter.price}
                            onChange={(e) => setNewChapter((prev) => ({ ...prev, price: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => handleAddChapter(section.id)}>Add Chapter</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </EnhancedCard>
  )
}