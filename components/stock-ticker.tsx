"use client"

import { useMarketData } from "@/hooks/use-market-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function StockTicker() {
  const { stocks, isLoading, error, refreshMarketData } = useMarketData()

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-500">Error loading market data: {error}</p>
            <button onClick={refreshMarketData} className="flex items-center text-sm text-primary">
              <RefreshCw className="mr-1 h-3 w-3" /> Retry
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex overflow-x-auto py-2 scrollbar-hide">
            <div className="flex space-x-8 whitespace-nowrap">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-16 mb-2" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex overflow-x-auto py-2 scrollbar-hide">
          <div className="flex animate-marquee space-x-8 whitespace-nowrap">
            {stocks.map((stock, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-sm font-medium">{stock.symbol}</div>
                <div className="text-base font-bold">{stock.price.toFixed(2)}</div>
                <div className="flex items-center gap-1">
                  {stock.change >= 0 ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100/80">
                      <ArrowUp className="mr-1 h-3 w-3" />
                      {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100/80">
                      <ArrowDown className="mr-1 h-3 w-3" />
                      {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
