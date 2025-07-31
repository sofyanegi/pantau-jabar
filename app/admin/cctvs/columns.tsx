'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { DeleteAlert } from '@/components/ui/delete-alert';
import { CCTV } from '@/types/cctv';
import Link from 'next/link';

export function getColumns({ onEdit, onDelete }: { onEdit: (cctv: CCTV) => void; onDelete: (id: string) => void }): ColumnDef<CCTV>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Nama',
    },
    {
      accessorKey: 'city.name',
      header: 'Kota',
    },
    {
      accessorKey: 'streamUrl',
      header: 'stream URL',
      cell: ({ row }) => {
        const streamUrl = row.getValue('streamUrl') as string;
        return (
          <Link href={streamUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-[300px]">
            {streamUrl}
          </Link>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const cctv = row.original;
        const [open, setOpen] = useState(false);

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Buka menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(cctv)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setOpen(true);
                  }}
                  className="text-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DeleteAlert open={open} setOpen={setOpen} title={`Hapus cctv ${cctv.name}?`} onConfirm={() => onDelete(cctv.id)} />
          </>
        );
      },
    },
  ];
}
