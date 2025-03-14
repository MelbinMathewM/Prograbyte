import { Dialog } from "@headlessui/react";

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
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* Transparent Blurred Overlay */}
            <div className="fixed inset-0 backdrop-blur-sm bg-gray-200/40" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel
                    className={`p-6 rounded-lg shadow-lg max-w-sm w-full transition-all ${
                        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                    }`}
                >
                    <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
                    <Dialog.Description className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {message}
                    </Dialog.Description>

                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            className={`px-4 py-2 rounded-lg transition-all ${
                                isDark
                                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                            }`}
                            onClick={onClose}
                        >
                            {cancelText}
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg transition-all ${
                                isDark
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default ConfirmDialog;
