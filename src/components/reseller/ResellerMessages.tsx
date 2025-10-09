
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Mail, Users, Search, Filter, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { MessageDetailDialog } from "./messages/MessageDetailDialog";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  email_thread_id: string | null;
  message_source: string | null;
  brand_application_id: string | null;
  brand_application?: {
    brand: {
      name: string;
      logo_url: string | null;
    };
  };
  // Additional fields for dialog
  sender?: string;
  subject?: string;
  preview?: string;
  timestamp?: string;
  type?: string;
  status?: string;
  unread?: boolean;
  full_content?: string;
}

const ResellerMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();

  // Fetch messages with brand application details
  const { data: messages = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['reseller-messages', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          brand_application:brand_applications(
            brand:brands_directory(
              name,
              logo_url
            )
          )
        `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!user,
  });

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('reseller-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${user.id}`
      }, () => {
        console.log('New message received, refetching...');
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  const getMessageType = (message: Message) => {
    if (message.message_source === 'email_inbound') {
      return 'Brand Reply';
    } else if (message.brand_application_id) {
      return 'Application';
    }
    return 'Internal';
  };

  const getMessageIcon = (message: Message) => {
    if (message.message_source === 'email_inbound') {
      return <Mail className="h-4 w-4 text-blue-600" />;
    } else if (message.brand_application_id) {
      return <ExternalLink className="h-4 w-4 text-green-600" />;
    }
    return <MessageCircle className="h-4 w-4 text-gray-600" />;
  };

  const getTypeStyles = (message: Message) => {
    if (message.message_source === 'email_inbound') {
      return "bg-blue-100 text-blue-700";
    } else if (message.brand_application_id) {
      return "bg-green-100 text-green-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  const getSenderName = (message: Message) => {
    if (message.brand_application?.brand?.name) {
      return message.brand_application.brand.name;
    }
    return 'BndBox System';
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);
      refetch();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleOpenMessage = async (message: Message) => {
    const formattedMessage: any = {
      id: message.id,
      sender: getSenderName(message),
      subject: message.content.split('\n')[0] || 'No Subject',
      preview: message.content.substring(0, 150) + '...',
      timestamp: new Date(message.created_at).toLocaleString(),
      type: getMessageType(message),
      status: 'standard',
      unread: !message.is_read,
      full_content: message.content,
      sender_id: message.sender_id,
      recipient_id: message.recipient_id,
      brand_application_id: message.brand_application_id || null,
      email_thread_id: message.email_thread_id || null
    };
    setSelectedMessage(formattedMessage);
    setDialogOpen(true);
    if (!message.is_read) {
      await markAsRead(message.id);
    }
  };

  const filteredMessages = messages.filter(
    message => 
      getSenderName(message).toLowerCase().includes(searchTerm.toLowerCase()) || 
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const unreadMessages = messages.filter(message => !message.is_read);
  const applicationMessages = messages.filter(message => message.brand_application_id);
  const emailMessages = messages.filter(message => message.message_source === 'email_inbound');

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Communicate with your brand partners</p>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load messages'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const MessageCard = ({ message }: { message: Message }) => (
    <div
      key={message.id}
      className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:shadow-md transition-shadow ${
        !message.is_read ? 'bg-muted/50 border-blue-200' : ''
      }`}
      onClick={() => handleOpenMessage(message)}
    >
      <div className="flex-shrink-0">
        {message.brand_application?.brand?.logo_url ? (
          <img 
            src={message.brand_application.brand.logo_url} 
            alt="Brand logo"
            className="w-10 h-10 rounded object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
            {getMessageIcon(message)}
          </div>
        )}
      </div>
      
      <div className="flex-grow space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{getSenderName(message)}</span>
          {!message.is_read && (
            <Badge variant="secondary" className="text-xs">New</Badge>
          )}
          <Badge className={getTypeStyles(message)}>
            {getMessageType(message)}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {message.content.length > 150 ? message.content.substring(0, 150) + '...' : message.content}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {new Date(message.created_at).toLocaleString()}
          </span>
          {message.message_source === 'email_inbound' && (
            <Badge variant="outline" className="text-xs">
              Via Email
            </Badge>
          )}
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleOpenMessage(message);
        }}
      >
        View
      </Button>
    </div>
  );

  return (
    <>
      <MessageDetailDialog
        message={selectedMessage}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onMessageSent={refetch}
      />
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Real-time communication with your brand partners</p>
        </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{unreadMessages.length}</div>
                <p className="text-xs text-muted-foreground">New messages waiting</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Email Replies</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{emailMessages.length}</div>
                <p className="text-xs text-muted-foreground">Direct from brands</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {new Set(messages.map(m => m.brand_application?.brand?.name).filter(Boolean)).size}
                </div>
                <p className="text-xs text-muted-foreground">Different brands</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search messages..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Messages</TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadMessages.length})
          </TabsTrigger>
          <TabsTrigger value="applications">
            Applications ({applicationMessages.length})
          </TabsTrigger>
          <TabsTrigger value="email-replies">
            Brand Replies ({emailMessages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Messages</CardTitle>
              <CardDescription>Complete message history with real-time updates</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {filteredMessages.length > 0 ? (
                      filteredMessages.map((message) => (
                        <MessageCard key={message.id} message={message} />
                      ))
                    ) : (
                      <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                        <Mail className="mb-2 h-6 w-6 text-muted-foreground" />
                        <h3 className="text-lg font-medium">No messages found</h3>
                        <p className="text-sm text-muted-foreground">
                          {searchTerm ? "Try adjusting your search term" : "Messages from brands will appear here"}
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread">
          <Card>
            <CardHeader>
              <CardTitle>Unread Messages</CardTitle>
              <CardDescription>Messages that require your attention</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(2).fill(0).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {unreadMessages.length > 0 ? (
                      unreadMessages.filter(message => 
                        getSenderName(message).toLowerCase().includes(searchTerm.toLowerCase()) || 
                        message.content.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((message) => (
                        <MessageCard key={message.id} message={message} />
                      ))
                    ) : (
                      <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                        <Mail className="mb-2 h-6 w-6 text-muted-foreground" />
                        <h3 className="text-lg font-medium">No unread messages</h3>
                        <p className="text-sm text-muted-foreground">
                          You're all caught up!
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Application Status Updates</CardTitle>
              <CardDescription>Updates on your brand applications</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(2).fill(0).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {applicationMessages.length > 0 ? (
                      applicationMessages.filter(message => 
                        getSenderName(message).toLowerCase().includes(searchTerm.toLowerCase()) || 
                        message.content.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((message) => (
                        <MessageCard key={message.id} message={message} />
                      ))
                    ) : (
                      <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                        <Mail className="mb-2 h-6 w-6 text-muted-foreground" />
                        <h3 className="text-lg font-medium">No application messages</h3>
                        <p className="text-sm text-muted-foreground">
                          Application status messages will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email-replies">
          <Card>
            <CardHeader>
              <CardTitle>Brand Replies</CardTitle>
              <CardDescription>Direct responses from brands via email</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(2).fill(0).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {emailMessages.length > 0 ? (
                      emailMessages.filter(message => 
                        getSenderName(message).toLowerCase().includes(searchTerm.toLowerCase()) || 
                        message.content.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((message) => (
                        <MessageCard key={message.id} message={message} />
                      ))
                    ) : (
                      <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                        <Mail className="mb-2 h-6 w-6 text-muted-foretonced" />
                        <h3 className="text-lg font-medium">No brand replies</h3>
                        <p className="text-sm text-muted-foreground">
                          Responses from brands will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </>
  );
};

export default ResellerMessages;
