"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

interface FeatureTestimonialsProps {
  feature: {
    name: string
  }
}

export function FeatureTestimonials({ feature }: FeatureTestimonialsProps) {
  const getAvatarPlaceholder = (name: string) => {
    return `/placeholder.svg?height=100&width=100&query=professional ${name.split(" ")[0]} avatar portrait`
  }

  const testimonials = [
    {
      name: "Michael Rodriguez",
      avatar: "/professional-man-avatar.png",
      role: "Marketing Manager",
      rating: 5,
      text: "This completely transformed how I approach my work. The insights and strategies are invaluable!",
    },
    {
      name: "Emily Watson",
      avatar: "/professional-woman-avatar.png",
      role: "Entrepreneur",
      rating: 5,
      text: "Best investment I've made in my professional development. Highly recommend to anyone serious about growth.",
    },
    {
      name: "David Kim",
      avatar: "/professional-man-avatar.png",
      role: "Designer",
      rating: 5,
      text: "The community support and expert guidance made all the difference. Exceeded my expectations!",
    },
  ]

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">What Members Are Saying</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            Join thousands of satisfied members who have achieved amazing results
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-2xl"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed text-pretty">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <Image
                    src={testimonial.avatar || getAvatarPlaceholder(testimonial.name)}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full ring-2 ring-purple-100"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
