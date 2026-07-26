// components/LoadingSpinner.jsx

const LoadingSpinner = ({
  message = "Loading...",
  size = "md",
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4",
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  const SpinnerContent = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${spinnerSize} rounded-full border-gray-300 dark:border-gray-600 animate-spin`}
        style={{
          borderTopColor: "#2ca77b",
          borderRightColor: "#d1d5db",
          borderBottomColor: "#d1d5db",
          borderLeftColor: "#d1d5db",
          borderStyle: "solid",
        }}
      />
      {message && (
        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 
                      flex items-center justify-center"
      >
        <SpinnerContent />
      </div>
    );
  }

  return <SpinnerContent />;
};

export default LoadingSpinner;
