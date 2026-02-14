"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";

interface LinkModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
  initialUrl?: string;
}

export default function LinkModal({
  open,
  onClose,
  onSubmit,
  initialUrl,
}: LinkModalProps) {
  const [url, setUrl] = useState("");

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      // Reset value ONLY when modal opens
      setUrl(initialUrl ?? "");
    }
    if (!isOpen) {
      onClose();
    }
  };

  const handleSubmit = () => {
    const trimmed = url.trim();

    if (!trimmed.startsWith("/") && !trimmed.startsWith("http")) {
      alert("Enter valid URL starting with / or http");
      return;
    }

    if (trimmed) {
      onSubmit(trimmed);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleOpenChange} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl p-4 w-full max-w-sm shadow-lg space-y-3">
          <Dialog.Title className="font-semibold text-lg">
            {initialUrl ? "Edit Link" : "Insert Link"}
          </Dialog.Title>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL (https:// or /internal)"
            className="w-full border border-gray-300 rounded-md p-2"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-md bg-gray-200"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-3 py-1 rounded-md bg-blue-600 text-white"
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
