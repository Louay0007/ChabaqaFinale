"use client"

import { cn } from "@/lib/utils"

const navItems = [
  { id: "communities", label: "Communities", color: "from-blue-500 to-blue-600" },
  { id: "courses", label: "Courses", color: "from-[#47c7ea] to-[#0891b2]" },
  { id: "challenges", label: "Challenges", color: "from-[#ff9b28] to-[#ea580c]" },
  { id: "events", label: "Events", color: "from-indigo-500 to-indigo-600" },
  { id: "sessions", label: "One-on-One", color: "from-[#f65887] to-[#ec4899]" },
]

interface CreatorNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function CreatorNav({ activeTab, onTabChange }: CreatorNavProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-3 sm:py-4 scrollbar-hide justify-start sm:justify-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 sm:px-4 md:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 min-h-[44px] flex items-center touch-manipulation flex-shrink-0",
                activeTab === item.id
                  ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-gray-50",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
