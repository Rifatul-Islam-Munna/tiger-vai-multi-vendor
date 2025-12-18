"use client";
import React, { useEffect, useState, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import pb from "@/lib/poacktbase";
import { useUser } from "@/hooks/useUser";

export interface ChatRoom {
  buyer_id: string;
  buyer_name: string;
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  is_buyer_seen: boolean;
  is_seller_seen: boolean;
  last_message_send: string;
  room_id: string;
  seller_id: string;
  seller_name: string;
  updated: string;
}

const ITEMS_PER_PAGE = 10;

const ContactsList = ({
  selectedContact,
  setSelectedContact,
}: {
  selectedContact: string | null;
  setSelectedContact: (id: string, receiverId: string) => void;
}) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useUser();

  console.log("user", user);
  // Fetch initial rooms
  const fetchRooms = async (currentPage: number) => {
    try {
      setIsLoading(true);
      const result = await pb
        .collection("chat_room")
        .getList(currentPage, ITEMS_PER_PAGE, {
          filter: `buyer_id = "${user?.id}" || seller_id = "${user?.id}"`,
          sort: "-last_message_send", // Sort by latest message first
        });
      console.log("result", result);
      setTotalItems(result.totalItems);

      if (currentPage === 1) {
        setChatRooms(result.items as ChatRoom[]);
      } else {
        // Append new items, avoiding duplicates
        setChatRooms((prev) => {
          const existingIds = new Set(prev.map((room) => room.id));
          const newRooms = result.items.filter(
            (room) => !existingIds.has(room.id)
          );
          return [...prev, ...newRooms] as ChatRoom[];
        });
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update or add room (for real-time updates)
  const updateRoom = useCallback((updatedRoom: ChatRoom) => {
    setChatRooms((prev) => {
      const existingIndex = prev.findIndex(
        (room) => room.id === updatedRoom.id
      );

      if (existingIndex !== -1) {
        // Update existing room
        const updated = [...prev];
        updated[existingIndex] = updatedRoom;
        // Re-sort by last_message_send
        return updated.sort(
          (a, b) =>
            new Date(b.last_message_send).getTime() -
            new Date(a.last_message_send).getTime()
        );
      } else {
        // Add new room at the top
        return [updatedRoom, ...prev].sort(
          (a, b) =>
            new Date(b.last_message_send).getTime() -
            new Date(a.last_message_send).getTime()
        );
      }
    });
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    fetchRooms(1);

    // Subscribe to chat_room collection
    pb.collection("chat_room").subscribe("*", (e) => {
      console.log("Real-time update:", e.action, e.record);

      if (e.action === "create" || e.action === "update") {
        updateRoom(e.record as ChatRoom);
      } else if (e.action === "delete") {
        setChatRooms((prev) => prev.filter((room) => room.id !== e.record.id));
      }
    });

    // Cleanup subscription on unmount
    return () => {
      pb.collection("chat_room").unsubscribe("*");
    };
  }, [updateRoom]);

  // Load more handler
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRooms(nextPage);
  };

  const hasMore = chatRooms.length < totalItems;

  return (
    <ScrollArea className="flex-1">
      <div className="divide-y divide-border">
        {chatRooms.map((room) => (
          <button
            key={room.id}
            onClick={() =>
              setSelectedContact(
                room.room_id,
                room?.buyer_id === user?.id ? room?.seller_id : room?.buyer_id
              )
            }
            className={`
              w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-accent
              ${selectedContact === room.id ? "bg-accent" : ""}
            `}
          >
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarFallback>
                {room.buyer_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="font-semibold text-foreground">
                {room.buyer_name}
              </div>
              <div className="truncate text-sm text-muted-foreground">
                {new Date(room.last_message_send).toLocaleString()}
              </div>
            </div>
            {!room.is_seller_seen && (
              <div className="h-2 w-2 rounded-full bg-blue-500" />
            )}
          </button>
        ))}
      </div>

      {hasMore && (
        <div className="p-4">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {chatRooms.length === 0 && !isLoading && (
        <div className="p-8 text-center text-muted-foreground">
          No chat rooms found
        </div>
      )}
    </ScrollArea>
  );
};

export default ContactsList;
