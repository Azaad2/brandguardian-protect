import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle, Mail, Search, Eye } from "lucide-react";

interface EmailRoutingLog {
  id: string;
  created_at: string;
  email_type: string;
  thread_id: string | null;
  sender_email: string | null;
  recipient_email: string | null;
  subject: string | null;
  content_preview: string | null;
  full_content: string | null;
  error_message: string | null;
  status: string;
  admin_notes: string | null;
}

export function EmailRoutingLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMessageDialog, setViewMessageDialog] = useState<EmailRoutingLog | null>(null);

  const { data: logs, isLoading, error, refetch } = useQuery({
    queryKey: ['email-routing-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_routing_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as EmailRoutingLog[];
    },
  });

  const filteredLogs = logs?.filter(log => {
    const matchesSearch = !searchTerm || 
      log.sender_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recipient_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.thread_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const matchesType = typeFilter === "all" || log.email_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Processed</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'webhook_success':
        return <Badge className="bg-green-100 text-green-800">Webhook Success</Badge>;
      case 'webhook_failure':
        return <Badge className="bg-red-100 text-red-800">Webhook Failure</Badge>;
      case 'manual_import':
        return <Badge className="bg-blue-100 text-blue-800">Manual Import</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Routing Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Error Loading Email Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Failed to load email routing logs: {error.message}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Routing Logs
        </CardTitle>
        
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search emails, subjects, threads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="webhook_success">Success</SelectItem>
              <SelectItem value="webhook_failure">Failure</SelectItem>
              <SelectItem value="manual_import">Manual</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[600px]">
          {filteredLogs?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No email routing logs found</p>
              {(searchTerm || statusFilter !== "all" || typeFilter !== "all") && (
                <p className="text-sm mt-2">Try adjusting your filters</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs?.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getTypeBadge(log.email_type)}
                        {getStatusBadge(log.status)}
                        {log.thread_id && (
                          <Badge variant="outline" className="font-mono text-xs">
                            {log.thread_id}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">From:</p>
                      <p className="font-mono">{log.sender_email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">To:</p>
                      <p className="font-mono">{log.recipient_email || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {log.subject && (
                    <div>
                      <p className="font-medium text-muted-foreground text-sm">Subject:</p>
                      <p className="text-sm">{log.subject}</p>
                    </div>
                  )}
                  
                  {log.content_preview && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-muted-foreground text-sm">Content Preview:</p>
                        {log.full_content && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setViewMessageDialog(log)}
                            className="h-7 text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Full Message
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded break-words whitespace-pre-wrap">
                        {log.content_preview}
                      </p>
                    </div>
                  )}
                  
                  {log.error_message && (
                    <div>
                      <p className="font-medium text-destructive text-sm">Error:</p>
                      <p className="text-sm text-destructive bg-destructive/10 p-2 rounded break-words whitespace-pre-wrap">
                        {log.error_message}
                      </p>
                    </div>
                  )}
                  
                  {log.admin_notes && (
                    <div>
                      <p className="font-medium text-muted-foreground text-sm">Admin Notes:</p>
                      <p className="text-sm bg-blue-50 p-2 rounded">{log.admin_notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {/* Full Message Dialog */}
      <Dialog open={!!viewMessageDialog} onOpenChange={() => setViewMessageDialog(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Full Email Message
            </DialogTitle>
          </DialogHeader>
          
          {viewMessageDialog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm pb-4 border-b">
                <div>
                  <p className="font-medium text-muted-foreground">From:</p>
                  <p className="font-mono break-words">{viewMessageDialog.sender_email}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">To:</p>
                  <p className="font-mono break-words">{viewMessageDialog.recipient_email}</p>
                </div>
                {viewMessageDialog.subject && (
                  <div className="col-span-2">
                    <p className="font-medium text-muted-foreground">Subject:</p>
                    <p className="break-words">{viewMessageDialog.subject}</p>
                  </div>
                )}
                {viewMessageDialog.thread_id && (
                  <div className="col-span-2">
                    <p className="font-medium text-muted-foreground">Thread ID:</p>
                    <p className="font-mono text-xs break-words">{viewMessageDialog.thread_id}</p>
                  </div>
                )}
              </div>
              
              <ScrollArea className="h-[400px] w-full rounded border p-4">
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">Full Content:</p>
                  <pre className="text-sm whitespace-pre-wrap break-words font-sans">
                    {viewMessageDialog.full_content || viewMessageDialog.content_preview || 'No content available'}
                  </pre>
                </div>
              </ScrollArea>
              
              {viewMessageDialog.error_message && (
                <div className="bg-destructive/10 p-4 rounded">
                  <p className="font-medium text-destructive text-sm mb-2">Error Message:</p>
                  <p className="text-sm text-destructive break-words whitespace-pre-wrap">
                    {viewMessageDialog.error_message}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}