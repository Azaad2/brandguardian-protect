
import React from "react";
import { useLocation } from "react-router-dom";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

interface BreadcrumbNavProps {
  customPaths?: Array<{
    name: string;
    path: string;
    isCurrent?: boolean;
  }>;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ customPaths }) => {
  const location = useLocation();
  
  // Generate breadcrumb paths based on URL or use custom paths
  const generatePaths = () => {
    if (customPaths) {
      return customPaths;
    }
    
    const { pathname } = location;
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    
    // Create paths array with home as first item
    const paths = [{ name: "Home", path: "/", isCurrent: pathname === "/" }];
    
    // Build paths from URL segments
    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Format segment name (capitalize, replace hyphens with spaces)
      const name = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
      
      paths.push({
        name,
        path: currentPath,
        isCurrent: isLast
      });
    });
    
    return paths;
  };
  
  const paths = generatePaths();
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.isCurrent ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.path}>{item.name}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < paths.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
