
export const formatBusinessType = (type: string) => {
  const types: { [key: string]: string } = {
    individual: 'Individual',
    corporation: 'Corporation',
    partnership: 'Partnership',
    llc: 'LLC',
    other: 'Other'
  };
  return types[type] || type;
};

export const formatSalesVolume = (volume: string) => {
  const volumes: { [key: string]: string } = {
    under_10k: 'Under $10,000',
    '10k_50k': '$10,000 - $50,000',
    '50k_100k': '$50,000 - $100,000',
    '100k_500k': '$100,000 - $500,000',
    '500k_1m': '$500,000 - $1 million',
    over_1m: 'Over $1 million'
  };
  return volumes[volume] || volume;
};

export const formatWholesaleBudget = (budget: string) => {
  const budgets: { [key: string]: string } = {
    under_5k: 'Under $5,000',
    '5k_10k': '$5,000 - $10,000',
    '10k_25k': '$10,000 - $25,000',
    '25k_50k': '$25,000 - $50,000',
    '50k_100k': '$50,000 - $100,000',
    over_100k: 'Over $100,000'
  };
  return budgets[budget] || budget;
};

export const formatProductCategories = (categories: string[]) => {
  const categoryMap: { [key: string]: string } = {
    electronics: 'Electronics',
    beauty: 'Beauty',
    home_goods: 'Home Goods',
    fashion: 'Fashion',
    toys: 'Toys',
    sports: 'Sports',
    automotive: 'Automotive',
    health: 'Health',
    grocery: 'Grocery',
    books: 'Books',
    other: 'Other'
  };
  return categories.map(cat => categoryMap[cat] || cat);
};
