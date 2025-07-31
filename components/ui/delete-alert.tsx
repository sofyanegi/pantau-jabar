'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useEffect } from 'react';

interface DeleteAlertProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  onConfirm: () => void;
}

export function DeleteAlert({ open, setOpen, title = 'Yakin ingin menghapus item ini?', description = 'Tindakan ini tidak bisa dibatalkan.', confirmText = 'Hapus', onConfirm }: DeleteAlertProps) {
  useEffect(() => {}, []);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
