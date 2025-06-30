
interface BrandsHeaderProps {}

const BrandsHeader = ({}: BrandsHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Available Brands</h1>
        <p className="text-blue-100 text-lg max-w-2xl">
          Discover and apply to wholesale opportunities with top brands
        </p>
      </div>
    </div>
  );
};

export default BrandsHeader;
