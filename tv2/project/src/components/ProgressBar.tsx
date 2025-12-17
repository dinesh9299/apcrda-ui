interface ProgressBarProps {
  label: string;
  current: number;
  target: number;
  color: 'blue' | 'green' | 'amber';
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  amber: 'bg-amber-500',
};

const ProgressBar = ({ label, current, target, color }: ProgressBarProps) => {
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">
          {current.toLocaleString()} / {target.toLocaleString()}
        </span>
      </div>
      <div className="relative">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${colorClasses[color]} transition-all duration-500 rounded-full relative`}
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>
        <span className="absolute -top-6 right-0 text-xs font-semibold text-gray-600">
          {percentage.toFixed(0)}%
        </span>
      </div>
      {isComplete && (
        <p className="text-xs text-green-600 font-medium">Target achieved!</p>
      )}
    </div>
  );
};

export default ProgressBar;
