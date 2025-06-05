import clsx from "clsx";
import styles from "./Upload.module.scss";
import { useRef, useState, useEffect } from "react";
import routes, { pagesTitle } from "~/config/routes";
import { postVideo } from "~/services/videos/videoService";
import { useDispatch, useSelector } from "react-redux";
import { show } from "~/store/features/alertSlice";
import { formatters } from "~/helpers";
import BeforeUpload from "./components/BeforeUpload";
import AfterUpload from "./components/AfterUpload";
import { useNavigate } from "react-router-dom";
import { selectIsAuthChecking, selectUser } from "~/store/features/authSlice";
import Loading from "~/components/Loading";

function Upload() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);
  const isAuthChecking = useSelector(selectIsAuthChecking);

  // File states
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState({
    name: "",
    size: 0,
    type: "",
  });

  // UI states
  const [isDragging, setIsDragging] = useState(false);
  const [caption, setCaption] = useState("");
  const [viewable, setViewable] = useState("public");
  const [allows, setAllows] = useState(["comment", "duet", "connect"]);
  const [isCopyrightCheck, setIsCopyrightCheck] = useState(false);

  // Video player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  // Thumbnail states
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedTime, setSelectedTime] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  // Refs
  const containerRef = useRef(null);
  const fileRef = useRef();
  const videoRef = useRef();
  const thumbnailVideoRef = useRef(null);
  const canvasRef = useRef(null);

  // New state for submitting
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthChecking && !currentUser) {
      navigate(routes.login);
    }
  }, [currentUser, isAuthChecking, navigate]);

  useEffect(() => {
    document.title = pagesTitle[routes.upload];
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

    const interval = video.duration / 9;

    for (let i = 0; i < 9; i++) {
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
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("Files", video);
    formData.append(
      "Files",
      formatters.base64ToBlob(
        thumbnails[
          Math.floor((currentX / (containerRef.current?.offsetWidth || 1)) * 9)
        ]
      )
    );
    formData.append("Description", caption);
    formData.append("Viewable", viewable);
    formData.append("Allows", allows);

    const fetchApi = async () => {
      try {
        const result = await postVideo(formData);
        if (!result?.success) {
          dispatch(show(result?.message));
        } else {
          dispatch(show(result?.message));
          navigate("/@" + currentUser.nickname, { replace: true });
        }
      } catch (error) {
        dispatch(show("Có lỗi xảy ra khi đăng video"));
      } finally {
        setIsSubmitting(false);
      }
    };
    fetchApi();
  };

  if (isAuthChecking) {
    return <Loading />;
  }

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
          <BeforeUpload
            isDragging={isDragging}
            handleUploadClick={handleUploadClick}
            handleDragOver={handleDragOver}
            handleDragEnter={handleDragEnter}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
          />
        ) : (
          <AfterUpload
            videoInfo={videoInfo}
            caption={caption}
            handleCaptionChange={handleCaptionChange}
            handleCancelVideo={handleCancelVideo}
            containerRef={containerRef}
            thumbnails={thumbnails}
            currentX={currentX}
            handleThumbnailMouseDown={handleThumbnailMouseDown}
            thumbnailVideoRef={thumbnailVideoRef}
            videoUrl={videoUrl}
            setViewable={setViewable}
            allows={allows}
            handleAllowsChange={handleAllowsChange}
            isCopyrightCheck={isCopyrightCheck}
            setIsCopyrightCheck={setIsCopyrightCheck}
            handleSubmit={handleSubmit}
            videoRef={videoRef}
            isPlaying={isPlaying}
            isMuted={isMuted}
            currentTime={currentTime}
            duration={duration}
            progressWidth={progressWidth}
            handlePlayPause={handlePlayPause}
            handleVideoClick={handleVideoClick}
            handleControlClick={handleControlClick}
            handleFullscreenClick={handleFullscreenClick}
            handleVolume={handleVolume}
            handleTimeUpdate={handleTimeUpdate}
            handleProgressBarClick={handleProgressBarClick}
            handleFullscreen={handleFullscreen}
            formatTime={formatTime}
            formatFileSize={formatFileSize}
            canvasRef={canvasRef}
            generateThumbnails={generateThumbnails}
            currentUser={currentUser}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

export default Upload;
