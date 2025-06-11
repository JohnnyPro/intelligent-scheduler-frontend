// components/ui/confirm-delete-dialog.tsx
// This component provides a reusable confirmation dialog, typically used for delete operations.
// It leverages Shadcn UI for dialog functionality, Lucide React for icons, and Tailwind CSS for styling.

"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react"; // Import Trash2 and X from lucide-react

interface ConfirmDeleteDialogProps {
  // Controls the visibility of the dialog.
  open: boolean;
  // Callback function to update the `open` state in the parent component.
  // This is called when the dialog's open state changes (e.g., user clicks outside, presses Escape).
  onOpenChange: (open: boolean) => void;
  // The title displayed at the top of the dialog.
  title?: string;
  // The descriptive text for the dialog's purpose.
  description?: string;
  // Text for the "Confirm" action button (e.g., "Delete", "Proceed").
  confirmText?: string;
  // Text for the "Cancel" action button.
  cancelText?: string;
  // Callback function executed when the user confirms the action.
  // It will also close the dialog automatically.
  onConfirm: () => void;
  // Callback function executed when the user cancels the action or closes the dialog.
  // It will also close the dialog automatically.
  onCancel?: () => void; // Optional, can be omitted if no specific cancel action is needed
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title = "Confirm Delete", // Updated default title to match design
  description = "Are you sure you want to delete this item? This action cannot be undone and will permanently remove all associated data.", // Updated default description to match design
  confirmText = "Delete", // Default confirm button text
  cancelText = "Cancel", // Default cancel button text
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) {

  // Handler for when the "Confirm" button is clicked.
  // It calls the provided onConfirm callback and then closes the dialog.
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false); // Close the dialog
  };

  // Handler for when the "Cancel" button is clicked or the dialog is dismissed.
  // It calls the provided onCancel callback (if available) and then closes the dialog.
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false); // Close the dialog
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-6 bg-white rounded-lg shadow-xl border border-gray-200">
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <span className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100 text-red-500">
              <Trash2 className="h-8 w-8" />
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold self-center mt-2 text-gray-800">{title}</DialogTitle>
          <DialogDescription className="text-gray-600 text-base">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-3 mt-6">
          {/* Cancel Button - styled with 'X' icon and outline appearance */}
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto px-6 py-2 rounded-md font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
          >
            <X className="mr-2 h-4 w-4" /> {/* 'X' icon */}
            {cancelText}
          </Button>
          {/* Confirm Button - styled as solid red to match design */}
          <Button
            variant="default" // Use default variant, then override with custom classes
            onClick={handleConfirm}
            className="w-full sm:w-auto px-6 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
          >
            <Trash2 className="mr-2 h-4 w-4" /> {/* Trash icon on delete button */}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
