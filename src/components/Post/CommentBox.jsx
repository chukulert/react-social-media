import { useState } from 'react';
import styles from './Comment.module.css'
import Comment from './Comment';

const CommentBox = () => {
    const [displayComments, setDisplayComments] = useState(false)

    const showComments = () => {
        displayComments ? setDisplayComments(false) : setDisplayComments(true) 
    }

    return (
        <div className={styles.commentContainer}>
            <div className={styles.commentHeader}><button onClick={showComments}>Show Comments</button></div>
        {displayComments && <div className={styles.commentBox}>Comments</div>}
        </div>
    )
}

export default CommentBox;