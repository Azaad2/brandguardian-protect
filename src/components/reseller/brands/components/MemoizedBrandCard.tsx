import React from 'react';
import { OptimizedBrand } from '@/hooks/use-optimized-brands';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  Mail, 
  Clock, 
  TrendingUp, 
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare
} from "lucide-react";

interface MemoizedBrandCardProps {
  brand: OptimizedBrand;
  onApply: (brandId: string) => void;
  isApplying: boolean;
  canApply: boolean;
}

const MemoizedBrandCard: React.FC<MemoizedBrandCardProps> = React.memo(({
  brand,
  onApply,
  isApplying,
  canApply
}) => {
  const getStatusBadge = () => {
    if (!brand.application_status) {
      return <Badge variant="outline" className="bg-muted">Not Applied</Badge>;
    }
    
    switch (brand.application_status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{brand.application_status}</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (brand.application_status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const shouldShowFollowUpInfo = () => {
    return brand.application_status === 'pending' && brand.follow_up_count >= 0;
  };

  const canSendFollowUp = () => {
    if (brand.application_status !== 'pending') return false;
    if (brand.follow_up_count >= 3) return false;
    
    if (!brand.last_follow_up_at) return true;
    
    const lastFollowUp = new Date(brand.last_follow_up_at);
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    return lastFollowUp < threeDaysAgo;
  };

  const getTimeBasedInfo = () => {
    if (!brand.application_created_at) return null;
    
    const applicationDate = new Date(brand.application_created_at);
    const daysSinceApplication = Math.floor((Date.now() - applicationDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceApplication <= 7) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Recently Applied</Badge>;
    } else if (daysSinceApplication >= 14 && brand.application_status === 'pending') {
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Long Wait</Badge>;
    }
    
    return null;
  };

  const handleApply = () => {
    onApply(brand.id);
  };

  return (
    <Card className="h-80 flex flex-col transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate mb-1">{brand.name}</h3>
            {brand.department && (
              <p className="text-sm text-muted-foreground mb-2">{brand.department}</p>
            )}
          </div>
          {getStatusIcon()}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {getStatusBadge()}
          {getTimeBasedInfo()}
        </div>
        
        {brand.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{brand.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {brand.approval_rate && (
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>{Math.round(brand.approval_rate)}% approval rate</span>
            </div>
          )}
          
          {brand.response_time && (
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>~{brand.response_time}h response time</span>
            </div>
          )}
          
          {shouldShowFollowUpInfo() && (
            <div className="flex items-center gap-1 text-sm">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              <span>{brand.follow_up_count} follow-up{brand.follow_up_count !== 1 ? 's' : ''} sent</span>
            </div>
          )}
          
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="truncate">{brand.contact_email}</span>
          </div>
          
          {brand.website_url && (
            <div className="flex items-center gap-1 text-sm">
              <ExternalLink className="h-4 w-4 text-gray-500" />
              <a 
                href={brand.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {!brand.application_status ? (
            <Button 
              onClick={handleApply}
              disabled={!canApply || isApplying}
              className="flex-1"
              size="sm"
            >
              <Send className="h-4 w-4 mr-1" />
              Apply
            </Button>
          ) : brand.application_status === 'pending' && canSendFollowUp() ? (
            <Button 
              variant="outline"
              onClick={handleApply}
              disabled={isApplying}
              className="flex-1"
              size="sm"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Follow Up
            </Button>
          ) : (
            <Button variant="outline" disabled className="flex-1" size="sm">
              {brand.application_status === 'approved' && 'Approved'}
              {brand.application_status === 'rejected' && 'Rejected'}
              {brand.application_status === 'pending' && brand.follow_up_count >= 3 && 'Max Follow-ups'}
              {brand.application_status === 'pending' && brand.follow_up_count < 3 && !canSendFollowUp() && 'Wait 3 Days'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

MemoizedBrandCard.displayName = 'MemoizedBrandCard';

export { MemoizedBrandCard };