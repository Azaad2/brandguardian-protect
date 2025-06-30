
import { Check, Clock, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const getStatusIcon = (status: string | null) => {
  switch (status) {
    case 'approved':
      return <Check className="h-4 w-4 text-green-600" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-amber-600" />;
    case 'rejected':
      return <X className="h-4 w-4 text-red-600" />;
    default:
      return null;
  }
};

export const getStatusBadge = (status: string | null) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-600 text-white font-medium">✓ Approved</Badge>;
    case 'pending':
      return <Badge className="bg-amber-600 text-white font-medium">⏳ Applied</Badge>;
    case 'rejected':
      return <Badge variant="destructive" className="font-medium">✗ Rejected</Badge>;
    default:
      return null;
  }
};
