import { useSelector } from "react-redux";
import { selectRenderWakingUp } from "../redux/selectors/renderSelectors";

interface Props {
  inline?: boolean;
}

const RenderWakeMessage = ({ inline }: Props) => {
  const wakingUp = useSelector(selectRenderWakingUp);

  if (!wakingUp) return null;

  if (inline) {
    return (
      <div className="flex items-center gap-2 mt-2 text-xs text-[#9ca3af]">
        <div className="animate-spin w-3 h-3 border-2 border-[#c9774d] border-t-transparent rounded-full shrink-0" />
        <span>Backend warming up (Render free tier) — this may take a moment...</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-slide-up">
      <div className="border border-[#2a2a2a] bg-[#141414]/95 backdrop-blur-sm px-5 py-3 shadow-lg min-w-[320px] max-w-[480px]">
        <div className="flex items-center gap-3">
          <div className="animate-spin w-4 h-4 border-2 border-[#c9774d] border-t-transparent rounded-full shrink-0" />
          <div className="flex flex-col">
            <span className="text-[#f5f5f1] text-sm font-medium">
              Backend is warming up...
            </span>
            <span className="text-[#9ca3af] text-xs mt-0.5">
              Render's free tier spins down after inactivity. This isn't a failure — it usually takes 30–60 seconds to wake up.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderWakeMessage;
