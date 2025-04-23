
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Mail, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const BrandMessages = () => {
  const messages = [
    {
      id: 1,
      sender: "Summit Retail LLC",
      subject: "Wholesale Account Application",
      preview: "I'm interested in becoming an authorized reseller for your premium skincare line...",
      timestamp: "10:30 AM",
      type: "application",
      unread: true
    },
    {
      id: 2,
      sender: "Metro Distributors",
      subject: "MAP Violation Report",
      preview: "We've identified an unauthorized seller on Amazon selling below MAP...",
      timestamp: "Yesterday",
      type: "alert",
      unread: true
    },
    {
      id: 3,
      sender: "Valley Supply Co",
      subject: "Q2 Performance Review",
      preview: "Our Q2 sales numbers show a 25% increase in your product line revenue...",
      timestamp: "2 days ago",
      type: "report",
      unread: false
    },
    {
      id: 4,
      sender: "Peak Distribution",
      subject: "Inventory Update Request",
      preview: "Could you please provide current stock levels for the following SKUs...",
      timestamp: "3 days ago",
      type: "inquiry",
      unread: false
    }
  ];

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "application":
        return "bg-blue-100 text-blue-700";
      case "alert":
        return "bg-red-100 text-red-700";
      case "report":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Communicate with your reseller network</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Applications</CardTitle>
            <BadgeCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">Average response time: 2.5 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Threads</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">486</div>
            <p className="text-xs text-muted-foreground">Across all channels</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {messages.map((message) => (
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
    </div>
  );
};

export default BrandMessages;
