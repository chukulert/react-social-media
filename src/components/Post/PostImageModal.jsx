import Image from "next/image";
import styles from "./PostImageModal.module.css";

const PostImageModal = (props) => {
  const { imageLink, handleImageModal } = props;

  return (
    <>
      <div className={styles.modalBackdrop} onClick={handleImageModal}></div>

      <div className={styles.modal}>
        <button onClick={handleImageModal} className={styles.closeModalBtn}>
          X
        </button>
        <div className={styles.modalContent}>
          {imageLink && (
            <Image
              src={imageLink}
              alt="post image"
              width="100%"
              height="100%"
              layout="responsive"
              objectFit='contain'
              priority
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PostImageModal;
