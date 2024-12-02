import { Card, CardContent, CardHeader } from '@hexa/ui/card';

export function DomainCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Domain icon skeleton */}
          <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />

          <div className="space-y-2">
            {/* Domain name skeleton */}
            <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
            {/* Status text skeleton */}
            <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Status badge skeleton */}
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />

          {/* Action button skeleton */}
          <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Verification button skeleton */}
          <div className="h-9 w-full animate-pulse rounded-md bg-muted" />

          {/* DNS records skeleton */}
          <div className="space-y-4 rounded-lg border p-4">
            {/* Title skeleton */}
            <div className="h-5 w-40 animate-pulse rounded-md bg-muted" />

            {/* Description skeleton */}
            <div className="h-4 w-60 animate-pulse rounded-md bg-muted" />

            {/* Record fields skeleton */}
            <div className="space-y-4">
              {/* CNAME record */}
              <div className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
                <div className="flex items-center space-x-2">
                  <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
                  <div className="h-9 w-9 animate-pulse rounded-md bg-muted" />
                </div>
              </div>

              {/* TXT record */}
              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />
                <div className="flex items-center space-x-2">
                  <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
                  <div className="h-9 w-9 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// List skeleton component for multiple cards
export function DomainListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <DomainCardSkeleton key={i} />
      ))}
    </div>
  );
}
