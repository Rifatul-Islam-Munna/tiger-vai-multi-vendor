"use client";

import type React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, ArrowDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ContactsList from "./ContactsList";
import pb from "@/lib/poacktbase";
import { useUser } from "@/hooks/useUser"; // Your custom hook
import { toast } from "sonner";

export interface Message {
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  is_seen_receiver: string;
  message: string;
  receiver: string;
  room_id: string;
  sender: string;
  updated: string;
}

const MESSAGES_PER_PAGE = 50;

export default function ChatApp() {
  const [chatData, setChatData] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const selectedContact = searchParams.get("conversationId");
  const receiverId = searchParams.get("receiverId");

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  const { data: user } = useUser(); // Get current user ID
  const currentUserId = user?.id;

  const handelPushToChat = (id: string, receiverId: string) => {
    router.push(`${pathName}?conversationId=${id}&receiverId=${receiverId}`);
  };

  useEffect(() => {
    if (selectedContact) {
      fetchChatData(1);
    }
  }, [selectedContact]);

  // Scroll to bottom function
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
    setShowScrollButton(false);
  }, []);

  // Fetch messages with pagination
  const fetchChatData = async (currentPage: number, isLoadMore = false) => {
    if (!selectedContact) return;

    try {
      setIsLoading(true);
      const result = await pb
        .collection("message")
        .getList(currentPage, MESSAGES_PER_PAGE, {
          filter: `room_id = "${selectedContact}"`,
          sort: "created", // Oldest first for proper display
        });

      setTotalItems(result.totalItems);

      if (isLoadMore) {
        // Store current scroll height before adding messages
        if (scrollAreaRef.current) {
          previousScrollHeightRef.current = scrollAreaRef.current.scrollHeight;
        }

        // Prepend older messages
        setChatData((prev) => {
          const existingIds = new Set(prev.map((msg) => msg.id));
          const newMessages = result.items.filter(
            (msg) => !existingIds.has(msg.id)
          );
          return [...(newMessages as Message[]), ...prev];
        });
      } else {
        setChatData(result.items as Message[]);
        // Scroll to bottom on initial load
        setTimeout(() => scrollToBottom("auto"), 100);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Maintain scroll position after loading older messages
  useEffect(() => {
    if (previousScrollHeightRef.current && scrollAreaRef.current) {
      const newScrollHeight = scrollAreaRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - previousScrollHeightRef.current;
      scrollAreaRef.current.scrollTop = scrollDiff;
      previousScrollHeightRef.current = 0;
    }
  }, [chatData]);

  // Handle scroll detection
  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    setIsUserScrolling(scrollTop > 0);
    setShowScrollButton(!isAtBottom && scrollTop > 100);
  }, []);

  // Initial fetch and real-time subscription
  useEffect(() => {
    if (!selectedContact) return;

    // Reset state when conversation changes
    setChatData([]);
    setPage(1);
    fetchChatData(1, false);

    // Subscribe to real-time messages
    pb.collection("message").subscribe("*", (e) => {
      console.log("Real-time message:", e.action, e.record);

      if (e.action === "create") {
        const newMessage = e.record as Message;

        // Only add if it's for this room
        if (newMessage.room_id === selectedContact) {
          setChatData((prev) => {
            // Avoid duplicates
            if (prev.some((msg) => msg.id === newMessage.id)) return prev;

            const updated = [...prev, newMessage];

            // Auto-scroll only if user sent the message
            /* if (newMessage.sender === currentUserId) {
              setTimeout(() => scrollToBottom("smooth"), 100);
            } */
            setTimeout(() => scrollToBottom("smooth"), 100);

            return updated;
          });
        }
      } else if (e.action === "update") {
        const updatedMessage = e.record as Message;
        if (updatedMessage.room_id === selectedContact) {
          setChatData((prev) =>
            prev.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      } else if (e.action === "delete") {
        setChatData((prev) => prev.filter((msg) => msg.id !== e.record.id));
      }
    });

    // Cleanup subscription
    return () => {
      pb.collection("message").unsubscribe("*");
    };
  }, [selectedContact, currentUserId, scrollToBottom]);

  // Load more older messages
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchChatData(nextPage, true);
  };

  const hasMore = chatData.length < totalItems;

  // Send message
  const handleSendMessage = async () => {
    if (
      !inputMessage.trim() ||
      !selectedContact ||
      !currentUserId ||
      !receiverId
    ) {
      return toast.error("Please enter a message.");
    }

    try {
      const newMessage = {
        room_id: selectedContact,
        sender: currentUserId,
        receiver: receiverId, // You need to determine receiver from room
        message: inputMessage.trim(),
        is_seen_receiver: "false",
      };

      await pb.collection("message").create(newMessage);
      // 2️⃣ Find chat room by room_id (NOT default id)
      const room = await pb
        .collection("chat_room")
        .getFirstListItem(`room_id = "${selectedContact}"`);

      // 3️⃣ Update chat room using its real id
      await pb.collection("chat_room").update(room.id, {
        last_message_send: new Date().toISOString(),
      });
      setInputMessage("");

      // Auto-scroll when user sends
      setTimeout(() => scrollToBottom("smooth"), 100);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Contacts List */}
      <div
        className={`
        ${selectedContact ? "hidden md:flex" : "flex"}
        w-full md:w-96 flex-col border-r border-border bg-card
      `}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h1 className="text-xl font-semibold">Chats</h1>
        </div>
        <ContactsList
          selectedContact={selectedContact}
          setSelectedContact={handelPushToChat}
        />
      </div>

      {/* Chat Area */}
      <div
        className={`
        ${selectedContact ? "flex" : "hidden md:flex"}
        flex-1 flex-col bg-background
      `}
      >
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => router.push(pathName)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-foreground">Chat Room</div>
                <div className="text-xs text-muted-foreground">Online</div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 relative overflow-hidden">
              <ScrollArea
                className="h-full p-4"
                ref={scrollAreaRef}
                onScroll={handleScroll}
              >
                <div className="flex flex-col gap-3">
                  {/* Load More Button */}
                  {hasMore && (
                    <div className="flex justify-center mb-4">
                      <Button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        variant="outline"
                        size="sm"
                      >
                        {isLoading ? "Loading..." : "Load Older Messages"}
                      </Button>
                    </div>
                  )}

                  {/* Messages */}
                  {chatData.map((message) => {
                    const isSent = message.sender === currentUserId;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isSent ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`
                            max-w-[85%] md:max-w-[70%] rounded-lg px-4 py-2
                            ${
                              isSent
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            }
                          `}
                        >
                          <p className="text-sm md:text-base break-words whitespace-pre-wrap">
                            {message.message}
                          </p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {new Date(message.created).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Scroll to Bottom Button */}
              {showScrollButton && (
                <Button
                  size="icon"
                  className="absolute bottom-4 right-4 rounded-full shadow-lg"
                  onClick={() => scrollToBottom("smooth")}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-border p-3 md:p-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
