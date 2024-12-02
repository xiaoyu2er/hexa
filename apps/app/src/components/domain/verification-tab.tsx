interface VerificationTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function VerificationTab({
  label,
  isActive,
  onClick,
}: VerificationTabProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        className={`p-4 transition-colors duration-75 ${
          isActive ? 'text-black' : 'text-gray-400 hover:text-gray-500'
        }`}
      >
        {label}
      </button>
      {isActive && (
        <div className="absolute bottom-0 w-full px-1.5 text-black">
          <div className="h-0.5 rounded-t-full bg-current" />
        </div>
      )}
    </div>
  );
}
