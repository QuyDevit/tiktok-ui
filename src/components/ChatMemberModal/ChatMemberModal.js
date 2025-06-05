import clsx from "clsx";
import styles from "./ChatMemberModal.module.scss";
import Modal from "../Modal";
import { CloseIcon, SearchIcon } from "../Icons";
import ChooseMemberItem from "../ChooseMemberItem";
import { useState } from "react";

function ChatMemberModal({
  data,
  isOpen,
  onClose,
  type = "group",
  onSelectMembers,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const filteredData =
    data?.filter((user) =>
      user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleMemberSelect = (userId) => {
    if (type === "group") {
      setSelectedMembers((prev) => {
        if (prev.includes(userId)) {
          return prev.filter((id) => id !== userId);
        }
        return [...prev, userId];
      });
    } else {
      setSelectedMembers([userId]);
    }
  };

  const handleSubmit = () => {
    onSelectMembers(selectedMembers);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      animationType="bounceIn"
      className={clsx(styles.containerModal)}
    >
      <button className={clsx(styles.closeBtn)} onClick={onClose}>
        <CloseIcon width="2.55rem" height="2.55rem" />
      </button>

      <h3 className={clsx(styles.titleModal)}>
        {type === "group" ? "Tạo nhóm" : "Tạo cuộc trò chuyện"}
      </h3>

      {type === "group" && (
        <input
          type="text"
          className={clsx(styles.inputNameGroup)}
          placeholder="Nhập tên nhóm"
        />
      )}

      <div className={clsx(styles.inputContainer)}>
        <SearchIcon width="2rem" height="2rem" />
        <input
          type="text"
          className={clsx(styles.inputForm)}
          placeholder="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div
        className={clsx(styles.listMember)}
        style={type === "group" ? { height: 355 } : { height: 400 }}
      >
        {filteredData.map((user) => (
          <ChooseMemberItem
            data={user}
            key={`${user?.id}`}
            type={type}
            isSelected={selectedMembers.includes(user?.id)}
            onSelect={() => handleMemberSelect(user?.id)}
          />
        ))}
      </div>
      <div className={clsx(styles.divBottom)}>
        <button className={clsx(styles.btnCancel)} onClick={onClose}>
          Hủy
        </button>
        <button
          className={clsx(styles.btnSubmit)}
          disabled={selectedMembers.length === 0}
          onClick={handleSubmit}
        >
          {type === "group" ? "Tạo ngay" : "Bắt đầu"}
        </button>
      </div>
    </Modal>
  );
}
export default ChatMemberModal;
