
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookOpen, Eye, Edit, Trash2, MoreHorizontal, Star, Users, PlayCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    thumbnail?: string
    isPublished: boolean
    price: number
    sections: Array<{ chapters: Array<any> }>
    enrollments: Array<any>
    category?: string
    level?: string
  }
}

export function CourseCard({ course }: CourseCardProps) {
  const totalChapters = course.sections.reduce((acc, s) => acc + s.chapters.length, 0)
  const pricing = getCoursePricing(course)

  function getCoursePricing(course: any) {
    if (course.price === 0) {
      const paidChapters = course.sections.flatMap((s: any) => s.chapters).filter((c: any) => c.price && c.price > 0)
      if (paidChapters.length > 0) {
        return { type: "freemium", basePrice: 0, paidChapters: paidChapters.length }
      }
      return { type: "free", basePrice: 0 }
    }
    return { type: "paid", basePrice: course.price }
  }

  return (
    <EnhancedCard key={course.id} hover className="overflow-hidden">
      <div className="relative">
        <Image
          src={course.thumbnail || "/placeholder.svg?height=200&width=400&query=course+thumbnail"}
          alt={course.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={course.isPublished ? "published" : "draft"} />
        </div>
        <div className="absolute bottom-3 left-3">
          {pricing.type === "free" ? (
            <Badge className="bg-green-500 text-white">Free</Badge>
          ) : pricing.type === "freemium" ? (
            <Badge className="bg-blue-500 text-white">Free + Premium</Badge>
          ) : (
            <Badge className="bg-courses-500 text-white">${course.price}</Badge>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-white/20 hover:bg-white/30 border-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/creator/courses/${course.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Course
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/creator/courses/${course.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Course
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
        <CardDescription className="line-clamp-3">{course.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <BookOpen className="h-4 w-4 mr-2" />
            <div>
              <div className="font-medium text-foreground">{course.sections.length}</div>
              <div>Sections</div>
            </div>
          </div>
          <div className="flex items-center text-muted-foreground">
            <PlayCircle className="h-4 w-4 mr-2" />
            <div>
              <div className="font-medium text-foreground">{totalChapters}</div>
              <div>Chapters</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <div>
              <div className="font-medium text-foreground">{course.enrollments.length}</div>
              <div>Enrolled</div>
            </div>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Star className="h-4 w-4 mr-2" />
            <div>
              <div className="font-medium text-foreground">4.8</div>
              <div>Rating</div>
            </div>
          </div>
        </div>

        {pricing.type === "freemium" && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm font-medium text-blue-800">Freemium Course</div>
            <div className="text-xs text-blue-600 mt-1">
              {pricing.paidChapters} premium chapters available
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            {course.category && (
              <Badge variant="outline" className="text-xs">
                {course.category}
              </Badge>
            )}
            {course.level && (
              <Badge variant="outline" className="text-xs">
                {course.level}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" asChild>
              <Link href={`/creator/courses/${course.id}/manage`}>
                <Edit className="h-4 w-4 mr-1" />
                Manage
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </EnhancedCard>
  )
}