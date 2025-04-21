'use client';

import { client } from '@/api';
import { intercepError, intercepRequest } from '@/api/interceptor';
import { Button } from '@/components/ui/button';
import { User } from '@/components/users/users-table';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive' },
];

export const UserUI = () => {
  const { data: session } = useSession();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => client.users.usersControllerFindAll({ current: '1', pageSize: '10' }),
  });

  console.log(users);

  const handleEdit = (user: User) => {
    console.log('Edit user:', user);
  };

  const handleDelete = (user: User) => {
    console.log('Delete user:', user);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button>Add User</Button>
      </div>

      {/* <UsersTable users={users} onEdit={handleEdit} onDelete={handleDelete} /> */}
    </div>
  );
};
