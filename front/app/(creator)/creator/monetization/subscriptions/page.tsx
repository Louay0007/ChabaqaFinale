'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, Plus, MoreHorizontal, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock subscription data
const initialSubscriptions = [
  {
    id: "sub_1",
    customer: "John Smith",
    email: "john.smith@example.com",
    plan: "Pro Plan",
    amount: "$29.99",
    status: "active",
    nextBilling: "2024-07-15",
    startDate: "2024-01-15",
  },
  {
    id: "sub_2",
    customer: "Sarah Johnson",
    email: "sarah.j@example.com",
    plan: "Basic Plan",
    amount: "$9.99",
    status: "active",
    nextBilling: "2024-07-10",
    startDate: "2023-12-10",
  },
  {
    id: "sub_3",
    customer: "Michael Brown",
    email: "michael.b@example.com",
    plan: "Premium Plan",
    amount: "$49.99",
    status: "active",
    nextBilling: "2024-07-22",
    startDate: "2024-02-22",
  },
  {
    id: "sub_4",
    customer: "Emily Davis",
    email: "emily.d@example.com",
    plan: "Pro Plan",
    amount: "$29.99",
    status: "canceled",
    nextBilling: "N/A",
    startDate: "2023-11-05",
  },
  {
    id: "sub_5",
    customer: "David Wilson",
    email: "david.w@example.com",
    plan: "Basic Plan",
    amount: "$9.99",
    status: "past_due",
    nextBilling: "2024-07-03",
    startDate: "2024-01-03",
  },
]

// Stats data
const subscriptionStats = [
  {
    title: "Active Subscriptions",
    value: "32",
    change: { value: "+12%", trend: "up" },
    description: "Total active subscriptions"
  },
  {
    title: "Monthly Revenue",
    value: "$1,245",
    change: { value: "+18%", trend: "up" },
    description: "Recurring monthly revenue"
  },
  {
    title: "Avg. Subscription Value",
    value: "$38.90",
    change: { value: "+5%", trend: "up" },
    description: "Average subscription amount"
  },
  {
    title: "Churn Rate",
    value: "3.2%",
    change: { value: "-0.8%", trend: "down" },
    description: "Monthly subscription cancellations"
  },
]

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showNewPlanDialog, setShowNewPlanDialog] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: "",
    description: ""
  });
  
  // Filter subscriptions based on search query and active tab
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = 
      sub.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.plan.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && sub.status === activeTab;
  });
  
  // Handle export
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your subscription data is being exported to CSV",
    });
  };
  
  // Handle creating a new plan
  const handleCreatePlan = () => {
    if (!newPlan.name || !newPlan.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Plan Created",
      description: `New plan "${newPlan.name}" has been created successfully`,
    });
    
    setNewPlan({ name: "", price: "", description: "" });
    setShowNewPlanDialog(false);
  };
  
  // Handle subscription actions
  const handleSubscriptionAction = (action, subscription) => {
    switch(action) {
      case "view":
        toast({
          title: "Viewing Details",
          description: `Viewing details for ${subscription.customer}'s subscription`,
        });
        break;
      case "edit":
        toast({
          title: "Edit Mode",
          description: `Editing ${subscription.customer}'s subscription`,
        });
        break;
      case "cancel":
        const updatedSubscriptions = subscriptions.map(sub => 
          sub.id === subscription.id ? {...sub, status: "canceled", nextBilling: "N/A"} : sub
        );
        setSubscriptions(updatedSubscriptions);
        toast({
          title: "Subscription Canceled",
          description: `${subscription.customer}'s subscription has been canceled`,
        });
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-600 mt-1">Manage your recurring subscription plans and subscribers</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showNewPlanDialog} onOpenChange={setShowNewPlanDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Subscription Plan</DialogTitle>
                <DialogDescription>
                  Add a new subscription plan to offer to your customers.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="plan-name" className="text-right">
                    Plan Name
                  </Label>
                  <Input
                    id="plan-name"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                    className="col-span-3"
                    placeholder="e.g. Pro Plan"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="plan-price" className="text-right">
                    Price
                  </Label>
                  <Input
                    id="plan-price"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                    className="col-span-3"
                    placeholder="e.g. 29.99"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="plan-description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="plan-description"
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                    className="col-span-3"
                    placeholder="Describe the features of this plan"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewPlanDialog(false)}>Cancel</Button>
                <Button onClick={handleCreatePlan}>Create Plan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,186</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,860</div>
            <p className="text-xs text-muted-foreground">+14% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Subscription Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$21.42</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Management */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>Manage your subscribers and subscription plans</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="past_due">Past Due</TabsTrigger>
                <TabsTrigger value="canceled">Canceled</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search subscriptions..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Filter Applied",
                      description: "Subscription list has been filtered",
                    });
                  }}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Billing</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{subscription.customer}</div>
                            <div className="text-sm text-muted-foreground">{subscription.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{subscription.plan}</TableCell>
                        <TableCell>{subscription.amount}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              subscription.status === "active" ? "default" : 
                              subscription.status === "past_due" ? "destructive" : 
                              "outline"
                            }
                            className="flex items-center gap-1 w-fit"
                          >
                            {subscription.status === "active" && <CheckCircle className="h-3 w-3" />}
                            {subscription.status === "past_due" && <AlertCircle className="h-3 w-3" />}
                            {subscription.status === "canceled" && <Clock className="h-3 w-3" />}
                            <span className="capitalize">{subscription.status.replace("_", " ")}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{subscription.nextBilling}</TableCell>
                        <TableCell>{subscription.startDate}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleSubscriptionAction("view", subscription)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSubscriptionAction("edit", subscription)}>Edit Subscription</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleSubscriptionAction("cancel", subscription)} className="text-red-600">Cancel Subscription</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="active" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Billing</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions
                      .filter(sub => sub.status === "active")
                      .map((subscription) => (
                        <TableRow key={subscription.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{subscription.customer}</div>
                              <div className="text-sm text-muted-foreground">{subscription.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{subscription.plan}</TableCell>
                          <TableCell>{subscription.amount}</TableCell>
                          <TableCell>
                            <Badge className="flex items-center gap-1 w-fit">
                              <CheckCircle className="h-3 w-3" />
                              <span>Active</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{subscription.nextBilling}</TableCell>
                          <TableCell>{subscription.startDate}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View details</DropdownMenuItem>
                                <DropdownMenuItem>Edit subscription</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Cancel subscription</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Similar content for past_due and canceled tabs */}
            <TabsContent value="past_due" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Billing</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions
                      .filter(sub => sub.status === "past_due")
                      .map((subscription) => (
                        <TableRow key={subscription.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{subscription.customer}</div>
                              <div className="text-sm text-muted-foreground">{subscription.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{subscription.plan}</TableCell>
                          <TableCell>{subscription.amount}</TableCell>
                          <TableCell>
                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                              <AlertCircle className="h-3 w-3" />
                              <span>Past Due</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{subscription.nextBilling}</TableCell>
                          <TableCell>{subscription.startDate}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View details</DropdownMenuItem>
                                <DropdownMenuItem>Send reminder</DropdownMenuItem>
                                <DropdownMenuItem>Update payment method</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Cancel subscription</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="canceled" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Billing</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions
                      .filter(sub => sub.status === "canceled")
                      .map((subscription) => (
                        <TableRow key={subscription.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{subscription.customer}</div>
                              <div className="text-sm text-muted-foreground">{subscription.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{subscription.plan}</TableCell>
                          <TableCell>{subscription.amount}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                              <Clock className="h-3 w-3" />
                              <span>Canceled</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{subscription.nextBilling}</TableCell>
                          <TableCell>{subscription.startDate}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View details</DropdownMenuItem>
                                <DropdownMenuItem>Reactivate subscription</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <strong>5</strong> of <strong>32</strong> subscriptions
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled
              onClick={() => {
                toast({
                  title: "Previous Page",
                  description: "Navigating to previous page",
                });
              }}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Next Page",
                  description: "Navigating to next page",
                });
              }}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}