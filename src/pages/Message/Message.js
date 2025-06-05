import clsx from "clsx";
import styles from "./Message.module.scss";
import {
  AddGroupIcon,
  AddPersonIcon,
  EmojiIcon,
  SearchIcon,
  SendIcon,
} from "~/components/Icons";
import ChatItem from "~/components/ChatItem";
import Image from "~/components/Image";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useState, useRef, useCallback } from "react";
import MessageItem from "~/components/MessageItem";
import TextareaAutosize from "react-textarea-autosize";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getListFriend, getListUserRoom } from "~/services/users/getInfoUser";
import ChatMemberModal from "~/components/ChatMemberModal";
import { useDispatch, useSelector } from "react-redux";
import { show } from "~/store/features/alertSlice";
import { selectIsAuthChecking, selectUser } from "~/store/features/authSlice";
import images from "~/assets/images";
import useRoomUsers from "~/hooks/useRoomUsers";
import routes from "~/config/routes";
import useSocketEvents from "~/hooks/useSocketEvents";

function Message() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthChecking = useSelector(selectIsAuthChecking);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalType, setModalType] = useState("group");
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const [friends, setFriends] = useState([]);

  const [messages, setMessages] = useState([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [chats, setChats] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [targetChat, setTargetChat] = useState(null);
  const chatContainerRef = useRef(null);
  const friendsRef = useRef([]);
  const [extraUsers, setExtraUsers] = useState({});
  const [targetMember, setTargetMember] = useState(null);
  const userId = searchParams.get("u") || null;
  const currentUser = useSelector(selectUser);

  useEffect(() => {
    if (!isAuthChecking && !currentUser) {
      navigate(routes.login);
    }
  }, [currentUser, isAuthChecking, navigate]);

  useEffect(() => {
    if (!userId) return;

    const fetchAndCreateChat = async () => {
      try {
        const result = await getListUserRoom([userId]);
        if (result?.success) {
          setExtraUsers((prev) => ({
            ...prev,
            [userId]: result.data[0],
          }));

          socketRef.current.emit("create_chat", {
            memberIds: [userId],
            isGroupChat: false,
          });
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          dispatch(show("Không tìm thấy người dùng này"));
        }
      }
    };
    fetchAndCreateChat();
  }, [userId, dispatch]);

  const fetchFriends = useCallback(async () => {
    const result = await getListFriend();
    if (result.success) {
      setFriends(result.data);
      friendsRef.current = result.data;
    }
    return [];
  }, []);

  const { getUserInfo, fetchNewUsers } = useRoomUsers(
    currentUser,
    targetChat?._id
  );

  const handleConnect = useCallback(() => {
    fetchFriends().then(() => {
      socketRef.current.emit("load_chats");
    });
  }, [fetchFriends]);

  const handleReceiveMessage = useCallback(
    (data) => {
      if (!data) return;

      fetchNewUsers([data.mess.senderId]);

      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat._id === data.chatId) {
            return {
              ...chat,
              latestMessage: data.mess,
            };
          }
          return chat;
        });
      });

      if (targetChat && data.chatId === targetChat._id) {
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some(
            (msg) => msg._id === data.mess._id
          );

          if (messageExists) return prevMessages;

          const newMessages = [...prevMessages, data.mess].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );

          return newMessages;
        });

        setTimeout(() => {
          const chatContainer = chatContainerRef.current;
          if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
          }
        }, 100);
      }
    },
    [targetChat, fetchNewUsers]
  );

  const handleChatExists = useCallback(
    (chat) => {
      if (!chat) return;

      if (!chat.isGroupChat && userId) {
        const targetUser = extraUsers[userId] || null;
        setTargetMember(targetUser);
      }

      handleTargetChat(chat);
    },
    [userId, extraUsers]
  );

  const handleChatCreated = useCallback((chat) => {
    if (!chat) return;
    setChats((prevChats) => [chat, ...prevChats]);
  }, []);

  const handleChatsLoaded = useCallback(async (chats) => {
    if (!Array.isArray(chats)) return;
    setChats(chats);

    const oneOnOneUserIds = chats
      .filter((chat) => !chat.isGroupChat)
      .map((chat) => chat.members.find((id) => id !== currentUser?.id))
      .filter(Boolean);

    const friendIds = friendsRef.current.map((f) => f.id);
    const unknownUserIds = oneOnOneUserIds.filter(
      (id) => !friendIds.includes(id)
    );

    if (unknownUserIds.length > 0) {
      const res = await getListUserRoom(unknownUserIds);
      if (res.success) {
        const fetched = {};
        res.data.forEach((user) => {
          fetched[user.id] = user;
        });
        setExtraUsers((prev) => ({ ...prev, ...fetched }));
      }
    }
  }, []);

  const handleMessagesLoaded = useCallback(
    (data) => {
      if (!Array.isArray(data.messages)) return;

      const newSenderIds = [
        ...new Set(data.messages.map((msg) => msg.senderId)),
      ];

      fetchNewUsers(newSenderIds);

      setMessages((prevMessages) => {
        const existingMessages = new Map(
          prevMessages.map((msg) => [msg._id, msg])
        );

        data.messages.forEach((msg) => {
          if (!existingMessages.has(msg._id)) {
            existingMessages.set(msg._id, msg);
          }
        });

        const newMessages = Array.from(existingMessages.values()).sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        setHasMoreMessages(data.hasMore);
        setIsLoading(false);
        return newMessages;
      });
    },
    [fetchNewUsers]
  );

  const handleError = useCallback(
    (err) => {
      dispatch(show(err.message));
    },
    [dispatch]
  );

  const socketRef = useSocketEvents({
    onConnect: handleConnect,
    onReceiveMessage: handleReceiveMessage,
    onChatExists: handleChatExists,
    onChatCreated: handleChatCreated,
    onChatsLoaded: handleChatsLoaded,
    onMessagesLoaded: handleMessagesLoaded,
    onError: handleError,
  });

  const loadMoreMessages = () => {
    if (!targetChat || isLoading || !hasMoreMessages) return;
    setIsLoading(true);
    socketRef.current.emit("load_messages", {
      chatId: targetChat._id,
      skip: messages.length,
      limit: 10,
    });
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      if (chatContainer.scrollTop <= 10 && !isLoading && hasMoreMessages) {
        loadMoreMessages();
      }
    };

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, [targetChat, isLoading, hasMoreMessages, messages.length]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer && messages.length > 0) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleSelectMembers = (selectedMembers) => {
    if (selectedMembers.length <= 0) {
      dispatch(show("Vui lòng chọn thành viên!"));
      return;
    }
    if (modalType === "group") {
      if (!groupName) {
        dispatch(show("Vui lòng nhập tên nhóm!"));
        return;
      }

      socketRef.current.emit("create_chat", {
        memberIds: selectedMembers,
        isGroupChat: true,
        chatName: groupName,
      });
    } else {
      socketRef.current.emit("create_chat", {
        memberIds: selectedMembers,
        isGroupChat: false,
      });
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const sendMessage = () => {
    if (!message.trim() || !targetChat?._id) return;

    socketRef.current.emit("private_message", {
      chatId: targetChat._id,
      content: message.trim(),
    });

    setMessage("");
  };

  const handleTargetChat = useCallback(
    (chat) => {
      if (!chat) return;

      setMessages([]);
      setHasMoreMessages(true);
      setIsLoading(true);

      if (!chat.isGroupChat) {
        const otherId = chat.members.find((id) => id !== currentUser?.id);

        const targetUser =
          friendsRef.current.find((friend) => friend.id === otherId) ||
          extraUsers[otherId] ||
          null;

        setTargetMember(targetUser);
      }

      setTargetChat(chat);

      socketRef.current.emit("load_messages", {
        chatId: chat._id,
        limit: 10,
        skip: 0,
      });
    },
    [currentUser?.id, extraUsers]
  );

  const getMessageSender = (message) => {
    if (!message?.senderId) return null;
    return getUserInfo(message.senderId);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className={clsx(styles.container)}>
      {isOpenModal && (
        <ChatMemberModal
          isOpen={isOpenModal}
          onClose={() => {
            setIsOpenModal(false);
            setGroupName("");
          }}
          data={friends}
          type={modalType}
          onSelectMembers={handleSelectMembers}
        />
      )}
      <div className={clsx(styles.contentWrapper)}>
        <div className={clsx(styles.divLeft)}>
          <div className={clsx(styles.header)}>
            <h1 className={clsx(styles.headerTitle)}>Tin nhắn</h1>
            <div className={clsx(styles.actionsChat)}>
              <button
                className={clsx(styles.btnAction)}
                onClick={() => {
                  setModalType("single");
                  setIsOpenModal(true);
                }}
              >
                <AddPersonIcon width="2.2rem" height="2.2rem" />
              </button>
              <button
                className={clsx(styles.btnAction)}
                onClick={() => {
                  setModalType("group");
                  setIsOpenModal(true);
                }}
              >
                <AddGroupIcon width="2.8rem" height="2.8rem" />
              </button>
            </div>
          </div>

          <div className={clsx(styles.inputContainer)}>
            <SearchIcon width="2rem" height="2rem" />
            <input
              type="text"
              className={clsx(styles.inputForm)}
              placeholder="Tìm kiếm"
            />
          </div>
          <div className={clsx(styles.divListChatContainer)}>
            {chats.map((chat, index) => {
              let chatUser = null;

              if (!chat.isGroupChat) {
                const otherUserId = chat.members.find(
                  (id) => id !== currentUser?.id
                );

                chatUser =
                  friends.find((friend) => friend.id === otherUserId) ||
                  extraUsers[otherUserId] ||
                  null;
              }

              const isActive = Boolean(
                targetChat && targetChat._id === chat._id
              );

              return (
                <ChatItem
                  key={chat._id || `chat-${index}`}
                  data={chat}
                  user={chatUser}
                  onClick={() => handleTargetChat(chat)}
                  isActive={isActive}
                />
              );
            })}
          </div>
        </div>
        <div className={clsx(styles.divRight)}>
          {targetChat ? (
            <>
              <div className={clsx(styles.headerChat)}>
                <div className={clsx(styles.avatar)}>
                  <Image
                    src={
                      targetChat?.isGroupChat
                        ? images.noImage
                        : targetMember
                        ? targetMember.avatar
                        : images.noImage
                    }
                    alt={
                      targetChat?.isGroupChat
                        ? targetChat?.name
                        : targetMember?.fullName
                    }
                  />
                  <div className={clsx(styles.status)}></div>
                </div>

                <div className={clsx(styles.headerInfo)}>
                  <p className={clsx(styles.userName)}>
                    {targetChat?.isGroupChat
                      ? targetChat?.name
                      : targetMember?.fullName}
                  </p>
                  <p className={clsx(styles.nickName)}>
                    {targetChat?.isGroupChat
                      ? `${targetChat?.members?.length} thành viên`
                      : `@${targetMember?.nickname}`}
                  </p>
                </div>
              </div>
              <div className={clsx(styles.divChatMain)}>
                <div
                  ref={chatContainerRef}
                  className={clsx(styles.divChatMainContent)}
                >
                  {isLoading && (
                    <div className={clsx(styles.loading)}>
                      <p>Đang tải...</p>
                    </div>
                  )}
                  {messages.length > 0 ? (
                    messages.map((mess) => {
                      const sender = getMessageSender(mess);
                      return (
                        <MessageItem
                          key={mess._id}
                          data={mess}
                          user={sender}
                          isRight={mess.senderId === currentUser?.id}
                        />
                      );
                    })
                  ) : (
                    <div className={clsx(styles.noMessages)}>
                      <p>Chưa có tin nhắn nào</p>
                    </div>
                  )}
                </div>
              </div>
              <div className={clsx(styles.divChatBottom)}>
                <div className={clsx(styles.inputWrapper)}>
                  <TextareaAutosize
                    className={clsx(styles.inputSend)}
                    value={message}
                    minRows={1}
                    maxRows={4}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Gửi tin nhắn..."
                  ></TextareaAutosize>
                  <div className={clsx(styles.moreAction)}>
                    <div
                      onClick={() => setIsOpenEmoji(!isOpenEmoji)}
                      className={clsx(styles.iconStyle)}
                    >
                      <EmojiIcon />
                    </div>
                    {isOpenEmoji && (
                      <div className={clsx(styles.emojiPickerWrapper)}>
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </div>
                  <button
                    className={clsx(styles.sendBtn)}
                    onClick={sendMessage}
                    disabled={!message}
                  >
                    <SendIcon />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={clsx(styles.noChatSelected)}>
              <p>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Message;
