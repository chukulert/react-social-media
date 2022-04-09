import styles from "./Loader.module.css";

const Loader = ({ messageLoader }) => {
  return (
    <>
      {!messageLoader ? (
        <div className={styles.loader}></div>
      ) : (
        <div className={styles.smallLoader}></div>
      )}
    </>
  );
};

export default Loader;
