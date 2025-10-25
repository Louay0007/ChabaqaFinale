"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, BookOpen, Target, Users, Calendar, Clock } from "lucide-react"
import Image from "next/image"

interface FeatureDetailsProps {
  feature: {
    type: "community" | "course" | "challenge" | "event" | "oneToOne"
    name: string
  }
}

export function FeatureDetails({ feature }: FeatureDetailsProps) {
  const getDetailsContent = (type: string) => {
    const content = {
      community: {
        title: "What You'll Get",
        items: [
          { icon: Users, text: "Access to exclusive community discussions" },
          { icon: BookOpen, text: "Weekly live Q&A sessions with experts" },
          { icon: Target, text: "Networking opportunities with like-minded members" },
          { icon: CheckCircle, text: "Premium resources and templates" },
        ],
      },
      course: {
        title: "What You'll Learn",
        items: [
          { icon: BookOpen, text: "Comprehensive video lessons and tutorials" },
          { icon: Target, text: "Hands-on projects and assignments" },
          { icon: CheckCircle, text: "Certificate of completion" },
          { icon: Users, text: "Lifetime access to course materials" },
        ],
      },
      challenge: {
        title: "Challenge Details",
        items: [
          { icon: Target, text: "Daily actionable tasks and milestones" },
          { icon: Users, text: "Community support and accountability" },
          { icon: CheckCircle, text: "Progress tracking and feedback" },
          { icon: Calendar, text: "Completion rewards and recognition" },
        ],
      },
      event: {
        title: "Event Highlights",
        items: [
          { icon: Calendar, text: "Live interactive sessions with experts" },
          { icon: Users, text: "Networking with industry professionals" },
          { icon: BookOpen, text: "Exclusive event materials and resources" },
          { icon: CheckCircle, text: "Recording access for registered attendees" },
        ],
      },
      oneToOne: {
        title: "Session Includes",
        items: [
          { icon: Clock, text: "Personalized one-on-one consultation" },
          { icon: Target, text: "Customized strategy and action plan" },
          { icon: BookOpen, text: "Follow-up resources and materials" },
          { icon: CheckCircle, text: "Email support for 7 days after session" },
        ],
      },
    }
    return content[type as keyof typeof content] || content.community
  }

  const details = getDetailsContent(feature.type)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 md:py-16">
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 text-balance">
          {details.title}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
          Everything you need to succeed is included in this {feature.type}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {details.items.map((item, index) => {
          const IconComponent = item.icon
          return (
            <Card
              key={index}
              className="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-2xl"
            >
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-xl flex-shrink-0">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 leading-relaxed text-pretty">
                      {item.text}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-12 sm:mt-14 md:mt-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-purple-100">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 text-balance">
              Why Choose This {feature.type.charAt(0).toUpperCase() + feature.type.slice(1)}?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-pretty mb-4 sm:mb-6">
              Join thousands of satisfied members who have transformed their skills and achieved their goals. Our proven
              methodology and expert guidance ensure you get the results you're looking for.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Expert-led content</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Proven results</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Community support</span>
              </div>
            </div>
          </div>
          <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border-2 sm:border-4 border-white">
            <Image
              src={`/.jpg?key=mc8zb&height=400&width=600&query=${feature.type} preview content demonstration`}
              alt={`${feature.name} preview`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
