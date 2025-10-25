"use client";

import { useState } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Search,
    Users,
    DollarSign,
    Eye,
  } from "lucide-react";
  
import Link from "next/link";

import UpcomingSessionsCard from "./upcoming-sessions-card";
import PendingRequestsCard from "./pending-requests-card";
import MonthlyStatsCard from "./monthly-stats-card";

export default function ClientSessionsView({ allSessions, allBookings }: { allSessions: any[]; allBookings: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredSessions = allSessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "active") return matchesSearch && session.isActive;
    if (activeTab === "inactive") return matchesSearch && !session.isActive;
    return matchesSearch;
  });

  const stats = [
    {
      title: "Total Sessions",
      value: allSessions.length,
      change: { value: "+2", trend: "up" as const }, // <-- here
      icon: Calendar,
      color: "sessions" as const,
    },
    {
      title: "Active Sessions",
      value: allSessions.filter((s) => s.isActive).length,
      change: { value: "+1", trend: "up" as const },
      icon: Eye,
      color: "success" as const,
    },
    {
      title: "Total Bookings",
      value: allBookings.length,
      change: { value: "+3", trend: "up" as const },
      icon: Users,
      color: "primary" as const,
    },
    {
      title: "Session Revenue",
      value: "$2,880",
      change: { value: "+25%", trend: "up" as const },
      icon: DollarSign,
      color: "success" as const,
    },
  ];
  

  return (
    <div className="space-y-8 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text-sessions">Session Manager</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your 1-on-1 mentoring sessions</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm"><Search className="h-4 w-4 mr-2" /> Filters</Button>
          <Button size="sm" className="bg-sessions-500 hover:bg-sessions-600" asChild>
            <Link href="/creator/sessions/new"><Search className="h-4 w-4 mr-2" /> Create Session</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <MetricCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search sessions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Sessions ({allSessions.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({allSessions.filter((s) => s.isActive).length})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({allSessions.filter((s) => !s.isActive).length})</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                        <div
                        key={session.id}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow hover:shadow-md transition"
                        >
                        <h4 className="text-lg font-semibold">{session.title}</h4>
                        <p className="text-sm text-zinc-500 mt-1">{session.description}</p>
                        <div className="mt-3 flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                            <span>{session.date}</span>
                            <span>{session.duration}</span>
                        </div>
                        </div>
                    ))
                    ) : (
                    <p className="text-zinc-500 dark:text-zinc-400 col-span-full">
                        No sessions found.
                    </p>
                    )}
                </div>
                </TabsContent>

          </Tabs>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <UpcomingSessionsCard bookings={allBookings} />
          <PendingRequestsCard bookings={allBookings} />
          <MonthlyStatsCard />
        </div>
      </div>
    </div>
  );
}