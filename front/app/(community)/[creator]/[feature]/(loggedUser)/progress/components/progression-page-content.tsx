"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useToast } from "@/hooks/../hooks/use-toast"
import { progressionApi } from "@/lib/api/progression.api"
import { achievementsApi } from "@/lib/api/achievements.api"
import type {
  Community,
  ProgressionContentType,
  ProgressionItem,
  ProgressionOverview,
  AchievementWithProgress,
} from "@/lib/api/types"
import { cn } from "@/lib/utils"
import {
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  Heart,
  Layers,
  Loader2,
  MessageSquare,
  Package,
  RefreshCw,
  Repeat,
  Search,
  ShoppingBag,
  Target,
  Timer,
  Users,
  Flag,
} from "lucide-react"

type TypeFilter = "all" | ProgressionContentType

const currencyFormatter = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const formatCurrency = (value?: unknown) => {
  if (typeof value !== "number") return undefined
  return currencyFormatter.format(value)
}

const formatDateLabel = (value?: unknown) => {
  if (!value) return undefined
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return undefined
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

const TYPE_CONFIG: Record<
  ProgressionContentType,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  course: { label: "Courses", icon: BookOpen },
  challenge: { label: "Challenges", icon: Flag },
  session: { label: "Sessions", icon: Users },
  event: { label: "Events", icon: CalendarDays },
  product: { label: "Products", icon: ShoppingBag },
  post: { label: "Posts", icon: MessageSquare },
  resource: { label: "Resources", icon: FileText },
  community: { label: "Community", icon: Building2 },
  subscription: { label: "Subscriptions", icon: Repeat },
}

const STATUS_CONFIG: Record<
  ProgressionItem["status"],
  { label: string; className: string }
> = {
  not_started: {
    label: "Not started",
    className: "bg-slate-100 text-slate-700",
  },
  in_progress: {
    label: "In progress",
    className: "bg-amber-100 text-amber-800",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700",
  },
}

const DEFAULT_LIMIT = 12

interface ProgressionPageContentProps {
  slug: string
  community: Community
  initialData: ProgressionOverview
}

type MainTab = 'progress' | 'achievements'

export default function ProgressionPageContent({
  slug,
  community,
  initialData,
}: ProgressionPageContentProps) {
  const { toast } = useToast()
  const [items, setItems] = useState<ProgressionItem[]>(initialData.items || [])
  const [summary, setSummary] = useState(initialData.summary)
  const [pagination, setPagination] = useState(initialData.pagination)
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const [searchValue, setSearchValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const activeLimit = pagination?.limit || DEFAULT_LIMIT

  const activeTypes = useMemo(() => {
    return Object.entries(summary?.byType || {})
      .filter(([, data]) => (data?.total ?? 0) > 0)
      .map(([key]) => key as ProgressionContentType)
  }, [summary])

  const filteredItems = useMemo(() => {
    let result = [...items]
    if (typeFilter !== "all") {
      result = result.filter((item) => item.contentType === typeFilter)
    }
    if (searchValue.trim().length > 0) {
      const term = searchValue.toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.meta &&
            Object.values(item.meta).some((value) =>
              String(value).toLowerCase().includes(term),
            ),
      )
    }
    return result
  }, [items, typeFilter, searchValue])

  const hasMore =
    (pagination?.page || 1) < (pagination?.totalPages || 1) &&
    !isLoading &&
    !isLoadingMore

  const fetchProgress = useCallback(
    async (options?: { page?: number; append?: boolean }) => {
      const pageToFetch = options?.page ?? 1
      const append = options?.append ?? false
      const params = {
        communitySlug: slug,
        page: pageToFetch,
        limit: activeLimit,
        contentTypes:
          typeFilter === "all" ? undefined : ([typeFilter] as ProgressionContentType[]),
      }

      const response = await progressionApi.getOverview(params)

      setSummary(response.summary)
      setPagination(response.pagination)

      setItems((prev) => {
        if (!append) {
          return response.items
        }
        const existingKeys = new Set(
          prev.map((item) => `${item.contentType}-${item.contentId}`),
        )
        const merged = [...prev]
        response.items.forEach((item) => {
          const key = `${item.contentType}-${item.contentId}`
          if (!existingKeys.has(key)) {
            merged.push(item)
          }
        })
        return merged
      })
    },
    [slug, typeFilter, activeLimit],
  )

  const handleTypeChange = useCallback(
    async (value: string) => {
      setTypeFilter(value as TypeFilter)
      setIsLoading(true)
      try {
        await fetchProgress({ page: 1, append: false })
      } catch (error) {
        console.error(error)
        toast({
          variant: "destructive",
          title: "Unable to load data",
          description: "Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [fetchProgress, toast],
  )

  const handleRefresh = useCallback(async () => {
    setIsLoading(true)
    try {
      await fetchProgress({ page: 1, append: false })
      toast({
        title: "Progress updated",
        description: "Latest progression stats have been loaded.",
      })
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Refresh failed",
        description: "We couldn’t refresh your progress. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [fetchProgress, toast])

  const handleLoadMore = useCallback(async () => {
    if (!hasMore) return
    setIsLoadingMore(true)
    try {
      await fetchProgress({ page: (pagination?.page || 1) + 1, append: true })
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Unable to load more",
        description: "Please try again.",
      })
    } finally {
      setIsLoadingMore(false)
    }
  }, [fetchProgress, hasMore, pagination?.page, toast])

  const summaryCards = useMemo(
    () => [
      {
        label: "Tracked items",
        value: summary?.totalItems ?? 0,
        icon: Layers,
      },
      {
        label: "Completed",
        value: summary?.completed ?? 0,
        icon: CheckCircle2,
        accent: "text-emerald-600",
      },
      {
        label: "In progress",
        value: summary?.inProgress ?? 0,
        icon: Timer,
        accent: "text-amber-600",
      },
      {
        label: "Yet to start",
        value: summary?.notStarted ?? 0,
        icon: BadgeCheck,
        accent: "text-slate-600",
      },
    ],
    [summary],
  )


  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-r from-primary/80 via-primary/70 to-primary/50 px-8 py-10 text-white">
        <div className="absolute inset-0 opacity-10">
          {community.coverImage && (
            <Image
              src={community.coverImage}
              alt={community.name}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="relative z-10 max-w-3xl">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white">
            Progress overview
          </Badge>
          <h1 className="text-3xl font-semibold leading-tight">
            Keep growing with <span className="text-white/90">{community.name}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80">
            Visualize how far you’ve come across courses, challenges, sessions, and
            more. Use these insights to stay consistent and celebrate every milestone.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div>
              <p className="text-white/80 text-sm">Total completed</p>
              <p className="text-3xl font-bold">
                {summary?.completed ?? 0}
                <span className="text-base font-normal text-white/80">
                  /{summary?.totalItems ?? 0}
                </span>
              </p>
            </div>
            <div className="h-10 w-px bg-white/30" />
            <div>
              <p className="text-white/80 text-sm">Active journeys</p>
              <p className="text-3xl font-bold">{summary?.inProgress ?? 0}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="border border-border/70 shadow-sm">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className={cn("mt-1 text-2xl font-semibold", card.accent)}>
                  {card.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {!!activeTypes.length && (
        <section className="rounded-2xl border bg-card">
          <CardHeader className="gap-2">
            <CardTitle className="text-lg">Progress by experience</CardTitle>
            <p className="text-sm text-muted-foreground">
              Where you’ve invested your time across the community
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeTypes.map((type) => {
              const config = TYPE_CONFIG[type]
              const data = summary?.byType?.[type]
              if (!config || !data) return null
              const percent =
                data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0

              return (
                <div
                  key={type}
                  className="rounded-2xl border border-dashed p-5 shadow-sm transition hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className=" rounded-lg bg-primary/10 p-2 text-primary">
                        <config.icon className="h-4 w-4" />
                      </div>
                      <p className="font-semibold text-sm">{config.label}</p>
                    </div>
                    <Badge variant="outline">
                      {data.completed}/{data.total}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-sm text-muted-foreground">
                      <span>Completion</span>
                      <span>{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-lg font-semibold">Your learning timeline</p>
            <p className="text-sm text-muted-foreground">
              Track everything you’ve started across this community and jump back in
              where you left off.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="w-full sm:max-w-xs">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search by title, topic, or status"
                  className="pl-9"
                />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleRefresh}
              disabled={isLoading || isLoadingMore}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        <Tabs value={typeFilter} onValueChange={(value) => handleTypeChange(value)}>
          <TabsList className="w-full justify-start overflow-x-auto rounded-full bg-muted/50 p-1">
            <TabsTrigger value="all" className="px-4">
              All ({summary?.totalItems ?? 0})
            </TabsTrigger>
            {activeTypes.map((type) => (
              <TabsTrigger key={type} value={type} className="px-4 capitalize">
                {TYPE_CONFIG[type]?.label ?? type}
                <span className="ml-1 text-xs text-muted-foreground">
                  {summary?.byType?.[type]?.total ?? 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {isLoading ? (
            <Card className="border border-dashed">
              <CardContent className="flex items-center gap-3 py-10 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Updating your progress...
              </CardContent>
            </Card>
          ) : filteredItems.length === 0 ? (
            <Card className="border border-dashed">
              <CardContent className="py-10 text-center">
                <p className="text-lg font-semibold">No progress to display yet</p>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground mx-auto">
                  Start a course, join a challenge, or register for an event to see your
                  activity here. We’ll keep this space hydrated as you make progress.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {filteredItems.map((item) => (
                <ProgressionCard key={`${item.contentType}-${item.contentId}`} item={item} />
              ))}
              {hasMore && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="min-w-[180px]"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading more
                      </>
                    ) : (
                      "Load more updates"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function ProgressionCard({ item }: { item: ProgressionItem }) {
  const config = TYPE_CONFIG[item.contentType]
  const statusConfig = STATUS_CONFIG[item.status]

  const metaChips = useMemo(() => {
    const chips: { label: string; value?: string; icon?: React.ComponentType<{ className?: string }> }[] = []
    const meta = (item.meta || {}) as Record<string, any>

    switch (item.contentType) {
      case "course":
        if (meta.level) {
          chips.push({ label: "Level", value: String(meta.level), icon: BookOpen })
        }
        if (meta.category) {
          chips.push({ label: "Category", value: String(meta.category), icon: Layers })
        }
        if (meta.price !== undefined) {
          chips.push({ label: "Price", value: formatCurrency(meta.price), icon: ShoppingBag })
        }
        break
      case "challenge":
        if (meta.difficulty) {
          chips.push({ label: "Difficulty", value: String(meta.difficulty), icon: Target })
        }
        if (meta.startDate) {
          chips.push({
            label: "Starts",
            value: formatDateLabel(meta.startDate),
            icon: CalendarDays,
          })
        }
        if (typeof meta.participants === "number") {
          chips.push({
            label: "Participants",
            value: String(meta.participants),
            icon: Users,
          })
        }
        break
      case "session":
        if (meta.duration) {
          chips.push({ label: "Duration", value: `${meta.duration} min`, icon: Timer })
        }
        if (meta.category) {
          chips.push({ label: "Focus", value: String(meta.category), icon: Target })
        }
        if (meta.price !== undefined) {
          chips.push({ label: "Price", value: formatCurrency(meta.price), icon: ShoppingBag })
        }
        break
      case "event":
        if (meta.category) {
          chips.push({ label: "Category", value: String(meta.category), icon: CalendarDays })
        }
        if (meta.eventType) {
          chips.push({ label: "Format", value: String(meta.eventType), icon: Building2 })
        }
        if (typeof meta.attendees === "number") {
          chips.push({
            label: "Attendees",
            value: String(meta.attendees),
            icon: Users,
          })
        }
        break
      case "product":
        if (meta.productType) {
          chips.push({ label: "Type", value: String(meta.productType), icon: Package })
        }
        if (meta.category) {
          chips.push({ label: "Category", value: String(meta.category), icon: Layers })
        }
        if (meta.price !== undefined) {
          chips.push({ label: "Price", value: formatCurrency(meta.price), icon: ShoppingBag })
        }
        break
      case "post":
        if (meta.tags?.length) {
          chips.push({ label: "Tags", value: (meta.tags as string[]).join(", "), icon: MessageSquare })
        }
        if (typeof meta.likes === "number") {
          chips.push({ label: "Likes", value: String(meta.likes), icon: Heart })
        }
        break
      default:
        break
    }

    return chips
  }, [item])

  return (
    <Card className="overflow-hidden border border-border/60 shadow-sm transition hover:border-primary/40">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              {config ? <config.icon className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {config?.label || item.contentType}
                </Badge>
                {item.community?.name && (
                  <Badge variant="secondary" className="text-xs">
                    {item.community.name}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </div>
          </div>
          {item.thumbnail && (
            <div className="relative h-16 w-16 overflow-hidden rounded-xl border">
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {typeof item.progressPercent === "number" ? (
            <div className="w-full md:flex-1">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{item.progressPercent}%</span>
              </div>
              <Progress value={item.progressPercent} className="mt-2 h-2.5" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {statusConfig ? statusConfig.label : "Status"}
            </p>
          )}
          <div>
            <Badge className={statusConfig?.className}>{statusConfig?.label}</Badge>
          </div>
        </div>

        {metaChips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {metaChips.map((chip) => {
              const Icon = chip.icon
              return (
                <span
                  key={`${chip.label}-${chip.value}`}
                  className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  {chip.label}
                  {chip.value && <span className="text-slate-900 dark:text-slate-100">· {chip.value}</span>}
                </span>
              )
            })}
          </div>
        )}

        <div className="flex flex-col gap-3 border-t pt-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>Updated {formatDistanceToNow(new Date(item.lastAccessedAt || item.completedAt || new Date()), { addSuffix: true })}</span>
          <div className="flex flex-wrap gap-2">
            {item.actions?.view && (
              <Button variant="outline" size="sm" asChild>
                <Link href={item.actions.view}>Open</Link>
              </Button>
            )}
            {item.actions?.continue && (
              <Button size="sm" asChild>
                <Link href={item.actions.continue}>Continue</Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

