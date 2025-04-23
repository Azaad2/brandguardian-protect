
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Mail, Users, Search, Filter } from "lucide-react";

const ResellerMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const messages = [
    {
      id: 1,
      sender: "Beauty Co Support",
      subject: "Your Brand Application Status",
      preview: "We're pleased to inform you that your application to become an authorized Beauty Co reseller has been approved...",
      timestamp: "10:30 AM",
      type: "application",
      status: "approved",
      unread: true
    },
    {
      id: 2,
      sender: "TechGadget Brand Manager",
      subject: "Updated MAP Policy Information",
      preview: "We've recently updated our Minimum Advertised Price policy and wanted to ensure all our authorized resellers...",
      timestamp: "Yesterday",
      type: "policy",
      status: "important",
      unread: true
    },
    {
      id: 3,
      sender: "HomeEssentials Wholesale",
      subject: "Q2 Promotional Opportunities",
      preview: "As a valued reseller partner, we're giving you early access to our Q2 promotional bundles and special pricing...",
      timestamp: "2 days ago",
      type: "promotion",
      status: "standard",
      unread: true
    },
    {
      id: 4,
      sender: "BndBox Support",
      subject: "New Brands Available for Application",
      preview: "Based on your reseller profile and performance metrics, we've identified 3 new brands that would be a good fit...",
      timestamp: "3 days ago",
      type: "recommendation",
      status: "standard",
      unread: false
    },
    {
      id: 5,
      sender: "HealthProducts Compliance",
      subject: "Action Required: Listing Update Needed",
      preview: "We've noticed that several of your HealthProducts listings are using outdated product descriptions. Please update...",
      timestamp: "1 week ago",
      type: "compliance",
      status: "warning",
      unread: false
    },
    {
      id: 6,
      sender: "FashionBrand Wholesale",
      subject: "Inventory Restock Notification",
      preview: "The seasonal items you expressed interest in are now back in stock and available for wholesale purchase...",
      timestamp: "1 week ago",
      type: "inventory",
      status: "standard",
      unread: false
    }
  ];

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "application":
        return "bg-blue-100 text-blue-700";
      case "policy":
        return "bg-purple-100 text-purple-700";
      case "promotion":
        return "bg-green-100 text-green-700";
      case "recommendation":
        return "bg-amber-100 text-amber-700";
      case "compliance":
        return "bg-red-100 text-red-700";
      case "inventory":
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" className="bg-green-600">Approved</Badge>;
      case "important":
        return <Badge variant="default" className="bg-blue-600">Important</Badge>;
      case "warning":
        return <Badge variant="default" className="bg-red-600">Action Required</Badge>;
      default:
        return null;
    }
  };

  const filteredMessages = messages.filter(
    message => 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
      message.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Communicate with your brand partners</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Waiting for your response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-muted-foreground">Average response time: 3.2 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Brand Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Active communication channels</p>
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
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Message Center</CardTitle>
              <CardDescription>View and respond to communications from your brand partners</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-center justify-between rounded-lg border p-4 ${
                        message.unread ? 'bg-muted/50' : ''
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{message.sender}</span>
                          {message.unread && (
                            <Badge variant="secondary">New</Badge>
                          )}
                          {getStatusBadge(message.status)}
                        </div>
                        <div className="text-sm font-medium">{message.subject}</div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {message.preview}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp}
                          </span>
                          <Badge
                            className={getTypeStyles(message.type)}
                          >
                            {message.type}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}

                  {filteredMessages.length === 0 && (
                    <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                      <Mail className="mb-2 h-6 w-6 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No messages found</h3>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm ? "Try adjusting your search term" : "You're all caught up!"}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
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
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {filteredMessages
                    .filter(message => message.unread)
                    .map((message) => (
                      <div
                        key={message.id}
                        className="flex items-center justify-between rounded-lg border bg-muted/50 p-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{message.sender}</span>
                            <Badge variant="secondary">New</Badge>
                            {getStatusBadge(message.status)}
                          </div>
                          <div className="text-sm font-medium">{message.subject}</div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {message.preview}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp}
                            </span>
                            <Badge
                              className={getTypeStyles(message.type)}
                            >
                              {message.type}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                  ))}
                </div>
              </ScrollArea>
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
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {filteredMessages
                    .filter(message => message.type === 'application')
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-center justify-between rounded-lg border p-4 ${
                          message.unread ? 'bg-muted/50' : ''
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{message.sender}</span>
                            {message.unread && (
                              <Badge variant="secondary">New</Badge>
                            )}
                            {getStatusBadge(message.status)}
                          </div>
                          <div className="text-sm font-medium">{message.subject}</div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {message.preview}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp}
                            </span>
                            <Badge
                              className={getTypeStyles(message.type)}
                            >
                              {message.type}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="important">
          <Card>
            <CardHeader>
              <CardTitle>Important Messages</CardTitle>
              <CardDescription>High priority communications</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {filteredMessages
                    .filter(message => message.status === 'important' || message.status === 'warning')
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-center justify-between rounded-lg border p-4 ${
                          message.unread ? 'bg-muted/50' : ''
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{message.sender}</span>
                            {message.unread && (
                              <Badge variant="secondary">New</Badge>
                            )}
                            {getStatusBadge(message.status)}
                          </div>
                          <div className="text-sm font-medium">{message.subject}</div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {message.preview}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp}
                            </span>
                            <Badge
                              className={getTypeStyles(message.type)}
                            >
                              {message.type}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResellerMessages;
