import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import aiService from '../../data/ai-service.js';

/**
 * ChatWindow - The main chat interface
 *
 * ARCHITECTURE ROLE: The "brain" of the chatbot
 * - Manages all messages in the conversation
 * - Handles AI response generation
 * - Controls the chat UI layout and behavior
 * - Connects MessageBubble (display) with ChatInput (input)
 */
const ChatWindow = ({ onClose }) => {
  // STATE: All messages in the conversation
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Christine's AI assistant. Ask me about her skills, projects, or experience!",
      isBot: true,
      timestamp: new Date(),
    },
  ]);

  // STATE: Show "AI is typing..." indicator
  const [isTyping, setIsTyping] = useState(false);

  // REF: For auto-scrolling to bottom when new messages arrive
  const messagesEndRef = useRef(null);

  // EFFECT: Auto-scroll when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // FUNCTION: Add a new message to the conversation
  const addMessage = (text, isBot = false) => {
    const newMessage = {
      id: Date.now(),
      text,
      isBot,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  // FUNCTION: Handle user sending a message
  const handleSendMessage = async (userMessage) => {
    // 1. Add user message immediately
    addMessage(userMessage, false);

    // 2. Show typing indicator
    setIsTyping(true);

    try {
      // 3. Generate AI response using our AI service
      const aiResponse = await aiService.generateResponse(userMessage);

      // 4. Hide typing indicator and show AI response
      setIsTyping(false);
      addMessage(aiResponse, true);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setIsTyping(false);
      addMessage(
        "I'm having trouble responding right now. Please try asking about Christine's skills, projects, or experience!",
        true
      );
    }
  };

  return (
    <div className="w-[85vw] sm:w-80 lg:w-96 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col overflow-hidden max-w-[85vw]">
      {/* HEADER: Chat title and close button */}
      <div className="bg-gradient-to-r from-purple-100 to-purple-200 text-white p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Christine's AI Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 text-xl font-bold"
          aria-label="Close chat"
        >
          ×
        </button>
      </div>

      {/* MESSAGES AREA: Scrollable message history */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 bg-gray-50">
        {/* Render all messages using MessageBubble component */}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* TYPING INDICATOR: Shows when AI is "thinking" */}
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
            </div>
            <span className="text-sm">AI is typing...</span>
          </div>
        )}

        {/* SCROLL ANCHOR: Invisible div for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA: Where user types messages */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
