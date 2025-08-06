"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Plus, Pin, Settings, LogOut, MoreVertical, Send, Smile, X, Check, CheckCheck } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useMemo } from 'react'
import { redirect } from 'next/navigation'
import socket from "../lib/socket"

export default function TelegramChatApp() {
  const [userId, setUserId] = useState("")
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChat, setSelectedChat] = useState(null)
  const [chats, setChats] = useState([])
  const [user, setUser] = useState(null)
  const [usersMap, setUsersMap] = useState({})
  const [open, setOpen] = useState(false)
  const [open1, setOpen1] = useState(false)
  const messagesEndRef = useRef(null)
  const [open3, setOpen3] = useState(false)
  const [errorMessage, setErrorMessage] = useState('');
  const [text,setText] = useState("")
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedChat && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [selectedChat]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

async function getUserChats() {
  const res = await fetch("/api/findChat");
  const data = await res.json();
  if (data.success) {
    setChats(data.data);
  } else {
    console.log("Eroare:", data.message);
  }
}

useEffect(() => {
  getUserChats();
}, []);

async function createChat(e) {
  e.preventDefault();
  const chatName = text;
  const res = await fetch('/api/createchat', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatName })
  });
  const data = await res.json();
  if(res.ok){
    socket.emit("chatCreated", data.data);
    setOpen3(false);
    await getUserChats(); 
  }
}

  async function fetchUser(userId) {
    const res = await fetch(`/api/getUser?userId=${userId}`)
    if (!res.ok) {
      throw new Error("Eroare la preluarea userului")
    }
    return await res.json()
  }

  useEffect(() => {
    const uniqueUserIds = [...new Set(messages.map(m => m.userId).filter(Boolean))]

    Promise.all(uniqueUserIds.map(id => fetchUser(id)))
      .then(results => {
        const newUsers = {}
        results.forEach((res, i) => {
          if (res.success) newUsers[uniqueUserIds[i]] = res.data
        })
        setUsersMap(newUsers)
      })
      .catch(err => {
        console.error("Error fetching users:", err)
      })
  }, [messages])

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

  useEffect(() => {
    socket.on("chat message", (msg) => {
      if (msg.chatId === selectedChat?._id) {
        setMessages(prev => [...prev, msg])
      }
    })

    return () => {
      socket.off("chat message")
    }
  }, [selectedChat])

  const filteredChats = useMemo(() => {
    return chats.filter(chat => 
      chat.chatName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [chats, searchQuery])

const deleteChat = async () => {
  try {
    const res = await fetch("/api/chatDelete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: selectedChat._id }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      getUserChats();    
      setOpen1(false);    
    } else {
      console.error("❌ Eroare la ștergere:", data.message);
    }

  } catch (err) {
    console.error("❌ Eroare fetch:", err);
  }
};


  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return

    const content = newMessage.trim()
    const chatId = selectedChat._id

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: content, chatId })
    })

    const json = await res.json()

    if (!res.ok || !json.success) {
      console.error("Eroare la salvare:", json.message)
      return
    }

    const savedMessage = json.data

    socket.emit("chat message", savedMessage)

    setNewMessage("")
  }

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleAddReq = async (e) => {
    e.preventDefault();

    const chatId = selectedChat._id;
    if (!userId || !chatId) return;

    let res = await fetch('/api/addUserToChat', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, userId })
    });

    const data = await res.json();

    if (res.ok) {
      setOpen(false); 
    }else{
      setErrorMessage('User inexistent/invalid')
    }
  };



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

  function handleLogout(){
    redirect("/api/logout")
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 relative">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed md:relative md:translate-x-0 z-50 w-80 md:w-80 lg:w-96
        transition-transform duration-300 bg-gray-800 dark:bg-gray-800 border-r border-gray-700
        flex flex-col overflow-hidden h-full`}>
        
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors md:hidden"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
            <h1 className="text-xl font-medium text-white">ChatUs</h1>
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
              <Plus className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" onClick={() => setOpen3(true)}/>
              <Dialog  open={open3} onOpenChange={setOpen3}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Form</DialogTitle>
                  </DialogHeader>
                    <form className="space-y-4" onSubmit={createChat}>
                      <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Group Name"
                        className="w-full border p-2 rounded"
                      />
                      <Button type="submit">Create</Button>
                    </form>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen3(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                onClick={() => handleChatSelect(chat)}
                className={`flex items-center p-3 mx-2 mb-1 hover:bg-gray-700 cursor-pointer transition-colors rounded ${
                  selectedChat?._id === chat._id ? 'bg-gray-600' : ''
                }`}
              >
                <div className="relative mr-3 flex-shrink-0">
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
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {chat.pinned && <Pin className="w-3 h-3 text-gray-400" />}
                      <span className="text-xs text-gray-500">
                        {formatTime(chat.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 truncate pr-2 flex-1">
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
                    
                    <div className="flex items-center gap-1 flex-shrink-0">
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
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                  {user?.avatar || user?.userName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
              </div>
              
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-white text-sm font-medium truncate">
                  {user?.userName || "Your Name"}
                </span>
                <span className="text-gray-400 text-xs truncate">
                  #{user?.userId || "Not Found"}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
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

      <div className="flex-1 flex flex-col min-w-0">
        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-3xl sm:text-5xl text-white">💬</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-light text-gray-700 dark:text-gray-300 mb-4">
                Select a chat to start messaging
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Choose from your existing conversations or start a new one
              </p>
              <button
                onClick={() => setSidebarOpen(true)}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors md:hidden"
              >
                Open Chats
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors md:hidden flex-shrink-0"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                    {selectedChat.avatar || selectedChat?.chatName?.charAt(0)?.toUpperCase() || ""}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h2 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      {selectedChat.chatName}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                      {selectedChat?.online
                        ? 'online'
                        : `last seen ${formatTime(messages.at(-1)?.createdAt)}`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                      </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setOpen(true)} >Add User</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpen1(true)}>Delete Chat</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialog open={open1} onOpenChange={setOpen1}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete/remove you from the chat.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setOpen1(false)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={deleteChat} >Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Dialog  open={open} onOpenChange={setOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Form</DialogTitle>
                      </DialogHeader>

                        <form className="space-y-4" onSubmit={handleAddReq}>
                          <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="User Id"
                            className="w-full border p-2 rounded"
                          />
                          <Button type="submit">Send</Button>
                        </form>
                        {errorMessage && (
                          <div className="text-red-500 text-sm mb-2">
                            {errorMessage}
                          </div>
                        )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full p-4">
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl sm:text-2xl text-white">👋</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Say hello to {selectedChat.chatName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      This is the beginning of your conversation
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 p-2 sm:p-4">
                  {messages.map((message, index) => {
                    const isFromMe = message.userId === user?.userId;
                    const showAvatar = !isFromMe && (index === 0 || messages[index - 1].userId !== message.userId);
                    const nextMessage = messages[index + 1];
                    const isConsecutive = nextMessage && nextMessage.userId === message.userId;
                    const userData = usersMap[message.userId];
                    const showSenderName = (index === 0 || messages[index - 1].userId !== message.userId);

                    return (
                      <div
                        key={message._id}
                        className={`flex ${isFromMe ? 'justify-end' : 'justify-start'} mb-1`}
                      >
                        <div className={`flex items-start gap-2 max-w-[85%] sm:max-w-[70%] md:max-w-[60%] ${
                          isFromMe ? 'flex-row-reverse' : ''
                        }`}>
                          {showAvatar && !isFromMe && (
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-medium flex-shrink-0 mt-1">
                              {message.avatar || userData?.userName?.charAt(0)?.toUpperCase() || ""}
                            </div>
                          )}
                          
                          <div className={`${!showAvatar && !isFromMe ? 'ml-9 sm:ml-10' : ''}`}>
                            {showSenderName && (
                              <div className={`mb-1 px-1 ${isFromMe ? 'text-right' : 'text-left'}`}>
                                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                                  {isFromMe ? 'You' : userData?.userName}
                                </span>
                              </div>
                            )}
                            
                            <div
                              className={`inline-block px-3 py-2 max-w-full text-sm sm:text-base ${
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
                              <p className="leading-relaxed m-0">
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
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
              <div className="flex items-end gap-2 sm:gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Write a message..."
                    className="w-full p-3 pr-12 bg-gray-100 dark:bg-gray-700 border-0 rounded-2xl sm:rounded-3xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all text-sm sm:text-base"
                    rows="1"
                    style={{
                      minHeight: '40px',
                      maxHeight: '120px',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}