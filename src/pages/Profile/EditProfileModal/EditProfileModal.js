import clsx from "clsx";
import styles from "./EditProfileModal.module.scss";
import Modal from "~/components/Modal";
import { CloseIcon, EditIcon } from "~/components/Icons";
import { useRef, useState } from "react";
import Button from "~/components/Button";
import EditAvatarModal from "../EditAvatarModal/EditAvatarModal";
import ImageSrc from "~/components/Image";
import images from "~/assets/images";
import * as updateInfoUser from "~/services/users/updateInfoUser";
import * as helper from "~/helpers";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "~/store/features/authSlice";
import { show } from "~/store/features/alertSlice";

function EditProfileModal({ isOpen, onClose, currentUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [countCharBio, setCountCharBio] = useState(currentUser?.bio.length);
  const [nickName, setNickName] = useState(currentUser?.nickname);
  const [avatar, setAvatar] = useState(currentUser?.avatar || images.noImage);
  const [fullName, setFullName] = useState(currentUser?.fullName);
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [image, setImage] = useState("");
  const fileRef = useRef();
  const handleChangeValue = (e) => {
    setBio(e.target.value);
    setCountCharBio(e.target.value.length);
  };
  const handleOnChangeFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        setImage(reader.result);
      };
    }
    e.target.value = null;
  };
  const onCropDone = (imgCropedArea) => {
    const canvasEle = document.createElement("canvas");
    canvasEle.width = imgCropedArea.width;
    canvasEle.height = imgCropedArea.height;
    const ctx = canvasEle.getContext("2d");
    let imageObj = new Image();
    imageObj.src = image;
    imageObj.onload = () => {
      ctx.drawImage(
        imageObj,
        imgCropedArea.x,
        imgCropedArea.y,
        imgCropedArea.width,
        imgCropedArea.height,
        0,
        0,
        imgCropedArea.width,
        imgCropedArea.height
      );
      const dataUrl = canvasEle.toDataURL("image/jpeg");
      setAvatar(dataUrl);
      setImage("");
    };
  };

  const handleCancel = () => {
    setAvatar(currentUser?.avatar);
    setImage("");
    onClose(false);
  };
  const handleSave = () => {
    const formData = new FormData();
    formData.append("Fullname", fullName);
    formData.append("Nickname", nickName);
    formData.append("Bio", bio);
    if (avatar !== currentUser?.avatar) {
      formData.append("Avatar", helper.formatters.base64ToBlob(avatar));
    }

    const fetchApi = async () => {
      const result = await updateInfoUser.updateInfo(formData);
      if (!result?.success) {
        dispatch(show(result.message));
      } else {
        navigate("/@" + result.data.nickname, { replace: true });
        dispatch(setUser(result.data));
        dispatch(show(result.message));
        onClose(false);
      }
    };
    fetchApi();
  };

  const canSubmit = () => {
    return (
      nickName !== currentUser?.nickname ||
      fullName !== currentUser?.fullName ||
      bio !== currentUser?.bio ||
      avatar !== currentUser?.avatar
    );
  };
  return (
    <Modal
      isOpen={isOpen}
      animationType="zoomIn"
      className={clsx(styles.container)}
    >
      <button className={clsx(styles.closeBtn)} onClick={handleCancel}>
        <CloseIcon width="2.55rem" height="2.55rem" />
      </button>
      <h2 className={clsx(styles.title)}>Sửa hồ sơ</h2>
      <div className={clsx(styles.content)}>
        <div className={clsx(styles.divItemContent)}>
          <div className={clsx(styles.label)}>Ảnh hồ sơ</div>
          <div className={clsx(styles.avatar)}>
            <span
              className={clsx(styles.styleAvatar)}
              onClick={() => fileRef.current.click()}
            >
              <ImageSrc src={avatar} className={clsx(styles.img)} />
            </span>
            <div className={clsx(styles.editIcon)}>
              <EditIcon width="1.8rem" height="1.8rem" />
              <input
                tabIndex="-1"
                type="file"
                ref={fileRef}
                accept=".jpg,.jpeg,.png,.tiff,.heic,.webp"
                onChange={handleOnChangeFile}
                className={clsx(styles.inputUpload)}
              />
            </div>
          </div>
        </div>
        <div className={clsx(styles.divItemContent)}>
          <div className={clsx(styles.label)}>TikTok ID</div>
          <div className={clsx(styles.editArea)}>
            <input
              type="text"
              className={clsx(styles.inputText)}
              onChange={(e) => setNickName(e.target.value)}
              value={nickName}
            />
            <p className={clsx(styles.userLink)}>
              www.tiktokcscw.vn/@{currentUser.nickname}
            </p>
            <p className={clsx(styles.userTip)}>
              TikTok ID chỉ có thể bao gồm chữ cái, chữ số, dấu gạch dưới và dấu
              chấm. Khi thay đổi TikTok ID, liên kết hồ sơ của bạn cũng sẽ thay
              đổi.
            </p>
          </div>
        </div>
        <div className={clsx(styles.divItemContent)}>
          <div className={clsx(styles.label)}>Tên</div>
          <div className={clsx(styles.editArea)}>
            <input
              type="text"
              className={clsx(styles.inputText)}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <p className={clsx(styles.userTip)}>
              Bạn chỉ có thể thay đổi biệt danh 7 ngày một lần.
            </p>
          </div>
        </div>
        <div className={clsx(styles.divItemContent)}>
          <div className={clsx(styles.label)}>Tiểu sử</div>
          <div className={clsx(styles.editArea)}>
            <textarea
              type="text"
              className={clsx(styles.textareaText)}
              value={bio}
              onChange={handleChangeValue}
            ></textarea>
            <div className={clsx(styles.divTextCount)}>
              <span>{countCharBio}/80</span>
            </div>
          </div>
        </div>
      </div>
      <div className={clsx(styles.divFooter)}>
        <Button
          className={clsx(styles.styleButton, styles.cancel)}
          onClick={handleCancel}
        >
          Hủy
        </Button>
        <Button
          disabled={!canSubmit()}
          primary
          className={clsx(styles.styleButton, styles.submit)}
          onClick={handleSave}
        >
          Lưu
        </Button>
      </div>
      {image && (
        <EditAvatarModal
          imageSrc={image}
          onCancel={setImage}
          onCropDone={onCropDone}
        />
      )}
    </Modal>
  );
}

export default EditProfileModal;
