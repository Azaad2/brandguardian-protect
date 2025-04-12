
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BndBoxLogo from '@/components/branding/BndBoxLogo';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  footerContent?: ReactNode;
  portalType: 'brand' | 'reseller';
}

const AuthLayout = ({ children, title, description, footerContent, portalType }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link to="/" className="inline-block">
            <BndBoxLogo className="h-12 w-auto" />
          </Link>
        </div>
        <div className="mb-3 text-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{portalType === 'brand' ? 'Brand Portal' : 'Reseller Portal'}</h1>
        </div>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
          {footerContent && (
            <CardFooter className="flex justify-center border-t border-slate-100 px-6 py-4">
              {footerContent}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
