
import { ShieldCheck, Users, Mail, MapPin } from "lucide-react";

export const InfoPanel = () => {
  return (
    <div className="gradient-bg text-white p-8 md:p-12">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="h-8 w-8" />
        <div className="text-xl font-bold">BndBox</div>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Grow Your Sales with Confidence?</h2>
      <p className="mb-8 text-white/90">
        Join 500+ brands already scaling safely with our trusted reseller network across Amazon, Walmart, and eBay.
      </p>
      
      <div className="space-y-6">
        <div className="flex gap-4 items-start">
          <Users className="h-5 w-5 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-lg">Trusted Resellers</h3>
            <p className="text-white/80">Connect with pre-vetted partners who respect your brand guidelines and pricing policies.</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-start">
          <Mail className="h-5 w-5 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-lg">Contact Us</h3>
            <p className="text-white/80">help@bndbox.com</p>
            <p className="text-white/80">408-627-9875</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-start">
          <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-lg">Our Office</h3>
            <p className="text-white/80">NJ, United States</p>
          </div>
        </div>
      </div>
    </div>
  );
};
