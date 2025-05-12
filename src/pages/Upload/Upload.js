import clsx from "clsx";
import styles from "./Upload.module.scss";
import {
  AtsignIcon,
  BulbIcon,
  FormatIcon,
  FullscreenIcon,
  HashtagIcon,
  HDIcon,
  MockFullscreenIcon,
  MusicIcon,
  PlayIcon,
  PlusRedIcon,
  UploadIcon,
  VideoIcon,
  VolumeOffIcon,
  PauseIcon,
  VolumeOnIcon,
} from "~/components/Icons";
import Button from "~/components/Button";
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import images from "~/assets/images";
import Image from "~/components/Image";
import { useSelector } from "react-redux";
import { selectUser } from "~/store/features/authSlice";
import SelectOption from "~/components/SelectOption";
import routes, { pagesTitle } from "~/config/routes";
import * as postVideoService from "~/services/videos/postVideoService";
import { useDispatch } from "react-redux";
import { show } from "~/store/features/alertSlice";
import * as helper from "~/helpers";

const OPTIONS = [
  { code: "public", text: "Mọi người" },
  { code: "friends", text: "Bạn bè" },
  { code: "private", text: "Chỉ mình tôi" },
];

function Upload() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [caption, setCaption] = useState("");
  const [videoInfo, setVideoInfo] = useState({
    name: "",
    size: 0,
    type: "",
  });
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedTime, setSelectedTime] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [viewable, setViewable] = useState("public");
  const [allows, setAllows] = useState(["comment", "duet", "connect"]);
  const [isCopyrightCheck, setIsCopyrightCheck] = useState(false);
  const containerRef = useRef(null);
  const fileRef = useRef();
  const videoRef = useRef();
  const thumbnailVideoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    document.title = pagesTitle[routes.upload];
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoClick = (e) => {
    e.stopPropagation();
    if (e.target === videoRef.current && !document.fullscreenElement) {
      handlePlayPause();
    }
  };

  const handleControlClick = (e) => {
    e.stopPropagation();
    if (
      e.target.closest(`.${styles.playBtn}`) ||
      e.target.closest(`.${styles.volumeBtn}`) ||
      e.target.closest(`.${styles.fullscreenBtn}`)
    ) {
      return;
    }
    if (!document.fullscreenElement) {
      handlePlayPause();
    }
  };

  const handleFullscreenClick = (e) => {
    e.stopPropagation();
    if (document.fullscreenElement) {
      handlePlayPause();
    }
  };

  const handleVolume = () => {
    if (videoRef.current.muted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleTimeUpdate = () => {
    const progress =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgressWidth(progress);
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleProgressBarClick = (e) => {
    e.stopPropagation();
    const progressBar = e.currentTarget;
    const clickPosition =
      (e.clientX - progressBar.getBoundingClientRect().left) /
      progressBar.offsetWidth;
    const newTime = clickPosition * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgressWidth(clickPosition * 100);
    if (!isPlaying) {
      videoRef.current.pause();
    }
  };

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const wasPlaying = !videoRef.current.paused;
        await videoRef.current.requestFullscreen();
        if (wasPlaying) {
          await videoRef.current.play();
        }
      } else {
        const wasPlaying = !videoRef.current.paused;
        await document.exitFullscreen();
        if (wasPlaying) {
          await videoRef.current.play();
        }
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  const handleUploadClick = () => {
    fileRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setVideo(file);
      setVideoInfo({
        name: file.name,
        size: file.size,
        type: file.type,
      });
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setCaption(nameWithoutExt);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setVideo(file);
      setVideoInfo({
        name: file.name,
        size: file.size,
        type: file.type,
      });
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setCaption(nameWithoutExt);
    }
  };

  const handleCaptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setCaption(value);
    }
  };

  const handleCancelVideo = () => {
    setVideo(null);
    setVideoUrl("");
    setCaption("");
    setVideoInfo({
      name: "",
      size: 0,
      type: "",
    });
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setThumbnails([]);
    setProgressWidth(0);
    setCurrentTime(0);
    setDuration(0);
    setSelectedTime(0);
    setCurrentX(0);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const generateThumbnails = async () => {
    if (!thumbnailVideoRef.current || !canvasRef.current) return;

    const video = thumbnailVideoRef.current;
    const canvas = canvasRef.current;
    canvas.width = 87.2;
    canvas.height = 150;
    const ctx = canvas.getContext("2d");
    const thumbnails = [];

    // Calculate the time interval for each part
    const interval = video.duration / 9;

    // Generate 9 thumbnails from each part of the video
    for (let i = 0; i < 9; i++) {
      // Calculate the time for this part (middle of each interval)
      const time = interval * (i + 0.5);
      video.currentTime = time;

      await new Promise((resolve) => {
        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          thumbnails.push(canvas.toDataURL());
          resolve();
        };
      });
    }

    setThumbnails(thumbnails);
  };

  const handleThumbnailMouseDown = (e) => {
    e.preventDefault();
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    const updateTime = (event) => {
      // Calculate position relative to container
      let newX = event.clientX - containerRect.left;

      // Limit the position within container bounds
      newX = Math.max(0, Math.min(containerRect.width, newX));

      // Calculate time based on position
      const clickPosition = newX / containerRect.width;
      const newTime = clickPosition * thumbnailVideoRef.current.duration;

      // Update video and UI
      thumbnailVideoRef.current.currentTime = newTime;
      setSelectedTime(newTime);
      setCurrentX(newX);
    };

    document.addEventListener("mousemove", updateTime);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", updateTime);
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoPlay = () => {
      setIsPlaying(true);
    };

    const handleVideoPause = () => {
      setIsPlaying(false);
    };

    video.addEventListener("play", handleVideoPlay);
    video.addEventListener("pause", handleVideoPause);

    return () => {
      video.removeEventListener("play", handleVideoPlay);
      video.removeEventListener("pause", handleVideoPause);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, [videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [videoUrl]);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  useEffect(() => {
    if (duration > 0) {
      generateThumbnails();
    }
  }, [duration]);

  useEffect(() => {
    if (thumbnailVideoRef.current) {
      thumbnailVideoRef.current.currentTime = selectedTime;
    }
  }, [selectedTime]);

  const handleAllowsChange = (type) => {
    setAllows((prev) => {
      if (prev.includes(type)) {
        return prev.filter((item) => item !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("Files", video);
    formData.append(
      "Files",
      helper.formatters.base64ToBlob(
        thumbnails[
          Math.floor((currentX / (containerRef.current?.offsetWidth || 1)) * 9)
        ]
      )
    );

    formData.append("Description", caption);
    formData.append("Viewable", viewable);
    formData.append("Allows", allows);

    const fetchApi = async () => {
      const result = await postVideoService.postVideo(formData);
      if (!result?.success) {
        dispatch(show(result?.message));
      } else {
        dispatch(show(result?.message));
      }
    };
    fetchApi();
  };

  return (
    <div className={clsx(styles.container)}>
      <div className={clsx(styles.content)}>
        <input
          type="file"
          ref={fileRef}
          accept="video/*"
          onChange={handleFileChange}
          className={clsx(styles.inputFile)}
        />
        {!video ? (
          <div className={clsx(styles.beforeUpload)}>
            <div
              className={clsx(styles.wrapperCard, {
                [styles.dragging]: isDragging,
              })}
              onClick={handleUploadClick}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className={clsx(styles.videoCard)}>
                <div className={clsx(styles.selectWrapper)}>
                  <div className={clsx(styles.selectIcon)}>
                    <UploadIcon />
                  </div>
                  <div className={clsx(styles.textWrapper)}>
                    <div className={clsx(styles.stageTitle)}>
                      Chọn video để tải lên
                    </div>
                    <div className={clsx(styles.stageSubTitle)}>
                      Hoặc kéo và thả vào đây
                    </div>
                    <Button primary className={clsx(styles.btnUpload)}>
                      Chọn video
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className={clsx(styles.videoSuggest)}>
              <div className={clsx(styles.videoSgtItem)}>
                <div className={clsx(styles.videoSgtIcon)}>
                  <VideoIcon width="2rem" height="2.4rem" />
                </div>
                <div className={clsx(styles.videoSgtText)}>
                  <p className={clsx(styles.videoSgtTitle)}>
                    Dung lượng và thời lượng
                  </p>
                  <p className={clsx(styles.videoSgtContent)}>
                    Dung lượng tối đa: 500 MB, thời lượng video: 10 phút.
                  </p>
                </div>
              </div>
              <div className={clsx(styles.videoSgtItem)}>
                <div className={clsx(styles.videoSgtIcon)}>
                  <FormatIcon width="2rem" height="2.4rem" />
                </div>
                <div className={clsx(styles.videoSgtText)}>
                  <p className={clsx(styles.videoSgtTitle)}>
                    Định dạng tập tin
                  </p>
                  <p className={clsx(styles.videoSgtContent)}>
                    Đề xuất: ".mp4". Có hỗ trợ các định dạng chính khác.
                  </p>
                </div>
              </div>
              <div className={clsx(styles.videoSgtItem)}>
                <div className={clsx(styles.videoSgtIcon)}>
                  <HDIcon width="2rem" height="2.4rem" />
                </div>
                <div className={clsx(styles.videoSgtText)}>
                  <p className={clsx(styles.videoSgtTitle)}>
                    Độ phân giải video
                  </p>
                  <p className={clsx(styles.videoSgtContent)}>
                    Độ phân giải cao khuyến nghị: 1080p, 1440p, 4K.
                  </p>
                </div>
              </div>
              <div className={clsx(styles.videoSgtItem)}>
                <div className={clsx(styles.videoSgtIcon)}>
                  <BulbIcon width="2rem" height="2.4rem" />
                </div>
                <div className={clsx(styles.videoSgtText)}>
                  <p className={clsx(styles.videoSgtTitle)}>Tỷ lệ khung hình</p>
                  <p className={clsx(styles.videoSgtContent)}>
                    Đề xuất: 16:9 cho chế độ ngang, 9:16 cho chế độ dọc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={clsx(styles.afterUpload)}>
            <div className={clsx(styles.infoVideo)}>
              <div className={clsx(styles.infoMain)}>
                <div className={clsx(styles.infoTitle)}>
                  <div className={clsx(styles.infoName)}>{videoInfo.name}</div>
                  <div className={clsx(styles.labelHd)}>1080P</div>
                </div>
                <div className={clsx(styles.infoStatus)}>
                  <span className={clsx(styles.iconStyle)}>
                    <FontAwesomeIcon
                      className={clsx(styles.iconStatus)}
                      icon={faCheckCircle}
                    />
                  </span>
                  <span className={clsx(styles.textUpload)}>
                    Đã tải lên ({formatFileSize(videoInfo.size)})
                  </span>
                </div>
              </div>
              <div className={clsx(styles.cancelVideo)}>
                <div
                  className={clsx(styles.btnCancel)}
                  onClick={handleCancelVideo}
                >
                  <span className={clsx(styles.iconStyle)}>
                    <FontAwesomeIcon
                      className={clsx(styles.iconCancel)}
                      icon={faTrash}
                    />
                  </span>
                  <span className={clsx(styles.labeltext)}>Hủy bỏ</span>
                </div>
              </div>
              <div className={clsx(styles.infoProgress, styles.success)}></div>
            </div>
            <div className={clsx(styles.bodyDetail)}>
              <div className={clsx(styles.mainDetail)}>
                <div className={clsx(styles.title)}>Chi tiết</div>
                <div className={clsx(styles.mainContent)}>
                  <div className={clsx(styles.captionTitle)}>
                    <span>Mô tả</span>
                  </div>
                  <div className={clsx(styles.captionDescription)}>
                    <textarea
                      className={clsx(styles.captionEditor)}
                      spellCheck={false}
                      value={caption}
                      onChange={handleCaptionChange}
                      placeholder="Viết mô tả..."
                    ></textarea>
                    <div className={clsx(styles.captionToolbar)}>
                      <div className={clsx(styles.operationButton)}>
                        <button
                          type="button"
                          className={clsx(styles.buttonItem)}
                        >
                          <HashtagIcon width="1.4rem" height="1.4rem" />
                          <span>Hashtag</span>
                        </button>
                        <button
                          type="button"
                          className={clsx(styles.buttonItem)}
                        >
                          <AtsignIcon width="1.4rem" height="1.4rem" />
                          <span>Nhắc đến</span>
                        </button>
                      </div>
                      <div className={clsx(styles.wordCount)}>
                        <span>{caption.length}</span>
                        <span>/</span>
                        <span>500</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={clsx(styles.captionTitle)}
                    style={{ marginTop: 28 }}
                  >
                    <span>Ảnh bìa</span>
                  </div>
                  <div
                    className={clsx(styles.coverContainer)}
                    ref={containerRef}
                  >
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                    {[...Array(9)].map((_, index) => (
                      <div key={index} className={clsx(styles.coverImage)}>
                        <img
                          src={thumbnails[index] || ""}
                          alt={`Thumbnail ${index + 1}`}
                        />
                      </div>
                    ))}
                    <div
                      className={clsx(styles.coverActive)}
                      style={{
                        left: `${
                          (currentX /
                            (containerRef.current?.offsetWidth || 1)) *
                          100
                        }%`,
                      }}
                      onMouseDown={handleThumbnailMouseDown}
                    >
                      <div className={clsx(styles.coverImageActive)}>
                        <video
                          ref={thumbnailVideoRef}
                          src={videoUrl}
                          preload="auto"
                          onLoadedMetadata={() => {
                            if (thumbnailVideoRef.current) {
                              generateThumbnails();
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={clsx(styles.title)} style={{ marginTop: 32 }}>
                  Cài đặt
                </div>
                <div className={clsx(styles.mainContent)}>
                  <div className={clsx(styles.captionTitle)}>
                    <span>Thời điểm đăng</span>
                  </div>
                  <div className={clsx(styles.scheduleContainer)}>
                    <div className={clsx(styles.formGroup)}>
                      <input
                        type="radio"
                        name="schedule"
                        id="now"
                        defaultChecked
                      />
                      <label htmlFor="now">Bây giờ</label>
                    </div>
                    <div className={clsx(styles.formGroup)}>
                      <input
                        disabled
                        type="radio"
                        name="schedule"
                        id="choose"
                      />
                      <label htmlFor="choose">Lên lịch</label>
                    </div>
                  </div>
                  <div
                    className={clsx(styles.captionTitle)}
                    style={{ marginTop: 28 }}
                  >
                    <span>Ai có thể xem video này</span>
                  </div>
                  <SelectOption
                    offset={[-272, 10]}
                    options={OPTIONS}
                    onSelect={(code) => setViewable(code)}
                  />
                  <div
                    className={clsx(styles.captionTitle)}
                    style={{ marginTop: 28 }}
                  >
                    <span>Cho phép người dùng</span>
                  </div>
                  <div className={clsx(styles.scheduleContainer)}>
                    <div className={clsx(styles.formGroup)}>
                      <input
                        type="checkbox"
                        id="comment"
                        checked={allows.includes("comment")}
                        onChange={() => handleAllowsChange("comment")}
                      />
                      <label htmlFor="comment">Bình luận</label>
                    </div>
                    <div className={clsx(styles.formGroup)}>
                      <input
                        type="checkbox"
                        id="duet"
                        checked={allows.includes("duet")}
                        onChange={() => handleAllowsChange("duet")}
                      />
                      <label htmlFor="duet">Duet</label>
                    </div>
                    <div className={clsx(styles.formGroup)}>
                      <input
                        type="checkbox"
                        id="connect"
                        checked={allows.includes("connect")}
                        onChange={() => handleAllowsChange("connect")}
                      />
                      <label htmlFor="connect">Ghép nối</label>
                    </div>
                  </div>
                </div>
                <div className={clsx(styles.title)} style={{ marginTop: 32 }}>
                  Kiểm tra
                </div>
                <div className={clsx(styles.mainContent)}>
                  <div className={clsx(styles.checkCopyRight)}>
                    <div className={clsx(styles.captionTitle)}>
                      <span>Chạy quy trình kiểm tra bản quyền</span>
                    </div>
                    <input
                      type="checkbox"
                      className={clsx(styles.switch)}
                      id="switch"
                      checked={isCopyrightCheck}
                      onChange={(e) => setIsCopyrightCheck(e.target.checked)}
                    />
                    <label
                      htmlFor="switch"
                      className={clsx(styles.label)}
                    ></label>
                  </div>
                </div>
                <div className={clsx(styles.btnWrapper)}>
                  <Button
                    primary
                    className={clsx(styles.submitPost)}
                    onClick={handleSubmit}
                  >
                    Bài đăng
                  </Button>
                  <button
                    className={clsx(styles.cancelBtn)}
                    type="button"
                    onClick={handleCancelVideo}
                  >
                    Hủy bỏ
                  </button>
                </div>
              </div>
              <div className={clsx(styles.asideDetail)}>
                <div className={clsx(styles.title)}>Xem trước</div>
                <div className={clsx(styles.mobilePreview)}>
                  <div className={clsx(styles.appFrame)}>
                    <div className={clsx(styles.videoPlayerContainer)}>
                      <video
                        ref={videoRef}
                        className={clsx(styles.videoPlayer)}
                        src={videoUrl}
                        width="100%"
                        height="100%"
                        onTimeUpdate={handleTimeUpdate}
                        onClick={handleVideoClick}
                        controls={false}
                        muted={true}
                      ></video>
                    </div>
                    <div className={clsx(styles.mockFullscreen)}>
                      <span className={clsx(styles.iconStyle)}>
                        <MockFullscreenIcon width=".8rem" height=".8rem" />
                      </span>
                      <span>Toàn màn hình</span>
                    </div>
                    <div
                      className={clsx(styles.videoPlayerControl)}
                      onClick={
                        document.fullscreenElement
                          ? handleFullscreenClick
                          : handleControlClick
                      }
                    >
                      <div className={clsx(styles.controlContainer)}>
                        <div className={clsx(styles.controlBg)}></div>
                        <span
                          className={clsx(styles.progressZone)}
                          onClick={handleProgressBarClick}
                        >
                          <div className={clsx(styles.progressBarContainer)}>
                            <div
                              className={clsx(styles.progressBar)}
                              style={{ width: `${progressWidth}%` }}
                            ></div>
                          </div>
                        </span>
                        <div className={clsx(styles.controlOperation)}>
                          <div className={clsx(styles.playInfo)}>
                            <span
                              className={clsx(styles.playBtn)}
                              onClick={handlePlayPause}
                            >
                              {isPlaying ? (
                                <PauseIcon width="1.4rem" height="1.4rem" />
                              ) : (
                                <PlayIcon width="1.4rem" height="1.4rem" />
                              )}
                            </span>
                            <div className={clsx(styles.playTime)}>
                              {formatTime(currentTime)}
                              <span className={clsx(styles.space)}>/</span>
                              {formatTime(duration)}
                            </div>
                          </div>
                          <div className={clsx(styles.operationBtn)}>
                            <span
                              className={clsx(styles.volumeBtn)}
                              onClick={handleVolume}
                            >
                              {isMuted ? (
                                <VolumeOffIcon width="1.4rem" height="1.4rem" />
                              ) : (
                                <VolumeOnIcon width="1.4rem" height="1.4rem" />
                              )}
                            </span>
                            <span
                              className={clsx(styles.fullscreenBtn)}
                              onClick={handleFullscreen}
                            >
                              <FullscreenIcon width="1.4rem" height="1.4rem" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={clsx(styles.appLayout)}>
                      <div className={clsx(styles.headerApp)}>
                        <img
                          className={clsx(styles.headerAppImg)}
                          src={images.headerApp}
                        />
                        <img
                          className={clsx(styles.headerAppImg)}
                          src={images.headerRouteApp}
                        />
                      </div>
                      <div className={clsx(styles.videoOverlayContainer)}>
                        <div className={clsx(styles.sidebarContainer)}>
                          <div className={clsx(styles.overlaySidebar)}>
                            <div className={clsx(styles.avatarContainer)}>
                              <Image
                                className={clsx(styles.avatarUser)}
                                src={currentUser?.avatar || images.noImage}
                                alt=""
                              />
                              <span className={clsx(styles.iconMini)}>
                                <PlusRedIcon width="1.4rem" height="1.4rem" />
                              </span>
                            </div>
                            <img
                              className={clsx(styles.interAction)}
                              src={images.interactionApp}
                            />
                            <div className={clsx(styles.musicCover)}></div>
                          </div>
                          <div className={clsx(styles.metaData)}>
                            <div className={clsx(styles.userName)}>
                              {currentUser?.fullName}
                            </div>
                            <div className={clsx(styles.caption)}>
                              {caption}
                            </div>
                            <div className={clsx(styles.soundContainer)}>
                              <div className={clsx(styles.musicIcon)}>
                                <MusicIcon width="1rem" height="1rem" />
                              </div>
                              <div className={clsx(styles.soundContent)}>
                                Âm thanh gốc - {currentUser?.fullName}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={clsx(styles.bottomNavbar)}>
                        <img
                          className={clsx(styles.bottomImg)}
                          src={images.bottomApp}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
