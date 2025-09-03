import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DemoSetupManager from '@/components/demo/DemoSetupManager';

const DemoSetup = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Investor Demo Setup
            </h1>
            <p className="text-lg text-gray-600">
              Create clean demo accounts and sample data for investor presentations
            </p>
          </div>
          <DemoSetupManager />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DemoSetup;