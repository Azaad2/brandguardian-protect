import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

export interface BillingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface BillingAddressFormProps {
  onSubmit: (address: BillingAddress) => void;
  onBack: () => void;
  isLoading: boolean;
  selectedTier: {
    name: string;
    price: string;
    period: string;
  };
}

export const BillingAddressForm = ({ onSubmit, onBack, isLoading, selectedTier }: BillingAddressFormProps) => {
  const [address, setAddress] = useState<BillingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'IN'
  });

  const [errors, setErrors] = useState<Partial<BillingAddress>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<BillingAddress> = {};

    if (!address.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!address.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!address.email.trim()) newErrors.email = 'Email is required';
    if (!address.phone.trim()) newErrors.phone = 'Phone is required';
    if (!address.address.trim()) newErrors.address = 'Address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state.trim()) newErrors.state = 'State is required';
    if (!address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!address.country) newErrors.country = 'Country is required';

    // Email validation
    if (address.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(address);
    }
  };

  const handleInputChange = (field: keyof BillingAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const countries = [
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'SG', name: 'Singapore' },
    { code: 'AE', name: 'United Arab Emirates' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plans
        </Button>
        
        <h2 className="text-2xl font-bold mb-2">Billing Information</h2>
        <p className="text-muted-foreground">
          Please provide your billing address for {selectedTier.name} plan ({selectedTier.price}{selectedTier.period})
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
          <CardDescription>
            This information will be used for billing and invoicing purposes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={address.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={address.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={address.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={address.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={errors.phone ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={address.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={errors.address ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={address.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={errors.city ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
              </div>
              
              <div>
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  value={address.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={errors.state ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
              </div>
              
              <div>
                <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                <Input
                  id="zipCode"
                  value={address.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className={errors.zipCode ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="country">Country *</Label>
              <Select
                value={address.country}
                onValueChange={(value) => handleInputChange('country', value)}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Continue to Payment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};