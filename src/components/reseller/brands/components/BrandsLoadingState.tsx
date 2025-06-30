
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BrandsLoadingState = () => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {Array(6).fill(0).map((_, i) => (
        <Card key={i} className="h-80 animate-pulse">
          <CardHeader className="pb-4">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-5 w-full mb-3" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BrandsLoadingState;
