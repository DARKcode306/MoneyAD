import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { User, InvestmentPackage, UserInvestment } from "@shared/schema"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"

interface InvestmentPageProps {
  user: User
  onNavigateToWallet: () => void
}

export default function InvestmentPage({ user, onNavigateToWallet }: InvestmentPageProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState("own")

  const { data: ownPackages } = useQuery<{ packages: InvestmentPackage[] }>({
    queryKey: ["/api/investments", "own"],
    queryFn: () => apiRequest("GET", "/api/investments?type=own")
  })

  const { data: pointsPackages } = useQuery<{ packages: InvestmentPackage[] }>({
    queryKey: ["/api/investments", "points"],
    queryFn: () => apiRequest("GET", "/api/investments?type=points")
  })

  const { data: userInvestments } = useQuery<{ investments: (UserInvestment & { package: InvestmentPackage })[] }>({
    queryKey: ["/api/user", user.id, "investments"],
    queryFn: () => apiRequest("GET", `/api/user/${user.id}/investments`)
  })

  const subscribeMutation = useMutation({
    mutationFn: (packageId: number) => apiRequest("POST", "/api/investments/subscribe", {
      userId: user.id,
      packageId
    }),
    onSuccess: (data) => {
      if (data.redirectToDeposit) {
        toast("Please deposit money first")
        onNavigateToWallet()
      } else {
        toast("Successfully subscribed to investment package!")
        queryClient.invalidateQueries({ queryKey: ["/api/user"] })
        queryClient.invalidateQueries({ queryKey: ["/api/user", user.id, "investments"] })
      }
    },
    onError: (error: any) => {
      toast(error.message || "Failed to subscribe", "error")
    }
  })

  const completeTask = useMutation({
    mutationFn: (investmentId: number) => apiRequest("POST", "/api/investments/complete-task", {
      userId: user.id,
      investmentId
    }),
    onSuccess: (data) => {
      toast(`Task completed! Earned ${data.reward} ${data.currency}`)
      queryClient.invalidateQueries({ queryKey: ["/api/user"] })
      queryClient.invalidateQueries({ queryKey: ["/api/user", user.id, "investments"] })
    },
    onError: (error: any) => {
      toast(error.message || "Failed to complete task", "error")
    }
  })

  const handleSubscribe = (package_: InvestmentPackage) => {
    if (package_.type === "points") {
      if (user.points < package_.price) {
        toast("Insufficient points balance", "error")
        return
      }
    }
    subscribeMutation.mutate(package_.id)
  }

  const isPackageSubscribed = (packageId: number) => {
    return userInvestments?.investments.some(inv => 
      inv.packageId === packageId && inv.isActive && new Date(inv.endDate) > new Date()
    ) || false
  }

  const canCompleteTask = (investment: UserInvestment & { package: InvestmentPackage }) => {
    const today = new Date().toISOString().split('T')[0]
    const lastTaskDate = investment.lastTaskDate ? new Date(investment.lastTaskDate).toISOString().split('T')[0] : null
    return lastTaskDate !== today
  }

  const PackageCard = ({ package_: pkg, type }: { package_: InvestmentPackage, type: string }) => {
    const isSubscribed = isPackageSubscribed(pkg.id)
    
    return (
      <Card className="relative">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{pkg.title}</CardTitle>
            {isSubscribed && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Price:</span>
              <p className="font-semibold">
                {type === "own" ? formatCurrency(pkg.price, "usd") : `${pkg.price.toLocaleString()} Points`}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <p className="font-semibold">{pkg.numberOfDays} days</p>
            </div>
            <div>
              <span className="text-gray-600">Reward per task:</span>
              <p className="font-semibold">
                {pkg.rewardPerTask} {pkg.rewardCurrency === "usd" ? "$" : "£"}
              </p>
            </div>
          </div>
          
          {!isSubscribed ? (
            <Button 
              onClick={() => handleSubscribe(pkg)}
              disabled={subscribeMutation.isPending}
              className="w-full"
            >
              {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
            </Button>
          ) : (
            <div className="text-center text-sm text-green-600 font-medium">
              ✅ Subscribed
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Investment Packages 💰</h2>
        <p className="text-gray-600">Choose an investment plan and earn daily rewards!</p>
      </div>

      {/* Balance Display - Changes based on active tab */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-4">
          {activeTab === "points" ? (
            // Points Investment Tab - Show only USD and EGP investment balances
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Investment USD</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(user.investmentUsdBalance || 0, "usd")}</p>
                <p className="text-xs text-gray-500">For Points Investment</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Investment EGP</p>
                <p className="text-lg font-bold text-purple-600">{formatCurrency(user.investmentEgpBalance || 0, "egp")}</p>
                <p className="text-xs text-gray-500">For Points Investment</p>
              </div>
            </div>
          ) : (
            // Own Investment Tab - Show main wallet balances
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Main USD</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(user.usdBalance, "usd")}</p>
                <p className="text-xs text-gray-500">Main Wallet</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Main EGP</p>
                <p className="text-lg font-bold text-purple-600">{formatCurrency(user.egpBalance, "egp")}</p>
                <p className="text-xs text-gray-500">Main Wallet</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Investments */}
      {userInvestments?.investments && userInvestments.investments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Active Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userInvestments.investments
                .filter(inv => inv.isActive && new Date(inv.endDate) > new Date())
                .map((investment) => (
                  <div key={investment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{investment.package.title}</h4>
                      <p className="text-sm text-gray-600">
                        Ends: {new Date(investment.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Reward: {investment.package.rewardPerTask} {investment.package.rewardCurrency === "usd" ? "$" : "£"} per task
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => completeTask.mutate(investment.id)}
                      disabled={!canCompleteTask(investment) || completeTask.isPending}
                    >
                      {canCompleteTask(investment) ? "Complete Task" : "Task Done Today"}
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Investment Packages */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="own">Own Investment</TabsTrigger>
          <TabsTrigger value="points">Points Investment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="own" className="space-y-4">
          <div className="text-center text-sm text-gray-600 mb-4">
            These packages require real money deposits
          </div>
          <div className="grid gap-4">
            {ownPackages?.packages.map((pkg) => (
              <PackageCard key={pkg.id} package_={pkg} type="own" />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="points" className="space-y-4">
          <div className="text-center text-sm text-gray-600 mb-4">
            These packages can be purchased with points
          </div>
          
          {/* Investment Balance Management */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-800 mb-3">Manage Investment Balance</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // This would typically open a modal or navigate to a deposit page
                    toast("Investment deposit feature coming soon!")
                  }}
                >
                  Add Investment Funds
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // This would typically open a modal for transferring to main balance
                    toast("Transfer feature coming soon!")
                  }}
                >
                  Transfer to Main
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4">
            {pointsPackages?.packages.map((pkg) => (
              <PackageCard key={pkg.id} package_={pkg} type="points" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}