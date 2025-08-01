"use client"
import { useState, useEffect, useRef } from 'react'
import { Send, Search, Menu, Phone, MoreVertical, Paperclip, Smile, Check, CheckCheck, Pin, Archive, Settings } from 'lucide-react'

export default function TelegramChatApp() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChat, setSelectedChat] = useState(null)
  const [chats, setChats] = useState([])

  
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return
    
    
    setNewMessage('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const messageDate = new Date(date)
    const diffInHours = (now - messageDate) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(messageDate)
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(messageDate)
    }
  }

  const getMessageStatus = (message) => {
    if (!message.isOwn) return null
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
    const filteredChats = chats.filter(chat =>
      chat.chatName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    getUserChats()
  }, [])




  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} 
        transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        flex flex-col overflow-hidden`}>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-xl font-medium text-gray-900 dark:text-white">Telegram</h1>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-full text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

  <div className="flex-1 overflow-y-auto">
    {chats.length === 0 ? (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        No chats found
      </div>
    ) : (
      chats.map((chat) => (
          <div
            key={chat._id} 
            onClick={() => setSelectedChat(chat)}
            className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 ${
              selectedChat?._id === chat._id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <div className="relative mr-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg">
                {chat.avatar || chat.chatName.charAt(0).toUpperCase()}
              </div>
              {chat.online && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {chat.chatName}
                </h3>
                <div className="flex items-center gap-1">
                  {chat.pinned && <Pin className="w-3 h-3 text-gray-400" />}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(chat.lastMessageTime)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate pr-2">
                  {chat.isTyping ? (
                    <span className="text-blue-500">typing...</span>
                  ) : (
                    <>
                      {chat.lastMessageFromSelf && (
                        <span className="mr-1">
                          {getMessageStatus({ isOwn: true, ...chat })}
                        </span>
                      )}
                      {chat.lastMessage}
                    </>
                  )}
                </p>
                <div className="flex items-center gap-1">
                  {chat.muted && (
                    <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                      <span className="text-xs text-white">🔇</span>
                    </div>
                  )}
                  {chat.unreadCount > 0 && (
                    <div className="min-w-[20px] h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center px-1">
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
                    {selectedChat.avatar || selectedChat.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div>
                    <h2 className="font-medium text-gray-900 dark:text-white">
                      {selectedChat.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedChat.online ? 'online' : `last seen ${formatTime(selectedChat.lastSeen)}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
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
                      Say hello to {selectedChat.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      This is the beginning of your conversation
                    </p>
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-2">
                  {messages.map((message, index) => {
                    const showAvatar = !message.isOwn && (index === 0 || messages[index - 1].isOwn || messages[index - 1].userId !== message.userId)
                    const isLastInGroup = index === messages.length - 1 || messages[index + 1].isOwn !== message.isOwn || messages[index + 1].userId !== message.userId
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} mb-1`}
                      >
                        <div className={`flex max-w-xs lg:max-w-md ${message.isOwn ? 'flex-row-reverse' : ''}`}>
                          {showAvatar && !message.isOwn && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium mr-2 mt-auto">
                              {message.avatar || message.user?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          
                          <div className={`${message.isOwn ? 'mr-2' : showAvatar ? '' : 'ml-10'}`}>
                            <div
                              className={`p-3 rounded-2xl ${
                                message.isOwn
                                  ? 'bg-blue-500 text-white rounded-br-md'
                                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-100 dark:border-gray-700 rounded-bl-md'
                              } ${isLastInGroup ? 'mb-2' : 'mb-1'}`}
                            >
                              <p className="text-sm leading-relaxed break-words">
                                {message.content || message.message}
                              </p>
                              
                              <div className={`flex items-center justify-end gap-1 mt-1 ${
                                message.isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                <span className="text-xs">
                                  {formatTime(message.timestamp || message.time)}
                                </span>
                                {getMessageStatus(message)}
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
  )
}