'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { DeleteAlert } from '@/components/ui/delete-alert';
import { City } from '@/types/city';

export function getColumns({ onEdit, onDelete }: { onEdit: (city: City) => void; onDelete: (id: string) => void }): ColumnDef<City>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Nama',
    },
    {
      accessorKey: '_count.cctvs',
      header: 'Total CCTV',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const city = row.original;
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
                <DropdownMenuItem onClick={() => onEdit(city)}>
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

            <DeleteAlert open={open} setOpen={setOpen} title={`Hapus kota ${city.name}?`} description="Semua data CCTV terkait akan ikut terhapus." onConfirm={() => onDelete(city.id)} />
          </>
        );
      },
    },
  ];
}
