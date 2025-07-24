import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AIChat() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { chatMessages, addChatMessage } = useWorkspaceStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Mock AI responses
  const getAIResponse = (userMessage: string): string => {
    const responses = [
      "I can help you with that! Let me analyze your code and provide suggestions.",
      "Here's what I found: This looks like a React component. Would you like me to help optimize it?",
      "Great question! For your CoinKrazy app, I'd recommend using TypeScript for better type safety.",
      "I see you're working on the trading interface. Would you like me to help implement real-time price updates?",
      "That's a common pattern in React development. Here's how you can improve it...",
      "For crypto applications, security is crucial. Let me suggest some best practices.",
      "I can help you debug this issue. Can you share more details about the error you're seeing?",
      "Perfect! I'll help you implement that feature. Let's start with the component structure.",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    addChatMessage({
      role: "user",
      content: userMessage,
    });

    // Show typing indicator
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(
      () => {
        setIsTyping(false);
        addChatMessage({
          role: "assistant",
          content: getAIResponse(userMessage),
        });
      },
      1000 + Math.random() * 2000,
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatMessages, isTyping]);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-gray-200">AI Assistant</h2>
          <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
            Online
          </span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-700 text-gray-200 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your code..."
            className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
            disabled={isTyping}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
