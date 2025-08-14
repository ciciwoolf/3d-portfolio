import React, { useState } from 'react';
import ChatWindow from './ChatWindow';

/**
 * ChatWidget - The floating chat button and window container
 *
 * What this does:
 * - Shows a floating chat button in bottom-right corner
 * - Toggles the chat window open/closed
 * - Manages the overall chat visibility state
 */
const ChatWidget = (): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleChat = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window - only visible when open */}
      {isOpen && (
        <div className="mb-4">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className={`
          w-16 h-16 rounded-full shadow-lg transition-all duration-300 ease-in-out
          flex items-center justify-center text-white font-bold text-xl
          hover:scale-110 active:scale-95
          ${
            isOpen
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-white-50 hover:bg-white-50'
          }
        `}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? '×' : '🤖'}
      </button>
    </div>
  );
};

export default ChatWidget;
