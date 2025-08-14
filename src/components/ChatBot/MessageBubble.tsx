import React from 'react';

/**
 * MessageBubble - Displays individual chat messages
 *
 * What this does:
 * - Shows user messages on the right (blue)
 * - Shows AI messages on the left (gray)
 * - Formats timestamps
 * - Handles text wrapping
 */

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps): React.JSX.Element => {
  const { text, isBot, timestamp } = message;

  // Format time as "2:30 PM"
  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isBot
            ? 'bg-white border border-gray-200 text-gray-800'
            : 'bg-blue-500 text-white'
        }`}
      >
        {/* Message text */}
        <p className="text-sm whitespace-pre-wrap break-words">{text}</p>

        {/* Timestamp */}
        <p
          className={`text-xs mt-1 ${
            isBot ? 'text-gray-500' : 'text-blue-100'
          }`}
        >
          {formatTime(timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
