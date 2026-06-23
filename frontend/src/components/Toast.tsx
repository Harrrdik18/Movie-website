import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

const Toast = ({ message, type = "info", onClose, duration = 4000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const borderColor =
    type === "success"
      ? "border-[#2ecc71]"
      : type === "error"
        ? "border-[#c9774d]"
        : "border-[#9ca3af]";

  const textColor =
    type === "success"
      ? "text-[#2ecc71]"
      : type === "error"
        ? "text-[#c9774d]"
        : "text-[#f5f5f1]";

  return (
    <div className="fixed top-20 right-6 z-[100] animate-slide-up">
      <div className={`border ${borderColor} bg-[#141414] px-5 py-3 min-w-[280px] shadow-lg`}>
        <div className="flex items-center justify-between gap-4">
          <span className={`text-sm ${textColor}`}>{message}</span>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-[#f5f5f1] transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
