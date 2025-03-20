import clsx from "clsx";
import Cropper from "react-easy-crop";
import styles from "../EditProfileModal/EditProfileModal.module.scss";
import { BackIcon } from "~/components/Icons";
import { useCallback, useState } from "react";
import Button from "~/components/Button";
function EditAvatarModal({ imageSrc, onCropDone, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedArea, setCroppedArea] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  return (
    <div className={clsx(styles.editPhoto)}>
      <div className={clsx(styles.divHeader)}>
        <div className={clsx(styles.divBack)}>
          <span
            className={clsx(styles.backIcon)}
            onClick={() => onCancel("")}
          >
            <BackIcon width="2.6rem" height="2.6rem" />
          </span>
          <span className={clsx(styles.titleEditPhoto)}>Chỉnh sửa ảnh</span>
        </div>
      </div>
      <div className={clsx(styles.divContentContainer)}>
        <div className={clsx(styles.divPreviewArea)}>
          <div className={clsx(styles.divTransformArea)}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onZoomChange={setZoom}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              showGrid={false}
              style={{ containerStyle: { minWidth: 360 } }}
            />
          </div>
        </div>
        <div className={clsx(styles.divSlider)}>
          <span>Thu phóng</span>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className={clsx(styles.slider)}
          />
        </div>
      </div>
      <div className={clsx(styles.divFooter)}>
        <Button
          className={clsx(styles.styleButton, styles.cancel)}
          onClick={() => onCancel("")}
        >
          Hủy
        </Button>
        <Button primary className={clsx(styles.styleButton)} onClick={() => onCropDone(croppedArea)}>
          Áp dụng
        </Button>
      </div>
    </div>
  );
}

export default EditAvatarModal;
