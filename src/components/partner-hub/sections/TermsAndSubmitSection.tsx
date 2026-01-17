import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Shield } from 'lucide-react';
import { PartnerFormValues } from '../PartnerFormSchema';
import { Link } from 'react-router-dom';

interface TermsAndSubmitSectionProps {
  form: UseFormReturn<PartnerFormValues>;
  isSubmitting: boolean;
}

export function TermsAndSubmitSection({ form, isSubmitting }: TermsAndSubmitSectionProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <FormField
          control={form.control}
          name="termsAgreement"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <label className="text-sm font-medium cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms-of-service" className="text-primary hover:underline" target="_blank">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="text-primary hover:underline" target="_blank">
                    Privacy Policy
                  </Link>
                </label>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <Shield className="h-4 w-4 text-primary" />
          <span>Your information is secure and will only be used to process your application.</span>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Application...
            </>
          ) : (
            'Submit Application'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
