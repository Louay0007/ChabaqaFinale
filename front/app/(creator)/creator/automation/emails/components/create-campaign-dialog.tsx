"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  type: z.enum(["regular", "content-reminder", "inactive-users"]),
  subject: z.string().min(1, "Subject line is required"),
  content: z.string().min(1, "Email content is required"),
  sendingTime: z.enum(["now", "scheduled"]),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  inactiveDays: z.enum(["7", "15", "30", "60"]).optional(),
})

interface CreateCampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCampaignDialog({
  open,
  onOpenChange,
}: CreateCampaignDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "regular",
      subject: "",
      content: "",
      sendingTime: "now",
      scheduledDate: "",
      scheduledTime: "",
      inactiveDays: undefined,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Here you would typically send this to your API
    console.log(values)
    onOpenChange(false)
  }

  const [previewMode, setPreviewMode] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Create a new email campaign for your community members
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter campaign name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="regular">Regular Announcement</SelectItem>
                      <SelectItem value="content-reminder">Content Reminder</SelectItem>
                      <SelectItem value="inactive-users">Inactive Users</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the type of campaign you want to send
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Line</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email subject..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Available variables: &#123;&#123;userName&#125;&#125;, &#123;&#123;communityName&#125;&#125;, &#123;&#123;currentDate&#125;&#125;
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your email content..."
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sendingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>When to send</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select when to send" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="now">Send Now</SelectItem>
                      <SelectItem value="scheduled">Schedule for Later</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("sendingTime") === "scheduled" && (
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scheduledTime"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {form.watch("type") === "inactive-users" && (
              <FormField
                control={form.control}
                name="inactiveDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inactive for</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inactive period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="15">15 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60+ days</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Target users who haven't been active for the selected period
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                Preview
              </Button>
              <Button type="submit" className="bg-chabaqa-primary">
                Create Campaign
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}