
import { Star } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedCard } from "@/components/ui/enhanced-card";

export default function MonthlyStatsCard() {
  return (
    <EnhancedCard>
      <CardHeader>
        <CardTitle className="text-lg">This Month</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Sessions Completed</span><span className="font-semibold">12</span></div>
        <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Hours Mentored</span><span className="font-semibold">18.5</span></div>
        <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Revenue Generated</span><span className="font-semibold text-green-600">$2,880</span></div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Avg Rating</span>
          <div className="flex items-center"><Star className="h-4 w-4 text-yellow-500 mr-1" /><span className="font-semibold">4.9</span></div>
        </div>
      </CardContent>
    </EnhancedCard>
  );
}