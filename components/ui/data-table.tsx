'use client';

import { useEffect, useState } from 'react';

import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable, getSortedRowModel, SortingState } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { DataTablePagination } from '@/components/ui/data-table/data-table-pagination';
import { DataTableViewOptions } from '@/components/ui/data-table/data-table-view-option';
import { Button } from './button';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchable?: boolean;
}

export function DataTable<TData, TValue>({ columns, data, searchable }: DataTableProps<TData, TValue>) {
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const formatNumber = (value: number) => {
    if (typeof value === 'number') {
      return new Intl.NumberFormat().format(value);
    }
    return value;
  };

  return (
    <div className="overflow-x-auto">
      {searchable && <Input type="text" placeholder="Search..." value={globalFilter ?? ''} onChange={(e) => handleSearchChange(e.target.value)} className="p-2 border rounded mb-4 max-w-sm" />}
      <div className="rounded-md border">
        <DataTableViewOptions table={table} />

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead>No</TableHead>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {!header.isPlaceholder && (
                      <>
                        {header.column.columnDef.enableSorting && (
                          <Button variant="ghost" onClick={() => header.column.toggleSorting()} className="flex items-center">
                            {flexRender(header.column.columnDef.header, header.getContext())}

                            {header.column.getIsSorted() === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : header.column.getIsSorted() === 'desc' ? <ArrowDown className="ml-2 h-4 w-4" /> : <ArrowUpDown className="ml-2 h-4 w-4" />}
                          </Button>
                        )}
                        {!header.column.columnDef.enableSorting && <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>}
                      </>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{formatNumber(row.index + 1)}</TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DataTablePagination table={table} setLoading={setLoading} />
      </div>
    </div>
  );
}
