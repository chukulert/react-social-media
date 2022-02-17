
import styles from "./Modal.module.css";

const Modal = (props) => {
    //props with a submitFormhandler
    //props with a closeModal handler
    //props with a open modal handler?


  return (
    <>
      <div className={styles.modalBackdrop} onClick={props.closeModal}></div>
      <div>
        <div className={styles.modal}>
          <h2>New Post</h2>
          <button onClick={props.closeModal} className={styles.closeModalBtn}>
            X
          </button>
          {props.content}
        </div>
      </div>
    </>
  );
};

export default Modal;