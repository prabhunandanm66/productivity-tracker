import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react"; // Assuming you're using lucide-react icons
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Input } from "@/components/ui/input"; // ShadCN Input

const NameInputModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    // Check if name is in local storage when the component mounts
    const storedName = localStorage.getItem("name");
    if (!storedName) {
      setIsOpen(true); // Open modal if no name is found
    }
  }, []);

  const saveName = () => {
    localStorage.setItem("name", name); // Save name to localStorage
    setIsOpen(false); // Close modal after saving
  };

  return (
    <div>
      {/* Modal structure using Radix Dialog */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          {/* Overlay */}
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />

          {/* Modal Content */}
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md p-6 bg-white rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2">
            <Dialog.Title className="text-lg font-medium">
              Welcome to Productivity 7 (PRO7)
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm">
              Hello there, Please Introduce yourself to get started
            </Dialog.Description>

            {/* Input field to enter name */}
            <div className="mt-4 flex flex-col gap-4">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
              <Button onClick={saveName}>Save to Continue</Button>
            </div>

            {/* Close button */}
            <Dialog.Close asChild>
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default NameInputModal;
