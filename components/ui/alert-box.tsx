import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertDialogDescription, AlertDialogTitle } from '@radix-ui/react-alert-dialog';

interface AlertBoxProps {
  alertOpen: boolean;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteCCTV: () => void;
  isLoading: boolean;
}

export const AlertBox: React.FC<AlertBoxProps> = ({ alertOpen, setAlertOpen, handleDeleteCCTV, isLoading }) => (
  <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="font-bold">Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button onClick={() => setAlertOpen(false)} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDeleteCCTV} disabled={isLoading}>
          {isLoading ? <div className="w-6 h-6 border-4 border-t-4 border-t-transparent border-gray-500 border-solid rounded-full animate-spin mr-2"></div> : 'Delete'}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
