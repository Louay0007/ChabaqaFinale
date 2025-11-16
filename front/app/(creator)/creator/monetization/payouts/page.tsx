'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, Plus, MoreHorizontal, CheckCircle, Clock, BanknoteIcon, ArrowDownIcon, ArrowUpIcon } from "lucide-react"
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock payout data
const initialPayouts = [
  {
    id: "payout_1",
    date: "2024-06-28",
    amount: "$1,245.50",
    status: "completed",
    method: "Bank Transfer",
    reference: "REF-28062024-001",
    items: 32,
  },
  {
    id: "payout_2",
    date: "2024-05-30",
    amount: "$987.25",
    status: "completed",
    method: "PayPal",
    reference: "REF-30052024-001",
    items: 27,
  },
  {
    id: "payout_3",
    date: "2024-04-29",
    amount: "$1,102.75",
    status: "completed",
    method: "Bank Transfer",
    reference: "REF-29042024-001",
    items: 30,
  },
  {
    id: "payout_4",
    date: "2024-07-15",
    amount: "$1,350.00",
    status: "scheduled",
    method: "Bank Transfer",
    reference: "REF-15072024-001",
    items: 35,
  },
  {
    id: "payout_5",
    date: "2024-03-31",
    amount: "$856.50",
    status: "completed",
    method: "PayPal",
    reference: "REF-31032024-001",
    items: 22,
  },
]

// Stats data
const payoutStats = [
  {
    title: "Available Balance",
    value: "$2,450.75",
    change: { value: "+$1,350.25", trend: "up" },
    description: "Ready for payout"
  },
  {
    title: "Next Payout",
    value: "$1,350.00",
    change: { value: "July 15", trend: "neutral" },
    description: "Scheduled payout"
  },
  {
    title: "Total Paid Out",
    value: "$4,192.00",
    change: { value: "+18%", trend: "up" },
    description: "Last 6 months"
  },
  {
    title: "Avg. Monthly Payout",
    value: "$1,048.00",
    change: { value: "+12%", trend: "up" },
    description: "Based on last 4 months"
  },
]

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState(initialPayouts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [newPayout, setNewPayout] = useState({
    amount: "",
    method: "bank_transfer"
  });
  
  // Filter payouts based on search query and active tab
  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = 
      payout.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.method.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && payout.status === activeTab;
  });
  
  // Handle export
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your payout data is being exported to CSV",
    });
  };
  
  // Handle requesting a new payout
  const handleRequestPayout = () => {
    if (!newPayout.amount) {
      toast({
        title: "Missing Information",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Payout Requested",
      description: `Your payout request for ${newPayout.amount} has been submitted`,
    });
    
    // Add new payout to the list
    const newPayoutObj = {
      id: `payout_${payouts.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      amount: `$${newPayout.amount}`,
      status: "scheduled",
      method: newPayout.method === "bank_transfer" ? "Bank Transfer" : "PayPal",
      reference: `REF-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${payouts.length + 1}`,
      items: Math.floor(Math.random() * 20) + 5,
    };
    
    setPayouts([newPayoutObj, ...payouts]);
    setNewPayout({ amount: "", method: "bank_transfer" });
    setShowPayoutDialog(false);
  };
  
  // Handle payout actions
  const handlePayoutAction = (action, payout) => {
    switch(action) {
      case "view":
        toast({
          title: "Viewing Details",
          description: `Viewing details for payout ${payout.reference}`,
        });
        break;
      case "download":
        toast({
          title: "Download Started",
          description: `Downloading receipt for payout ${payout.reference}`,
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
          <h1 className="text-3xl font-bold text-gray-900">Payouts</h1>
          <p className="text-gray-600 mt-1">Manage your earnings and payment methods</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Request Payout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request a Payout</DialogTitle>
                <DialogDescription>
                  Enter the amount you'd like to withdraw and select your preferred payment method.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="payout-amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="payout-amount"
                    value={newPayout.amount}
                    onChange={(e) => setNewPayout({...newPayout, amount: e.target.value})}
                    className="col-span-3"
                    placeholder="e.g. 500.00"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="payout-method" className="text-right">
                    Method
                  </Label>
                  <Select 
                    value={newPayout.method} 
                    onValueChange={(value) => setNewPayout({...newPayout, method: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPayoutDialog(false)}>Cancel</Button>
                <Button onClick={handleRequestPayout}>Request Payout</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {payoutStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-1.5">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-3xl font-bold">{stat.value}</h2>
                  <div className={`flex items-center text-xs font-medium ${
                    stat.change.trend === "up" ? "text-green-600" : 
                    stat.change.trend === "down" ? "text-red-600" : 
                    "text-gray-500"
                  }`}>
                    {stat.change.trend === "up" ? "↑" : 
                     stat.change.trend === "down" ? "↓" : 
                     "•"} {stat.change.value}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your payout methods and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 border-primary">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <BanknoteIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Bank Account (Default)</h3>
                      <p className="text-sm text-muted-foreground">**** **** **** 4832</p>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 4H16.5C17.3284 4 18 4.67157 18 5.5V18.5C18 19.3284 17.3284 20 16.5 20H7.5C6.67157 20 6 19.3284 6 18.5V5.5C6 4.67157 6.67157 4 7.5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">PayPal</h3>
                      <p className="text-sm text-muted-foreground">creator@example.com</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">Set as Default</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-dashed border-2 md:col-span-2">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-32">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Payment Method
                </Button>
                <p className="text-sm text-muted-foreground mt-2">Add a bank account, PayPal, or other payment method</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Payout History</CardTitle>
          <CardDescription>
            View all your past and upcoming payouts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">All Payouts</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search payouts..."
                    className="pl-8 w-full sm:w-[240px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    toast({
                      title: "Filter Applied",
                      description: "Payout list has been filtered",
                    });
                  }}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>{payout.date}</TableCell>
                        <TableCell className="font-medium">{payout.amount}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={payout.status === "completed" ? "default" : "outline"}
                            className="flex items-center gap-1 w-fit"
                          >
                            {payout.status === "completed" ? 
                              <CheckCircle className="h-3 w-3" /> : 
                              <Clock className="h-3 w-3" />
                            }
                            <span className="capitalize">{payout.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{payout.method}</TableCell>
                        <TableCell className="font-mono text-xs">{payout.reference}</TableCell>
                        <TableCell>{payout.items} items</TableCell>
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
                              <DropdownMenuItem>Download receipt</DropdownMenuItem>
                              {payout.status === "scheduled" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">Cancel payout</DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts
                      .filter(payout => payout.status === "completed")
                      .map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell>{payout.date}</TableCell>
                          <TableCell className="font-medium">{payout.amount}</TableCell>
                          <TableCell>
                            <Badge className="flex items-center gap-1 w-fit">
                              <CheckCircle className="h-3 w-3" />
                              <span>Completed</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{payout.method}</TableCell>
                          <TableCell className="font-mono text-xs">{payout.reference}</TableCell>
                          <TableCell>{payout.items} items</TableCell>
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
                                <DropdownMenuItem onClick={() => handlePayoutAction("view", payout)}>View details</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePayoutAction("download", payout)}>Download receipt</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="scheduled" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts
                      .filter(payout => payout.status === "scheduled")
                      .map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell>{payout.date}</TableCell>
                          <TableCell className="font-medium">{payout.amount}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                              <Clock className="h-3 w-3" />
                              <span>Scheduled</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{payout.method}</TableCell>
                          <TableCell className="font-mono text-xs">{payout.reference}</TableCell>
                          <TableCell>{payout.items} items</TableCell>
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
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Cancel payout</DropdownMenuItem>
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
            Showing <strong>5</strong> of <strong>12</strong> payouts
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