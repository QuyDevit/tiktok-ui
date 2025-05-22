import clsx from "clsx";
import styles from "../Upload.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTrash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import SelectOption from "~/components/SelectOption";
import Image from "~/components/Image";
import images from "~/assets/images";
import {
  AtsignIcon,
  HashtagIcon,
  MockFullscreenIcon,
  MusicIcon,
  PlayIcon,
  PlusRedIcon,
  PauseIcon,
  VolumeOffIcon,
  VolumeOnIcon,
  FullscreenIcon,
} from "~/components/Icons";

const OPTIONS = [
  { code: "public", text: "Mọi người" },
  { code: "friends", text: "Bạn bè" },
  { code: "private", text: "Chỉ mình tôi" },
];

function AfterUpload({
  videoInfo,
  caption,
  handleCaptionChange,
  handleCancelVideo,
  containerRef,
  thumbnails,
  currentX,
  handleThumbnailMouseDown,
  thumbnailVideoRef,
  videoUrl,
  setViewable,
  allows,
  handleAllowsChange,
  isCopyrightCheck,
  setIsCopyrightCheck,
  handleSubmit,
  videoRef,
  isPlaying,
  isMuted,
  currentTime,
  duration,
  progressWidth,
  handlePlayPause,
  handleVideoClick,
  handleControlClick,
  handleFullscreenClick,
  handleVolume,
  handleTimeUpdate,
  handleProgressBarClick,
  handleFullscreen,
  formatTime,
  formatFileSize,
  canvasRef,
  generateThumbnails,
  currentUser,
  isSubmitting,
}) {
  return (
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
            className={clsx(styles.btnCancel, {
              [styles.disabled]: isSubmitting,
            })}
            onClick={!isSubmitting ? handleCancelVideo : undefined}
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
                className={clsx(styles.captionEditor, {
                  [styles.disabled]: isSubmitting,
                })}
                spellCheck={false}
                value={caption}
                onChange={handleCaptionChange}
                placeholder="Viết mô tả..."
                disabled={isSubmitting}
              ></textarea>
              <div className={clsx(styles.captionToolbar)}>
                <div className={clsx(styles.operationButton)}>
                  <button type="button" className={clsx(styles.buttonItem)}>
                    <HashtagIcon width="1.4rem" height="1.4rem" />
                    <span>Hashtag</span>
                  </button>
                  <button type="button" className={clsx(styles.buttonItem)}>
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
            <div className={clsx(styles.coverContainer)} ref={containerRef}>
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
                    (currentX / (containerRef.current?.offsetWidth || 1)) * 100
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
                  disabled={isSubmitting}
                />
                <label htmlFor="now">Bây giờ</label>
              </div>
              <div className={clsx(styles.formGroup)}>
                <input
                  disabled={true}
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
                  disabled={isSubmitting}
                />
                <label htmlFor="comment">Bình luận</label>
              </div>
              <div className={clsx(styles.formGroup)}>
                <input
                  type="checkbox"
                  id="duet"
                  checked={allows.includes("duet")}
                  onChange={() => handleAllowsChange("duet")}
                  disabled={isSubmitting}
                />
                <label htmlFor="duet">Duet</label>
              </div>
              <div className={clsx(styles.formGroup)}>
                <input
                  type="checkbox"
                  id="connect"
                  checked={allows.includes("connect")}
                  onChange={() => handleAllowsChange("connect")}
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              <label htmlFor="switch" className={clsx(styles.label)}></label>
            </div>
          </div>
          <div className={clsx(styles.btnWrapper)}>
            <button
              className={clsx(styles.submitPost, {
                [styles.disabled]: isSubmitting,
              })}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Đang đăng...
                </>
              ) : (
                "Đăng bài"
              )}
            </button>
            <button
              className={clsx(styles.cancelBtn, {
                [styles.disabled]: isSubmitting,
              })}
              type="button"
              onClick={!isSubmitting ? handleCancelVideo : undefined}
              disabled={isSubmitting}
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
                  className={clsx(styles.videoPlayer, {
                    [styles.disabled]: isSubmitting,
                  })}
                  src={videoUrl}
                  width="100%"
                  height="100%"
                  onTimeUpdate={handleTimeUpdate}
                  onClick={!isSubmitting ? handleVideoClick : undefined}
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
                      <div className={clsx(styles.caption)}>{caption}</div>
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
  );
}

export default AfterUpload;
