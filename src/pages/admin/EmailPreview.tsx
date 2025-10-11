import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Loader2, Mail, Copy, Monitor, Smartphone } from 'lucide-react';

type InteractionType = 'reply' | 'approval' | 'rejection' | 'email_open';
type ViewMode = 'desktop' | 'mobile';

export default function EmailPreview() {
  const [brandName, setBrandName] = useState('Example Brand Co.');
  const [resellerCompany, setResellerCompany] = useState('ABC Wholesale Distributors');
  const [interactionType, setInteractionType] = useState<InteractionType>('reply');
  const [emailHtml, setEmailHtml] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [testEmail, setTestEmail] = useState('');

  const loadPreview = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('preview-brand-engagement-email', {
        body: { brandName, resellerCompany, interactionType }
      });

      if (error) throw error;

      if (data) {
        setEmailHtml(data.html);
        setEmailSubject(data.subject);
        toast({
          title: 'Preview loaded',
          description: 'Email preview has been generated successfully',
        });
      }
    } catch (error: any) {
      console.error('Failed to load preview:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load email preview',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(emailHtml);
    toast({
      title: 'Copied!',
      description: 'Email HTML copied to clipboard',
    });
  };

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-brand-engagement-email', {
        body: {
          brandEmail: testEmail,
          brandName,
          resellerCompany,
          interactionType,
          applicationId: '00000000-0000-0000-0000-000000000000' // Test ID
        }
      });

      if (error) throw error;

      toast({
        title: 'Test email sent!',
        description: `Email sent to ${testEmail}`,
      });
      setTestEmail('');
    } catch (error: any) {
      console.error('Failed to send test email:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send test email',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Brand Engagement Email Preview</h1>
        <p className="text-muted-foreground mt-2">
          Preview and test the engagement emails that brands receive
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
            <CardDescription>Customize the preview parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name</Label>
              <Input
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter brand name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resellerCompany">Reseller Company</Label>
              <Input
                id="resellerCompany"
                value={resellerCompany}
                onChange={(e) => setResellerCompany(e.target.value)}
                placeholder="Enter reseller company"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interactionType">Interaction Type</Label>
              <Select value={interactionType} onValueChange={(value: InteractionType) => setInteractionType(value)}>
                <SelectTrigger id="interactionType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reply">Brand Replied</SelectItem>
                  <SelectItem value="approval">Application Approved</SelectItem>
                  <SelectItem value="rejection">Application Rejected</SelectItem>
                  <SelectItem value="email_open">Brand Opened Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>View Mode</Label>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'desktop' ? 'default' : 'outline'}
                  onClick={() => setViewMode('desktop')}
                  className="flex-1"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Desktop
                </Button>
                <Button
                  variant={viewMode === 'mobile' ? 'default' : 'outline'}
                  onClick={() => setViewMode('mobile')}
                  className="flex-1"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile
                </Button>
              </div>
            </div>

            <Button onClick={loadPreview} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Load Preview
                </>
              )}
            </Button>

            {emailHtml && (
              <Button onClick={copyHtml} variant="outline" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copy HTML
              </Button>
            )}

            <div className="pt-4 border-t space-y-2">
              <Label htmlFor="testEmail">Send Test Email</Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter email address"
              />
              <Button onClick={sendTestEmail} disabled={loading || !emailHtml} variant="secondary" className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Test Email'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Email Preview</CardTitle>
            <CardDescription>
              {emailSubject || 'Load preview to see email content'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailHtml ? (
              <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
                <Mail className="h-16 w-16 mb-4 opacity-20" />
                <p>Click "Load Preview" to generate email preview</p>
              </div>
            ) : (
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="html">HTML Source</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="mt-4">
                  <div className="border rounded-lg overflow-hidden">
                    <iframe
                      srcDoc={emailHtml}
                      style={{
                        width: viewMode === 'mobile' ? '375px' : '100%',
                        height: '800px',
                        border: 'none',
                        margin: '0 auto',
                        display: 'block',
                      }}
                      title="Email Preview"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="html" className="mt-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs">
                      <code>{emailHtml}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
