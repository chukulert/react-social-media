import Image from "next/image";
import styles from "./PostCard.module.css";
import Link from "next/link";

const PostCard = (props) => {
    

  const date = new Date(props.created_at).toString();
  return (
    <div className={styles.cardContainer}>
      <div className={styles.titleBar}>
        <div>
          {props.profilePhoto && (
            <Image
              src={props.profilePhoto}
              alt={`${props.displayName}'s avatar`}
              width={50}
              height={50}
            />
          )}
          <div className={styles.titleBarContent}>
            <Link href={`/profile/${props.userID}`}><a className={styles.displayNameLink}>{props.displayName}</a></Link>
            <p>Date created: {date}</p>
          </div>
        </div>
      </div>

      <div className={styles.description}>
        <p>Title: {props.title}</p>
        <p>Description: {props.description}</p>
      </div>

      <div>
        {props.image && (
          <Image
            src={props.image}
            alt="post image"
            width='100%'
            height='100%'
            layout='responsive'
            objectFit="contain"
            className={styles.image}
          />
        )}
      </div>
    </div>
  );
};

export default PostCard;
