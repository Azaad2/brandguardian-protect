
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import SignupForm from '@/components/auth/SignupForm';

const AdminSignup = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-red-400" />
            <span className="text-2xl font-bold text-white">Admin Portal</span>
          </div>
        </div>
        <div className="mb-3 text-center">
          <h1 className="text-xl font-semibold text-red-400">RESTRICTED ACCESS</h1>
          <p className="text-sm text-slate-300">Administrative Personnel Only</p>
        </div>
        <Card className="border-red-200 shadow-xl bg-white/95 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Create Admin Account
            </CardTitle>
            <CardDescription className="text-slate-600">
              Sign up with authorized admin credentials. Only authorized personnel can create admin accounts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm userRole="admin" />
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-100 px-6 py-4">
            <div className="text-center text-sm space-y-2">
              <div className="text-slate-600">
                Already have an admin account?{' '}
                <Link to="/admin/login" className="text-red-600 hover:text-red-700 hover:underline font-medium">
                  Sign in
                </Link>
              </div>
              <div className="text-xs text-slate-500 bg-red-50 px-3 py-1 rounded">
                ⚠️ Unauthorized access is prohibited
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminSignup;
