
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

interface ProductCategoriesCardProps {
  profile: {
    product_categories: string[];
  };
  formatProductCategories: (categories: string[]) => string[];
}

const ProductCategoriesCard = ({ profile, formatProductCategories }: ProductCategoriesCardProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Package className="h-4 w-4" />
        Product Categories
      </h3>
      <div className="flex flex-wrap gap-2">
        {formatProductCategories(profile.product_categories).map((category, index) => (
          <Badge key={index} variant="outline">
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ProductCategoriesCard;
