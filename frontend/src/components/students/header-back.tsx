import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface HeaderWithBackProps {
  title: string;
  isDark?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  backText?: string;
}

const HeaderWithBack = ({
  title,
  isDark = false,
  showBack = true,
  onBack,
  backText = "Back",
}: HeaderWithBackProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="flex w-full justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      {showBack && (
        <button
          onClick={handleBack}
          className={`flex items-center shadow-md px-4 py-2 rounded-sm font-bold transition ${
            isDark
              ? "text-blue-400 hover:bg-blue-500 hover:text-white"
              : "text-blue-500 hover:bg-blue-500 hover:text-white"
          }`}
        >
          <ChevronLeft size={16} />
          {backText}
        </button>
      )}
    </div>
  );
};

export default HeaderWithBack;
