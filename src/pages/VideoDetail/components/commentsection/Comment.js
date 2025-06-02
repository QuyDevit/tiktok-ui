import clsx from "clsx";
import styles from "./Comment.module.scss";
import CommentItem from "./CommentItem";
import { useEffect, useState } from "react";
import {
  commentvideo,
  loadcommendetail,
  loadcomment,
} from "~/services/videos/videoService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { updateVideo, selectVideos } from "~/store/features/videoListSlice";

export default function Comment({
  currentUser,
  videoDetail: initialVideoDetail,
  isModal = false,
}) {
  const [content, setContent] = useState("");
  const [commentId, setCommentId] = useState(null);
  const [videoDetail, setVideoDetail] = useState(initialVideoDetail);
  const [loadingReplies, setLoadingReplies] = useState({});
  const [repliesState, setRepliesState] = useState({});
  const [hiddenReplies, setHiddenReplies] = useState({});
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const videos = useSelector(selectVideos);

  useEffect(() => {
    const updatedVideo = videos.find(
      (video) => video.id === initialVideoDetail?.id
    );
    if (updatedVideo) {
      setVideoDetail(updatedVideo);
    }
  }, [videos, initialVideoDetail?.id]);

  const { data: comments = [], isLoading: isLoadingComments } = useQuery({
    queryKey: ["comments", videoDetail?.id],
    queryFn: async () => {
      const result = await loadcomment(videoDetail?.id, null);
      return result.success ? result.data : [];
    },
    enabled: !!videoDetail?.id,
    staleTime: 5 * 60 * 1000,
  });

  const commentMutation = useMutation({
    mutationFn: () => commentvideo(videoDetail?.id, content, commentId),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.setQueryData(["comments", videoDetail?.id], (oldData) => {
          if (!oldData) return [result.data];

          const newComment = {
            ...result.data,
            user: currentUser,
            replies: [],
          };
          // Nếu không có commentId (comment gốc)
          if (!commentId) {
            return [newComment, ...oldData];
          }
          // Nếu có commentId (reply comment)
          return oldData.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [newComment, ...(comment.replies || [])],
                replyCount: (comment.replyCount || 0) + 1,
              };
            }
            return comment;
          });
        });

        const updatedVideo = {
          ...videoDetail,
          commentsCount: (videoDetail.commentsCount || 0) + 1,
        };
        dispatch(updateVideo(updatedVideo));

        setContent("");
        setCommentId(null);
      }
    },
    onError: (error) => {
      console.error("Comment error:", error);
    },
  });

  const loadRepliesMutation = useMutation({
    mutationFn: ({ commentId, lastCreatedAt = null }) =>
      loadcommendetail(commentId, lastCreatedAt),
    onSuccess: (result, variables) => {
      if (result.success) {
        const { commentId } = variables;
        queryClient.setQueryData(["comments", videoDetail?.id], (oldData) => {
          if (!oldData) return [];

          return oldData.map((comment) => {
            if (comment.id === commentId) {
              const existingReplies = comment.replies || [];
              const newReplies = result.data || [];

              // Lọc bỏ các reply đã tồn tại để tránh duplicate
              const filteredNewReplies = newReplies.filter(
                (newReply) =>
                  !existingReplies.some(
                    (existing) => existing.id === newReply.id
                  )
              );

              return {
                ...comment,
                replies: [...existingReplies, ...filteredNewReplies],
              };
            }
            return comment;
          });
        });

        // Cập nhật trạng thái hasMore và lastCreatedAt
        setRepliesState((prev) => ({
          ...prev,
          [commentId]: {
            hasMore: result.hasMore,
            lastCreatedAt: result.lastCreatedAt,
          },
        }));
      }
      setLoadingReplies((prev) => ({ ...prev, [variables.commentId]: false }));
    },
    onError: (error, variables) => {
      console.error("Load replies error:", error);
      setLoadingReplies((prev) => ({ ...prev, [variables.commentId]: false }));
    },
  });

  const handleComment = () => {
    if (!content.trim()) return;
    commentMutation.mutate();
  };
  const handleLoadCommentDetail = (commentId) => {
    const currentState = repliesState[commentId];
    const lastCreatedAt = currentState?.lastCreatedAt || null;

    setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
    loadRepliesMutation.mutate({ commentId, lastCreatedAt });
  };

  const handleReplyToComment = (parentCommentId) => {
    setCommentId(parentCommentId);
  };

  const handleCancelReply = () => {
    setCommentId(null);
    setContent("");
  };

  const handleToggleReply = (commentId) => {
    setHiddenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <section
      className={clsx(styles.container)}
      style={isModal ? undefined : { maxWidth: "unset", height: "unset" }}
    >
      <div className={clsx(styles.header)}>
        <div className={clsx(styles.headerTitle)}>
          <h3>Bình luận</h3>
          <h4>({videoDetail?.commentsCount || 0})</h4>
        </div>
      </div>
      {!isModal && currentUser && (
        <div className={clsx(styles.divFooter)}>
          <div className={clsx(styles.inputWraper)}>
            {commentId && (
              <div className={clsx(styles.replyIndicator)}>
                <span>Đang trả lời bình luận</span>
                <button
                  onClick={handleCancelReply}
                  className={clsx(styles.cancelReply)}
                >
                  Hủy
                </button>
              </div>
            )}
            <input
              className={clsx(styles.inputForm)}
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && content.trim()) {
                  handleComment();
                }
              }}
              placeholder="Thêm bình luận"
            />
            <button
              className={clsx(styles.btnPost, content.trim() && styles.enable)}
              type="button"
              disabled={!content.trim()}
              onClick={handleComment}
            >
              Đăng
            </button>
          </div>
        </div>
      )}
      <div className={clsx(styles.divMain)}>
        <div className={clsx(styles.divListContainer)}>
          {isLoadingComments ? (
            <div className={clsx(styles.loadingContainer)}>
              Đang tải bình luận...
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment, index) => (
              <div
                key={`comment-${comment.id || index}`}
                className={clsx(styles.objectWrapper)}
              >
                <CommentItem
                  data={comment}
                  onReply={() => handleReplyToComment(comment.id)}
                  currentUser={currentUser}
                />

                {comment?.replyCount > 0 && (
                  <div className={clsx(styles.divReplyContainer)}>
                    {comment.replies &&
                      comment.replies.length > 0 &&
                      !hiddenReplies[comment.id] && (
                        <div>
                          {comment.replies.map((reply, replyIndex) => (
                            <CommentItem
                              key={`reply-${reply.id || replyIndex}`}
                              isParrent={false}
                              data={reply}
                              currentUser={currentUser}
                            />
                          ))}
                        </div>
                      )}
                    <div className={clsx(styles.divViewReplyContainer)}>
                      <div className={clsx(styles.spaceRelies)}></div>
                      {!comment.replies || comment.replies.length === 0 ? (
                        <div
                          className={clsx(styles.divViewMoreOption)}
                          onClick={() => handleLoadCommentDetail(comment.id)}
                        >
                          {loadingReplies[comment.id]
                            ? "Đang tải..."
                            : `Xem ${comment.replyCount} câu trả lời`}
                        </div>
                      ) : repliesState[comment.id]?.hasMore ? (
                        <div
                          className={clsx(styles.divViewMoreOption)}
                          onClick={() => handleLoadCommentDetail(comment.id)}
                        >
                          {loadingReplies[comment.id]
                            ? "Đang tải..."
                            : `Xem thêm ${
                                comment.replyCount - comment.replies.length
                              } câu trả lời`}
                        </div>
                      ) : (
                        <div
                          className={clsx(styles.divViewMoreOption)}
                          onClick={() => handleToggleReply(comment.id)}
                        >
                          {hiddenReplies[comment.id]
                            ? "Xem bình luận"
                            : "Ẩn bớt"}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={clsx(styles.noCommentsContainer)}>
              Chưa có bình luận nào.
            </div>
          )}
        </div>
      </div>
      {isModal && (
        <div className={clsx(styles.divFooter)}>
          {currentUser ? (
            <div className={clsx(styles.inputWraper)}>
              {commentId && (
                <div className={clsx(styles.replyIndicator)}>
                  <span>Đang trả lời bình luận</span>
                  <button
                    onClick={handleCancelReply}
                    className={clsx(styles.cancelReply)}
                  >
                    Hủy
                  </button>
                </div>
              )}
              <input
                className={clsx(styles.inputForm)}
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && content.trim()) {
                    handleComment();
                  }
                }}
                placeholder="Thêm bình luận"
              />
              <button
                className={clsx(
                  styles.btnPost,
                  content.trim() && styles.enable
                )}
                type="button"
                disabled={!content.trim()}
                onClick={handleComment}
              >
                Đăng
              </button>
            </div>
          ) : (
            <div
              style={{
                paddingTop: 4,
                color: "var(--primary)",
                textAlign: "center",
              }}
            >
              Vui lòng đăng nhập
            </div>
          )}
        </div>
      )}
    </section>
  );
}
