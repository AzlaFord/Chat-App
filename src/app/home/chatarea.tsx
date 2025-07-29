"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Send, Phone, Video, MoreVertical, Paperclip, Smile } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  isRead?: boolean;
}

interface ChatAreaProps {
  chatName?: string;
  chatAvatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export default function ChatArea({ 
  chatName = "Select a chat", 
  chatAvatar, 
  isOnline, 
  lastSeen,
  messages, 
  onSendMessage 
}: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-chat-bg">
      {/* Chat Header */}
      <div className="bg-background border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {chatAvatar && (
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={chatAvatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {chatName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
              )}
            </div>
          )}
          <div>
            <h2 className="font-semibold">{chatName}</h2>
            {isOnline !== undefined && (
              <p className="text-sm text-muted-foreground">
                {isOnline ? "online" : lastSeen ? `last seen ${lastSeen}` : "offline"}
              </p>
            )}
          </div>
        </div>

        {chatAvatar && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && chatAvatar ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a chat to start messaging</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.isSent ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl",
                  message.isSent
                    ? "bg-message-sent text-message-sent-text ml-12 rounded-br-md"
                    : "bg-message-received text-message-received-text mr-12 rounded-bl-md border"
                )}
              >
                <p className="text-sm">{message.text}</p>
                <div className={cn(
                  "flex items-center gap-1 mt-1",
                  message.isSent ? "justify-end" : "justify-start"
                )}>
                  <span className={cn(
                    "text-xs",
                    message.isSent ? "text-message-sent-text/70" : "text-message-received-text/70"
                  )}>
                    {message.timestamp}
                  </span>
                  {message.isSent && (
                    <div className={cn(
                      "text-xs",
                      message.isRead ? "text-blue-300" : "text-message-sent-text/70"
                    )}>
                      ✓✓
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      {chatAvatar && (
        <div className="p-4 bg-background border-t border-border">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write a message..."
                className="pr-10 bg-chat-input border-border"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              onClick={handleSend}
              size="icon"
              disabled={!newMessage.trim()}
              className="bg-primary hover:bg-primary-dark"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}