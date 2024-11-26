import React, { useEffect } from "react";
import clsx from "clsx";

const Alert = ({
  messageAlert = [],
  messageError = [],
  messageSuccess = [],
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  // Function to check if an array is non-empty
  const isNotEmpty = (arr) =>
    Array.isArray(arr) && arr.length > 0 && arr.some((item) => item.length > 0);

  // Separate and classify messages
  const alertMessages = isNotEmpty(messageAlert) ? messageAlert : [];
  const errorMessages = isNotEmpty(messageError) ? messageError : [];
  const successMessages = isNotEmpty(messageSuccess) ? messageSuccess : [];

  // Combine messages with their type
  const messages = [
    ...alertMessages.map((msg) => ({ type: "warning", text: msg })),
    ...errorMessages.map((msg) => ({ type: "error", text: msg })),
    ...successMessages.map((msg) => ({ type: "success", text: msg })),
  ];

  // Early return if no messages exist
  if (messages.length === 0) {
    return (
      <div
        className="hidden mx-6 fixed top-0 left-0 right-0 flex flex-col items-center justify-start z-50"
        role="alert"
        aria-live="assertive"
      />
    );
  }

  // Alert styles based on type
  const alertStyles = {
    success: "bg-green-100 border-green-400 text-green-800",
    error: "bg-red-100 border-red-400 text-red-800",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-800",
  };

  // Auto-close functionality
  useEffect(() => {
    if (autoClose && successMessages.length > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose(); // Close alert after specified duration
      }, duration);

      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [autoClose, duration, onClose, successMessages]);

  return (
    <div
      className="mx-6 fixed top-0 left-0 right-0 flex flex-col items-center justify-start z-50 space-y-4 max-h-96 overflow-y-auto mt-12"
      role="alert"
      aria-live="assertive"
    >
      {/* Alert Container */}
      <div className="p-2 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={`${msg.type}-${msg.text}-${index}`}
            className={clsx(
              "border px-2 py-2 rounded-lg flex items-center",
              alertStyles[msg.type]
            )}
          >
            <div className="flex items-center space-x-4">
              {/* Alert Icon */}
              <span className="text-xl">
                {msg.type === "success"
                  ? "✔️"
                  : msg.type === "error"
                  ? "❌"
                  : "⚠️"}
              </span>
              {/* Alert Text */}
              <div className="font-medium flex items-center flex-wrap space-x-4">
                <div className="inline-block mb-2">{msg.text}</div>
              </div>
            </div>
          </div>
        ))}

        {/* "OK" Button */}
        <div className="mt-2 text-center">
          <button
            onClick={onClose}
            className="px-2 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-400 focus:outline-none transition-all duration-300"
            aria-label="Close alerts"
          >
            <span className="font-semibold">OK</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
