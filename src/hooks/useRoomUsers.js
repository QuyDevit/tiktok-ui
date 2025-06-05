import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getListUserRoom } from "~/services/users/getInfoUser";
import { useCallback } from "react";

export default function useRoomUsers(currentUser, chatId) {
  const queryClient = useQueryClient();

  const { data: roomUsers = [] } = useQuery({
    queryKey: ["roomUsers", chatId],
    queryFn: async () => {
      return currentUser ? [currentUser] : [];
    },
    enabled: !!chatId,
    staleTime: 5 * 60 * 1000,
  });

  const getUserInfo = useCallback(
    (userId) => {
      if (userId === currentUser?.id) return currentUser;
      return roomUsers.find((user) => user.id === userId);
    },
    [roomUsers, currentUser]
  );

  const fetchNewUsers = useCallback(
    async (userIds) => {
      if (!chatId) return;

      const targetUserIds = [...new Set(userIds)];
      if (targetUserIds.length === 0) return;

      const filteredUserIds = targetUserIds.filter(
        (id) =>
          id !== currentUser?.id && !roomUsers.some((user) => user.id === id)
      );

      if (filteredUserIds.length > 0) {
        try {
          const response = await getListUserRoom(filteredUserIds);
          if (response.success) {
            queryClient.setQueryData(["roomUsers", chatId], (oldData = []) => {
              const currentUserData = oldData.find(
                (user) => user.id === currentUser?.id
              );
              const otherUsers = oldData.filter(
                (user) => user.id !== currentUser?.id
              );
              const newUsers = response.data.filter(
                (newUser) =>
                  !otherUsers.some(
                    (existingUser) => existingUser.id === newUser.id
                  )
              );
              return currentUserData
                ? [currentUserData, ...otherUsers, ...newUsers]
                : [...otherUsers, ...newUsers];
            });
          }
        } catch (error) {
          console.error("Error fetching new users:", error);
        }
      }
    },
    [roomUsers, currentUser, queryClient, chatId]
  );

  return {
    roomUsers,
    getUserInfo,
    fetchNewUsers,
  };
}
