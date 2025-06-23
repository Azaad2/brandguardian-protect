
import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-600">✓ Approved</Badge>;
    case 'pending':
      return <Badge className="bg-amber-600">⏳ Pending</Badge>;
    case 'rejected':
      return <Badge variant="destructive">✗ Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
