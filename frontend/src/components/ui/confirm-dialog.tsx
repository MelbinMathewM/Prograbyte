import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    isDark?: boolean;
}

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDark = false
}: ConfirmDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`${isDark ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
                <DialogHeader>
                    <DialogTitle className={`${isDark ? "text-gray-200" : "text-black"}`}>
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <p>{message}</p>
                <DialogFooter className="mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                        {confirmText}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog;
