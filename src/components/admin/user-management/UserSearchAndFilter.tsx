
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface UserSearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  onRefresh: () => void;
}

const UserSearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  onRefresh,
}: UserSearchAndFilterProps) => {
  return (
    <div className="flex space-x-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="w-48">
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="all">All Roles</option>
          <option value="reseller">Resellers</option>
          <option value="brand">Brands</option>
          <option value="admin">Admins</option>
        </select>
      </div>
      <Button onClick={onRefresh} variant="outline">
        Refresh
      </Button>
    </div>
  );
};

export default UserSearchAndFilter;
