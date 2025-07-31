'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/user';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';

export function getColumns({ onEdit, onDelete }: { onEdit: (user: User) => void; onDelete: (id: string) => void }): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Nama',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;

        const variant = role === 'ADMIN' ? 'destructive' : role === 'USER' ? 'secondary' : 'default';
        return <Badge variant={variant}>{role}</Badge>;
      },
    },
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => {
        const name = row.getValue('name') as string;
        const image = row.getValue('image') as string;
        return (
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9 border-2 border-transparent hover:border-primary/50 transition-colors">
              <AvatarImage src={image ?? ''} alt={name ?? 'User Avatar'} />
              <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">{name?.[0].toUpperCase() ?? '?'}</AvatarFallback>
            </Avatar>
          </Button>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;
        const [open, setOpen] = useState(false);
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Buka menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
