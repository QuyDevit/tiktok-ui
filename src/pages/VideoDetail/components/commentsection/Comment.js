import clsx from "clsx";
import styles from "./Comment.module.scss";
import CommentItem from "./CommentItem";

export default function Comment({ currentUser }) {
  return (
    <section className={clsx(styles.container)}>
      <div className={clsx(styles.header)}>
        <div className={clsx(styles.headerTitle)}>
          <h3>Bình luận</h3>
          <h4>(5)</h4>
        </div>
      </div>
      <div className={clsx(styles.divMain)}>
        <div className={clsx(styles.divListContainer)}>
          <div className={clsx(styles.objectWrapper)}>
            <CommentItem />
            <div className={clsx(styles.divReplyContainer)}>
              <CommentItem isParrent={false} />
              <div className={clsx(styles.divViewReplyContainer)}>
                <div className={clsx(styles.spaceRelies)}></div>
                <div className={clsx(styles.divViewMoreOption)}>
                  Xem 3 câu trả lời
                </div>
              </div>
            </div>
          </div>
          <div className={clsx(styles.objectWrapper)}>
            <CommentItem />
          </div>
          <div className={clsx(styles.objectWrapper)}>
            <CommentItem />
          </div>
          <div className={clsx(styles.objectWrapper)}>
            <CommentItem />
          </div>
          <div className={clsx(styles.objectWrapper)}>
            <CommentItem />
          </div>
          <div className={clsx(styles.objectWrapper)}>
            <CommentItem />
          </div>
          <div className={clsx(styles.objectWrapper)}>
            <CommentItem />
          </div>
          <div className={clsx(styles.objectWrapper)}>
            <CommentItem />
          </div>
          <div className={clsx(styles.objectWrapper)}>
            <CommentItem />
          </div>
        </div>
      </div>
      <div className={clsx(styles.divFooter)}>
        {currentUser ? (
          <div className={clsx(styles.inputWraper)}>
            <input
              className={clsx(styles.inputForm)}
              type="text"
              placeholder="Thêm bình luận"
            />
            <button className={clsx(styles.btnPost)} type="button">
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
    </section>
  );
}
