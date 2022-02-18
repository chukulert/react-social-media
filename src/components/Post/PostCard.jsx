import Image from "next/image";
import styles from "./PostCard.module.css";
import Link from "next/link";

import { timeAgo } from "../../utils/calculate-time";
import TextContent from "./TextContent";
import CommentBox from "./CommentBox";

const PostCard = (props) => {
    

  const date = timeAgo(props.created_at)

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
            <p className={styles.timeAgo}>{date}</p>
          </div>
        </div>
      </div>

      <div className={styles.description}>
        <strong>{props.title}</strong>
        <TextContent>{props.description}</TextContent>
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
      <CommentBox />
    </div>
  );
};

export default PostCard;
