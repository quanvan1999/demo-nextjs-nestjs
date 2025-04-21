'use client';

import { client } from '@/api';
import { Button } from '@/components/ui/button';
import { User, UsersTable } from '@/components/users/users-table';
import { useApi } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

type UsersResponse = {
  result: User[];
  totalPages: number;
  totalItems: number;
};

export const UserUI = () => {
  const { getApiClient } = useApi();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const apiClient = await getApiClient();
      return await apiClient.users.usersControllerGetUser({ current: '1', pageSize: '10' });
    },
  });

  const handleEdit = (user: User) => {
    console.log('Edit user:', user);
  };

  const handleDelete = (user: User) => {
    console.log('Delete user:', user);
  };

  return (
    <div className="p-8 flex-1 flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button>Add User</Button>
      </div>

      <UsersTable isLoading={isLoading} users={users} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};
