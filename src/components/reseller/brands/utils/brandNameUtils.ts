
// Function to generate random letters for brand names
export const generateRandomBrandName = (id: string) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const length = 6 + (hash % 4); // 6-9 characters
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += letters[Math.floor(Math.random() * letters.length)];
  }
  
  return result;
};

export const transformBrandsWithRandomNames = (brands: any[]) => {
  return brands.map(brand => ({
    ...brand,
    displayName: generateRandomBrandName(brand.id),
    displayDepartment: brand.department ? generateRandomBrandName(brand.id + '_dept') : undefined
  }));
};
