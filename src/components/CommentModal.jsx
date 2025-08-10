import React from "react";
import "./CommentModal.css";

export default function CommentModal({
  isOpen,
  onClose,
  onSubmit,
  comment,
  setComment,
  desk,
}) {
  if (!isOpen) {
    return null;
  }

  const actionText = desk.occupied ? "退室" : "入室";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">
          {desk.user} - {actionText}しますか？
        </h3>
        <p className="modal-subtitle">理由やコメントを入力してください（任意）</p>
        <form onSubmit={handleSubmit}>
          <textarea
            className="comment-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="例：〇〇の打ち合わせのため"
            rows="3"
          ></textarea>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="btn btn-primary">
              {actionText}を記録
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
