"use client"

import { useState } from "react"
import CourseHeader from "@/app/(community)/[creator]/[feature]/(loggedUser)/courses/[courseId]/components/course-header"
import VideoPlayer from "@/app/(community)/[creator]/[feature]/(loggedUser)/courses/[courseId]/components/video-player"
import ChapterTabs from "@/app/(community)/[creator]/[feature]/(loggedUser)/courses/[courseId]/components/chapter-tabs"
import CourseSidebar from "@/app/(community)/[creator]/[feature]/(loggedUser)/courses/[courseId]/components/course-sidebar"

interface CoursePlayerProps {
  creatorSlug: string
  slug: string
  courseId: string
  course: any
  enrollment: any
}

export default function CoursePlayer({ creatorSlug, slug, courseId, course, enrollment }: CoursePlayerProps) {
  const [activeTab, setActiveTab] = useState("content")
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  const allChapters = course.sections.flatMap((s: any) => s.chapters)
  const currentChapter = selectedChapter
    ? allChapters.find((c: any) => c.id === selectedChapter)
    : allChapters.length > 0
      ? allChapters[0]
      : null

  const currentChapterIndex = currentChapter ? allChapters.findIndex((c: any) => c.id === currentChapter.id) : -1
  const progress = enrollment ? (enrollment.progress.filter((p: any) => p.isCompleted).length / allChapters.length) * 100 : 0

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const isChapterAccessible = (chapterId: string) => {
    const chapter = allChapters.find((c: any) => c.id === chapterId)
    if (!chapter) return false
    return enrollment || chapter.isPreview
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <CourseHeader 
          slug={slug} 
          course={course} 
          progress={progress} 
          allChapters={allChapters} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <VideoPlayer 
              creatorSlug={creatorSlug}
              currentChapter={currentChapter}
              isChapterAccessible={isChapterAccessible}
              enrollment={enrollment}
              slug={slug}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              currentTime={currentTime}
              formatTime={formatTime}
            />

            <ChapterTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentChapter={currentChapter}
              currentChapterIndex={currentChapterIndex}
              allChapters={allChapters}
            />
          </div>

          <CourseSidebar 
            course={course}
            enrollment={enrollment}
            allChapters={allChapters}
            progress={progress}
            selectedChapter={selectedChapter}
            setSelectedChapter={setSelectedChapter}
            isChapterAccessible={isChapterAccessible}
          />
        </div>
      </div>
    </div>
  )
}