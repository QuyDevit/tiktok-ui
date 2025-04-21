import clsx from "clsx";
import styles from './Upload.module.scss';
import { BulbIcon, FormatIcon, HDIcon, UploadIcon, VideoIcon } from "~/components/Icons";
import Button from "~/components/Button";

function Upload() {
  return <div className={clsx(styles.container)}>
    <div className={clsx(styles.content)}>
        <div className={clsx(styles.wrapperCard)}>
          <div className={clsx(styles.videoCard)}>
            <div className={clsx(styles.selectWrapper)}>
              <div className={clsx(styles.selectIcon)}>
                <UploadIcon/>
              </div>
              <div className={clsx(styles.textWrapper)}>
                <div className={clsx(styles.stageTitle)}>Chọn video để tải lên</div>
                <div className={clsx(styles.stageSubTitle)}>Hoặc kéo và thả vào đây</div>
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
              <VideoIcon width="2rem" height="2.4rem"/>
            </div>
            <div className={clsx(styles.videoSgtText)}>
              <p className={clsx(styles.videoSgtTitle)}>Dung lượng và thời lượng</p>
              <p className={clsx(styles.videoSgtContent)}>Dung lượng tối đa: 30 GB, thời lượng video: 60 phút.</p>
            </div>
          </div>
          <div className={clsx(styles.videoSgtItem)}>
            <div className={clsx(styles.videoSgtIcon)}>
              <FormatIcon width="2rem" height="2.4rem"/>
            </div>
            <div className={clsx(styles.videoSgtText)}>
              <p className={clsx(styles.videoSgtTitle)}>Định dạng tập tin</p>
              <p className={clsx(styles.videoSgtContent)}>Đề xuất: “.mp4”. Có hỗ trợ các định dạng chính khác.</p>
            </div>
          </div>
          <div className={clsx(styles.videoSgtItem)}>
            <div className={clsx(styles.videoSgtIcon)}>
              <HDIcon width="2rem" height="2.4rem"/>
            </div>
            <div className={clsx(styles.videoSgtText)}>
              <p className={clsx(styles.videoSgtTitle)}>Độ phân giải video</p>
              <p className={clsx(styles.videoSgtContent)}>Độ phân giải cao khuyến nghị: 1080p, 1440p, 4K.</p>
            </div>
          </div>
          <div className={clsx(styles.videoSgtItem)}>
            <div className={clsx(styles.videoSgtIcon)}>
              <BulbIcon width="2rem" height="2.4rem"/>
            </div>
            <div className={clsx(styles.videoSgtText)}>
              <p className={clsx(styles.videoSgtTitle)}>Tỷ lệ khung hình</p>
              <p className={clsx(styles.videoSgtContent)}>Đề xuất: 16:9 cho chế độ ngang, 9:16 cho chế độ dọc.</p>
            </div>
          </div>
        </div>
    </div>
  </div>;
}

export default Upload;
