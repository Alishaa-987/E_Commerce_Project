import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllConversationsUser, getAllConversationsSeller } from "../../redux/actions/conversation";
import { createMessage, getAllMessages } from "../../redux/actions/message";
import { FiSend, FiUser, FiMoreVertical, FiImage, FiSmile, FiMessageSquare } from "react-icons/fi";
import { format } from "timeago.js";
import axios from "axios";
import { server } from "../../server";
import { toAbsoluteAssetUrl } from "../../utils/marketplace";

const Inbox = ({ isSeller }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const conversationIdParam = searchParams.get("conversationId");

  const { user } = useSelector((state) => state.user);
  const { currentSeller } = useSelector((state) => state.seller);
  const { conversations, isLoading } = useSelector((state) => state.conversations);
  const { messages } = useSelector((state) => state.messages);

  const [open, setOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef(null);

  const userId = isSeller ? currentSeller?._id : user?._id;

  useEffect(() => {
    if (isSeller) {
      dispatch(getAllConversationsSeller(userId));
    } else {
      dispatch(getAllConversationsUser(userId));
    }
  }, [dispatch, isSeller, userId]);

  useEffect(() => {
    if (conversations && conversationIdParam && !currentChat) {
      const targetChat = conversations.find((c) => c._id === conversationIdParam);
      if (targetChat) {
        setCurrentChat(targetChat);
        setOpen(true);
      }
    }
  }, [conversations, conversationIdParam, currentChat]);

  useEffect(() => {
    if (currentChat) {
      dispatch(getAllMessages(currentChat._id));
    }
  }, [dispatch, currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage === "") return;

    const messagePayload = {
      sender: userId,
      text: newMessage,
      conversationId: currentChat._id,
    };

    dispatch(createMessage(messagePayload));

    // Update last message in conversation
    try {
        await axios.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
            lastMessage: newMessage,
            lastMessageId: userId
        }, { withCredentials: true });
    } catch (error) {
        console.log(error);
    }

    setNewMessage("");
  };

  return (
    <div className="flex h-[600px] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#111114] shadow-2xl">
      {/* Sidebar: Conversation List */}
      <div className={`w-full border-r border-white/10 md:w-80 ${open ? "hidden md:block" : "block"}`}>
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-Playfair font-semibold text-white">Messages</h2>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-[#0b0b0d]">
                {conversations?.length || 0}
            </div>
          </div>
          <p className="text-xs text-white/40 mt-1">Connect with {isSeller ? "buyers" : "sellers"}</p>
        </div>
        <div className="h-[calc(600px-80px)] overflow-y-auto custom-scrollbar">
          {conversations && conversations.length > 0 ? (
            conversations.map((item, index) => (
              <ConversationList
                key={index}
                item={item}
                index={index}
                userId={userId}
                setCurrentChat={setCurrentChat}
                setOpen={setOpen}
                isSeller={isSeller}
                active={currentChat?._id === item._id}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <FiSend className="text-white/20" size={20} />
              </div>
              <p className="text-sm text-white/40">No conversations yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex flex-1 flex-col bg-[#0b0b0d]/30 ${!open ? "hidden md:flex" : "flex"}`}>
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-emerald-300/10 flex items-center justify-center text-emerald-300 border border-emerald-300/20">
                        <FiUser size={20} />
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#111114] bg-emerald-400"></span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Chatting...</h3>
                  <p className="text-[10px] uppercase tracking-wider text-emerald-400">Active now</p>
                </div>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="md:hidden text-white/40 hover:text-white transition"
              >
                Back
              </button>
              <button className="hidden md:block text-white/40 hover:text-white transition">
                <FiMoreVertical size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-4">
              {messages && messages.map((item, index) => (
                <div
                  key={index}
                  ref={scrollRef}
                  className={`flex ${item.sender === userId ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    item.sender === userId
                      ? "bg-emerald-300 text-[#0b0b0d] rounded-tr-none shadow-lg shadow-emerald-500/10"
                      : "bg-white/5 text-white/90 border border-white/10 rounded-tl-none"
                  }`}>
                    <p className="leading-relaxed">{item.text}</p>
                    <p className={`mt-1 text-[9px] ${item.sender === userId ? "text-[#0b0b0d]/50" : "text-white/30"}`}>
                      {format(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="border-t border-white/10 p-4">
              <div className="relative flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 transition-focus focus-within:border-emerald-300/30">
                <button type="button" className="p-2 text-white/30 hover:text-white transition">
                    <FiImage size={18} />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent px-2 py-1.5 text-sm text-white placeholder:text-white/20 focus:outline-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="button" className="p-2 text-white/30 hover:text-white transition">
                    <FiSmile size={18} />
                </button>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="rounded-xl bg-emerald-300 p-2 text-[#0b0b0d] transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <FiSend size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center">
            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <FiMessageSquare className="text-white/10" size={32} />
            </div>
            <h3 className="text-xl font-Playfair font-semibold text-white">Your Workspace Chat</h3>
            <p className="mt-2 max-w-xs text-sm text-white/30">Select a conversation from the list to start messaging with your {isSeller ? "customers" : "sellers"}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ConversationList = ({ item, index, userId, setCurrentChat, setOpen, isSeller, active }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const otherUserId = item.members.find((id) => id !== userId);
    const getUserData = async () => {
      try {
        const endpoint = isSeller ? `user/user-info/${otherUserId}` : `seller/get-seller-info/${otherUserId}`;
        const res = await axios.get(`${server}/${endpoint}`);
        setUserData(isSeller ? res.data.user : res.data.seller);
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, [userId, item, isSeller]);

  const avatar = toAbsoluteAssetUrl(userData?.avatar || userData?.image || "");
  const name = isSeller ? userData?.name : userData?.shopName || userData?.name || "Loading...";

  return (
    <div
      className={`group relative flex cursor-pointer items-center gap-3 p-4 transition-all duration-200 ${
        active ? "bg-white/5 border-l-4 border-emerald-300" : "hover:bg-white/5 border-l-4 border-transparent"
      }`}
      onClick={() => {
        setCurrentChat(item);
        setOpen(true);
      }}
    >
      <div className="relative">
        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 border border-white/10 group-hover:border-white/20">
            {avatar && !avatar.includes("undefined") && !avatar.endsWith("/") ? (
                <img src={avatar} className="h-full w-full rounded-full object-cover" />
            ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white/5 text-xs font-bold text-white/30 uppercase">
                    {name?.charAt(0) || "?"}
                </div>
            )}
        </div>
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#111114] bg-emerald-400"></span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="truncate text-sm font-semibold text-white group-hover:text-emerald-200">
            {name}
          </h4>
          <span className="shrink-0 text-[10px] text-white/30">{format(item.updatedAt)}</span>
        </div>
        <p className="mt-1 truncate text-xs text-white/40 leading-tight">
          {item.lastMessageId === userId ? "You: " : ""}{item.lastMessage || "Start a conversation..."}
        </p>
      </div>
    </div>
  );
};

export default Inbox;
