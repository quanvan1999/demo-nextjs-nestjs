'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '../ui/spinner';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  phone?: string;
  address?: string;
  image?: string;
}

interface UsersTableProps {
  users?: { result: User[]; totalPages: number; totalItems: number };
  isLoading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UsersTable = ({ users, isLoading, onEdit, onDelete }: UsersTableProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border bg-card">
        <Spinner />
      </div>
    );
  }

  if (!users?.result?.length) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border bg-card">
        <div className="text-muted-foreground">No users found</div>
      </div>
    );
  }

  return (
    <div className="flex-1 rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.result.map(user => (
              <tr key={user._id} className="border-b">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(user)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
