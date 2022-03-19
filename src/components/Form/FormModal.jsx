import NewPostForm from "./NewPostForm";
import styles from "./FormModal.module.css";

const FormModal = (props) => {
  return (
    <>
      <div className={styles.modalBackdrop} onClick={props.closeModal}></div>
      <div className={styles.flex}>
        <div className={styles.modal}>
          <h2>New Post</h2>
          <button onClick={props.closeModal} className={styles.closeModalBtn}>
            X
          </button>
          <div className={styles.modalContent}>
          <NewPostForm submitHandler={props.submitFormHandler} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FormModal;
