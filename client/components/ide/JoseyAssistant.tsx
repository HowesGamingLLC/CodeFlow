import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Code, 
  Lightbulb, 
  Bug, 
  FileText,
  Sparkles,
  X,
  Settings,
  Volume2,
  VolumeX,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useIDEStore } from '@/lib/ide-store';
import { cn } from '@/lib/utils';

const quickActions = [
  {
    id: 'explain',
    label: 'Explain Code',
    icon: FileText,
    prompt: 'Explain this code to me',
    color: 'text-blue-400'
  },
  {
    id: 'debug',
    label: 'Debug',
    icon: Bug,
    prompt: 'Help me debug this code',
    color: 'text-red-400'
  },
  {
    id: 'optimize',
    label: 'Optimize',
    icon: Sparkles,
    prompt: 'How can I optimize this code?',
    color: 'text-purple-400'
  },
  {
    id: 'generate',
    label: 'Generate Code',
    icon: Code,
    prompt: 'Generate code for',
    color: 'text-green-400'
  }
];

const templates = [
  'Create a REST API endpoint',
  'Build a React component',
  'Write unit tests',
  'Add error handling',
  'Create a database schema',
  'Generate documentation'
];

export function JoseyAssistant() {
  const {
    joseyMessages,
    isJoseyTyping,
    sendToJosey,
    activeFileId,
    openFiles
  } = useIDEStore();

  const [input, setInput] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const activeFile = openFiles.find(f => f.id === activeFileId);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [joseyMessages, isJoseyTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendToJosey(input.trim());
    setInput('');
    setShowTemplates(false);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    let prompt = action.prompt;
    
    if (activeFile && ['explain', 'debug', 'optimize'].includes(action.id)) {
      prompt += `:\n\`\`\`${activeFile.language}\n${activeFile.content}\n\`\`\``;
    }
    
    sendToJosey(prompt);
  };

  const handleTemplate = (template: string) => {
    setInput(template);
    setShowTemplates(false);
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'code':
        return <Code className="w-4 h-4" />;
      case 'suggestion':
        return <Lightbulb className="w-4 h-4" />;
      case 'explanation':
        return <FileText className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-200">Josey</h3>
            <p className="text-xs text-gray-400">AI Assistant</p>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
            Online
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <Volume2 className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-gray-700 bg-gray-850">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction(action)}
              className="justify-start text-xs bg-gray-800 border-gray-600 hover:bg-gray-700"
            >
              <action.icon className={cn("w-3 h-3 mr-2", action.color)} />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {joseyMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'josey' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  {getMessageIcon(message.type)}
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[85%] rounded-lg p-3 group",
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-200'
                )}
              >
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  
                  {message.role === 'josey' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyMessage(message.id, message.content)}
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isJoseyTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-800 text-gray-200 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Templates */}
      {showTemplates && (
        <div className="p-3 border-t border-gray-700 bg-gray-850">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Quick Templates</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowTemplates(false)}
              className="h-4 w-4 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-1">
            {templates.map((template) => (
              <button
                key={template}
                onClick={() => handleTemplate(template)}
                className="w-full text-left text-xs p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
              >
                {template}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-850">
        <div className="flex gap-2 mb-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-xs bg-gray-800 border-gray-600 hover:bg-gray-700"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Templates
          </Button>
          {activeFile && (
            <Badge variant="outline" className="text-xs text-purple-400 border-purple-400">
              {activeFile.name}
            </Badge>
          )}
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Josey anything..."
            className="bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400"
            disabled={isJoseyTyping}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isJoseyTyping}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        
        <p className="text-xs text-gray-500 mt-2">
          Josey can help with coding, debugging, explanations, and more
        </p>
      </div>
    </div>
  );
}
