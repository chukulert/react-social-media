import Image from "next/image";
import styles from "./PostCard.module.css";
import Link from "next/link";
import { timeAgo } from "../../utils/index";
import TextContent from "./TextContent";
import CommentBox from "./CommentBox";
import { useAuth } from "../../context/AuthContext";
import {useState, useEffect} from 'react'

import { fetcher, isEmpty } from "../../utils";
import useSWR from "swr";

const PostCard = (props) => {
  const { currentUserProfile } = useAuth();
  const [displayComments, setDisplayComments] = useState(false);
  const [likedPost, setLikedPost] = useState(false)
  const [likes, setLikes] = useState(props.likesCount);

  const date = timeAgo(props.created_at);



  const { data, error } = useSWR(`/api/getPostById?id=${props.id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);

      setVotingCount(data[0].voting);
    }
  }, [data]); 


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
            <Link href={`/profile/${props.userID}`}>
              <a className={styles.displayNameLink}>{props.displayName}</a>
            </Link>
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
            width="100%"
            height="100%"
            layout="responsive"
            objectFit="cover"
            className={styles.image}
          />
        )}
      </div>
      <CommentBox id={props.id} likesCount={props.likesCount} displayComments={displayComments} />
    </div>
  );
};

export default PostCard;
