"use client"
import { useState, useEffect, useRef } from 'react'
import { Send, Search, Menu, MoreVertical, Paperclip, Smile, Check, CheckCheck, Pin,LogOut} from 'lucide-react'
import { useMemo } from 'react'
import {  Settings, Plus } from 'lucide-react';
import { redirect } from 'next/navigation'
export default function TelegramChatApp() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChat, setSelectedChat] = useState(null)
  const [chats, setChats] = useState([])
  const [user, setUser] = useState(null)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return

    const content = newMessage.trim()
    const chatId = selectedChat._id 

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text:content, chatId })
    })
    if (!res.ok) {
      const text = await res.text()

      let error
      try {
        error = JSON.parse(text)
      } catch {
        error = { message: 'Răspuns invalid de la server', raw: text }
      }

      console.error("Eroare trimitere mesaj:", error)
      return
    }

    setNewMessage('')
  }
  function  handleLogout(){
    redirect("/api/logout")
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include' 
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Eroare API:", data.message);
          return;
        }

        setUser(data);
      } catch (err) {
        console.error("Eroare la fetch:", err);
      }
    }

    getUser();
  }, []);

  useEffect(() => {
    if (!selectedChat?._id) return;

    async function fetchMessages() {
      const res = await fetch('/api/getMessages', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: selectedChat._id })
      });

      const data = await res.json();
      
      if (data.success) {
        setMessages(data.data);
      } else {
        setMessages([]);
      }
    }

    fetchMessages();
  }, [selectedChat]);


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function formatTime(date) {
    if (!date) return "Data necunoscută";

    try {
      const messageDate = new Date(date);
      if (isNaN(messageDate.getTime())) {
        return "Data invalidă";
      }
      return new Intl.DateTimeFormat("ro-RO", {
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        day: 'numeric'
      }).format(messageDate);
    } catch (err) {
      return "Data invalidă";
    }
  }

  const getMessageStatus = (message) => {
    if (!message.userId) return null
    if (message.read) return <CheckCheck className="w-4 h-4 text-blue-500" />
    if (message.delivered) return <CheckCheck className="w-4 h-4 text-gray-400" />
    return <Check className="w-4 h-4 text-gray-400" />
  }
  
  useEffect(() => {
    async function getUserChats() {
      const res = await fetch("/api/findChat", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await res.json()
      if (data.success) {

        setChats(data.data)
      } else {
        console.log("Eroare:", data.message)
      }
    }
    getUserChats()
  }, [])

  const filteredChats = useMemo(() => {
    return chats.filter(chat => 
      chat.chatName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [chats, searchQuery])
  
return (
  <div className="flex h-screen bg-white dark:bg-gray-900">
    <div className={`${sidebarOpen ? 'w-80' : 'w-0'} 
      transition-all duration-300 bg-gray-800 dark:bg-gray-800 border-r border-gray-700 
      flex flex-col overflow-hidden`}>
      
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-xl font-medium text-white">ChatUs</h1>
          <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <Search className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations"
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border-0 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
              Connect
            </span>
            <Plus className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
          </div>
        </div>

        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No chats found
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat._id} 
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center p-3 mx-2 mb-1 hover:bg-gray-700 cursor-pointer transition-colors rounded ${
                selectedChat?._id === chat._id ? 'bg-gray-600' : ''
              }`}
            >
              <div className="relative mr-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                  {chat.avatar || chat.chatName?.charAt(0)?.toUpperCase() || ""}
                </div>
                {chat.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-200 truncate text-sm">
                    {chat.chatName}
                  </h3>
                  <div className="flex items-center gap-1">
                    {chat.pinned && <Pin className="w-3 h-3 text-gray-400" />}
                    <span className="text-xs text-gray-500">
                      {formatTime(chat.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400 truncate pr-2">
                    {chat.isTyping ? (
                      <span className="text-green-400">typing...</span>
                    ) : (
                      <>
                        {chat.lastMessageFromSelf && (
                          <span className="mr-1">
                            {getMessageStatus({ userId: true, ...chat })}
                          </span>
                        )}
                        {chat.lastMessage}
                      </>
                    )}
                  </p>
                  <div className="flex items-center gap-1">
                    {chat.muted && (
                      <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center">
                        <span className="text-xs">🔇</span>
                      </div>
                    )}
                    {chat.unreadCount > 0 && (
                      <div className="min-w-[16px] h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 bg-gray-900 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                {user?.avatar || user?.userName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-sm font-medium">{user?.userName || "Your Name"}</span>
              <span className="text-gray-400 text-xs">#{user?.userId || "Not Found"}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="flex-1 flex flex-col">
      {!selectedChat ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center max-w-md">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-5xl text-white">💬</span>
            </div>
            <h2 className="text-2xl font-light text-gray-700 dark:text-gray-300 mb-4">
              Select a chat to start messaging
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Choose from your existing conversations or start a new one
            </p>
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
              >
                Open Chats
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {!sidebarOpen && (
                  <button 
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                )}
                
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {selectedChat.avatar || selectedChat?.chatName?.charAt(0)?.toUpperCase() || ""}
                </div>
                <div>
                  <h2 className="font-medium text-gray-900 dark:text-white">
                    {selectedChat.chatName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedChat?.online
                      ? 'online'
                      : `last seen ${formatTime(messages.at(-1)?.createdAt)}`
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">👋</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Say hello to {selectedChat.chatName}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    This is the beginning of your conversation
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-0.5 px-4 sm:px-12 md:px-16 lg:px-20">
                {messages.map((message, index) => {
                  const isFromMe = message.userId === user.userId
                  const showAvatar = !isFromMe && (index === 0 || messages[index - 1].userId !== message.userId)
                  const nextMessage = messages[index + 1]
                  const isConsecutive = nextMessage && nextMessage.userId === message.userId
                  
                  return (
                    <div
                      key={message._id}
                      className={`flex ${isFromMe ? 'justify-end pr-2 sm:pr-6 md:pr-8 lg:pr-12' : 'justify-start pl-2 sm:pl-6 md:pl-8 lg:pl-12'} mb-0.5`}
                    >
                      <div className={`flex items-start gap-2 ${isFromMe ? 'flex-row-reverse max-w-xs sm:max-w-sm md:max-w-md' : 'max-w-xs sm:max-w-sm md:max-w-md'}`}>
                        {showAvatar && !isFromMe && (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-1">
                            {message.avatar || selectedChat?.chatName?.charAt(0)?.toUpperCase() || ""}
                          </div>
                        )}

                        <div className={`${!showAvatar && !isFromMe ? 'ml-11' : ''} ${isFromMe ? 'mr-0' : 'ml-0'}`}>
                          {showAvatar && (
                            <div className={`mb-1 px-1 ${isFromMe ? 'text-right' : 'text-left'}`}>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                {isFromMe ? 'You' : selectedChat.chatName}
                              </span>
                            </div>
                          )}
                          
                          <div
                            className={`inline-block px-3 py-2 max-w-full ${
                              isFromMe
                                ? `bg-blue-500 text-white shadow-sm ${
                                    isConsecutive ? 'rounded-2xl rounded-br-lg' : 'rounded-2xl rounded-br-md'
                                  }`
                                : `bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-600 ${
                                    isConsecutive ? 'rounded-2xl rounded-bl-lg' : 'rounded-2xl rounded-bl-md'
                                  }`
                            }`}
                            style={{ 
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'pre-wrap'
                            }}
                          >
                            <p className="text-sm leading-snug m-0">
                              {message.text || message.message}
                            </p>
                            
                            <div className={`flex items-center gap-1 mt-1 ${
                              isFromMe ? 'justify-end text-blue-100' : 'justify-end text-gray-400 dark:text-gray-500'
                            }`}>
                              <span className="text-xs opacity-70">
                                {formatTime(message.createdAt || message.time)}
                              </span>
                              {isFromMe && getMessageStatus(message)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-end gap-3 max-w-4xl mx-auto">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Write a message..."
                  className="w-full p-3 pr-12 bg-gray-100 dark:bg-gray-700 border-0 rounded-3xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                  rows="1"
                  style={{ 
                    minHeight: '44px', 
                    maxHeight: '120px',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                />
                
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Smile className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="w-11 h-11 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)}