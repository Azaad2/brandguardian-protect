
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const BrandMessages = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Communicate with your resellers</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default BrandMessages;
