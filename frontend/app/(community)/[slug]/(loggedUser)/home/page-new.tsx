import { communityService, postService } from "@/lib/services"
import { CommunityFeedClient } from "./components/community-feed-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, BookOpen, Zap, Trophy, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function CommunityHomePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Fetch community data
  const community = await communityService.getCommunityBySlug(slug)

  // Fetch posts for this community
  const postsData = await postService.getPostsByCommunity(community._id, 1, 20)

  // TODO: Get current user ID from auth session
  const currentUserId = undefined

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed - Left Column */}
        <div className="lg:col-span-2">
          <CommunityFeedClient
            communityId={community._id}
            initialPosts={postsData.posts}
            currentUserId={currentUserId}
          />
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Members</span>
                </div>
                <span className="font-semibold">{community.membersCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Rating</span>
                </div>
                <span className="font-semibold">{community.averageRating || "N/A"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href={`/${slug}/courses`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <BookOpen className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Courses</p>
                  <p className="text-xs text-muted-foreground">Learn new skills</p>
                </div>
              </Link>
              <Link
                href={`/${slug}/challenges`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Challenges</p>
                  <p className="text-xs text-muted-foreground">Test your skills</p>
                </div>
              </Link>
              <Link
                href={`/${slug}/events`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <Calendar className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Events</p>
                  <p className="text-xs text-muted-foreground">Join live sessions</p>
                </div>
              </Link>
              <Link
                href={`/${slug}/products`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <Zap className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Products</p>
                  <p className="text-xs text-muted-foreground">Browse resources</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Community Tags */}
          {community.tags && community.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {community.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
