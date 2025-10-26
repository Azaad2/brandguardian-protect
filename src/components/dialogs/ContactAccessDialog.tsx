import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Store, Package, ShoppingCart, Eye, EyeOff, Mail, Phone, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/types/auth';

interface ContactAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactEmail?: string;
  contactPhone?: string;
  entityName: string;
  entityType: 'brand' | 'distributor';
}

const ContactAccessDialog = ({
  open,
  onOpenChange,
  contactEmail,
  contactPhone,
  entityName,
  entityType,
}: ContactAccessDialogProps) => {
  const [step, setStep] = useState<'role' | 'signup' | 'success'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isLoading, user } = useAuth();

  const roleOptions = [
    { value: 'reseller' as UserRole, label: 'Reseller', icon: Store, description: 'I sell products online' },
    { value: 'brand' as UserRole, label: 'Brand', icon: Building2, description: 'I manufacture products' },
    { value: 'reseller' as UserRole, label: 'Distributor', icon: Package, description: 'I distribute products' },
    { value: 'reseller' as UserRole, label: 'Retailer', icon: ShoppingCart, description: 'I run a retail store' },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('signup');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    try {
      await signUp(email, password, {
        full_name: email.split('@')[0],
        company_name: 'Not specified',
        user_role: selectedRole as UserRole,
      });
      setStep('success');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleClose = () => {
    setStep('role');
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setShowPassword(false);
    onOpenChange(false);
  };

  // If user is already logged in, show contact details directly
  if (user && step === 'role') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Contact Information
            </DialogTitle>
            <DialogDescription>
              Contact details for {entityName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {contactEmail && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Email</p>
                  <a 
                    href={`mailto:${contactEmail}`}
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>
            )}
            {contactPhone && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Phone</p>
                  <a 
                    href={`tel:${contactPhone}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {contactPhone}
                  </a>
                </div>
              </div>
            )}
          </div>
          <Button onClick={handleClose} className="w-full">Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        {step === 'role' && (
          <>
            <DialogHeader>
              <DialogTitle>How do you want to use BndBox?</DialogTitle>
              <DialogDescription>
                Select your role to create an account and access contact details
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.label}
                    onClick={() => handleRoleSelect(option.value)}
                    className="flex flex-col items-center gap-3 p-6 border-2 border-muted hover:border-primary rounded-lg transition-colors text-center group"
                  >
                    <Icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div>
                      <h3 className="font-semibold">{option.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 'signup' && (
          <>
            <DialogHeader>
              <DialogTitle>Create Your Account</DialogTitle>
              <DialogDescription>
                Sign up to view contact details for {entityName}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSignup} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('role')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? 'Creating Account...' : 'Create Account & View Contact'}
                </Button>
              </div>
            </form>
          </>
        )}

        {step === 'success' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Account Created Successfully!
              </DialogTitle>
              <DialogDescription>
                Here are the contact details for {entityName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {contactEmail && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Email</p>
                    <a 
                      href={`mailto:${contactEmail}`}
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>
              )}
              {contactPhone && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Phone</p>
                    <a 
                      href={`tel:${contactPhone}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {contactPhone}
                    </a>
                  </div>
                </div>
              )}
            </div>
            <Button onClick={handleClose} className="w-full">Close</Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactAccessDialog;
