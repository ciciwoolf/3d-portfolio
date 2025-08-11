import { useState } from 'react';

/**
 * ChatInput - Text input and send button component
 *
 * ARCHITECTURE ROLE: The "input handler"
 * - Captures user text input
 * - Validates messages (no empty sends)
 * - Handles keyboard shortcuts (Enter to send)
 * - Communicates with ChatWindow via onSendMessage callback
 */
const ChatInput = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return; // Don't send empty messages

    // Send message to ChatWindow via callback
    onSendMessage(trimmedValue);

    // Clear input field
    setInputValue('');
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    // Note: Shift+Enter could be used for new lines in future
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        {/* TEXT INPUT */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about Christine's work..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-base 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={500} // Prevent extremely long messages
          autoComplete="off"
          autoCapitalize="sentences"
          autoCorrect="on"
        />

        {/* SEND BUTTON */}
        <button
          type="submit"
          disabled={!inputValue.trim()} // Disabled when empty
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            inputValue.trim()
              ? 'bg-purple-100 text-white hover:bg-purple-200'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Send
        </button>
      </form>

      {/* HELPER TEXT */}
      <p className="text-xs text-gray-500 mt-1">Press Enter to send</p>
    </div>
  );
};

export default ChatInput;
