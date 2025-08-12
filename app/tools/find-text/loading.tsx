import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function FindTextLoading() {
  return (
    <div className="min-h-screen py-20 px-4 cyber-grid">
      <div className="container mx-auto max-w-md">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Skeleton className="h-16 w-16 rounded-full mr-4" />
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>

        <Card className="neon-border neural-network">
          <CardHeader className="text-center">
            <Skeleton className="h-8 w-48 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <Skeleton className="h-12 w-full" />

            <div className="text-center">
              <Skeleton className="h-6 w-48 mx-auto mb-2" />
              <Skeleton className="h-8 w-40 mx-auto" />
            </div>

            <div className="text-center space-y-1">
              <Skeleton className="h-3 w-56 mx-auto" />
              <Skeleton className="h-3 w-48 mx-auto" />
              <Skeleton className="h-3 w-40 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
