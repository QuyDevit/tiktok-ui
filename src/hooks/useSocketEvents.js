import { useRef, useEffect } from "react";
import useSocket from "./useSocket";

export default function useSocketEvents({
  onConnect,
  onReceiveMessage,
  onChatExists,
  onChatCreated,
  onChatsLoaded,
  onMessagesLoaded,
  onError,
}) {
  const handlersRef = useRef({
    onConnect,
    onReceiveMessage,
    onChatExists,
    onChatCreated,
    onChatsLoaded,
    onMessagesLoaded,
    onError,
  });

  useEffect(() => {
    handlersRef.current = {
      onConnect,
      onReceiveMessage,
      onChatExists,
      onChatCreated,
      onChatsLoaded,
      onMessagesLoaded,
      onError,
    };
  }, [
    onConnect,
    onReceiveMessage,
    onChatExists,
    onChatCreated,
    onChatsLoaded,
    onMessagesLoaded,
    onError,
  ]);

  const socketRef = useSocket({
    connect: () => {
      handlersRef.current.onConnect?.();
    },
    receive_message: (data) => {
      handlersRef.current.onReceiveMessage?.(data);
    },
    chat_exists: (chat) => {
      handlersRef.current.onChatExists?.(chat);
    },
    chat_created: (chat) => {
      handlersRef.current.onChatCreated?.(chat);
    },
    chats_loaded: (chats) => {
      handlersRef.current.onChatsLoaded?.(chats);
    },
    messages_loaded: (data) => {
      handlersRef.current.onMessagesLoaded?.(data);
    },
    error: (err) => {
      handlersRef.current.onError?.(err);
    },
  });

  return socketRef;
}
