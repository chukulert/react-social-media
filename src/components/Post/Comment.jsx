import { timeAgo } from '../../utils'
import styles from './Comment.module.css'

const Comment = (props) => {
    const {userID, displayName, profilePhoto, content, created_at, likesCount, postID} = props

    const time = timeAgo(created_at)

    return (
        <div>
            <div>displayName: {displayName}</div>
            <div>content: {content}</div>
            <div>created_at: {time}</div>
            <div>likesCount: {likesCount}</div>
            <div>postID: {postID}</div>
        </div>
    )
}

export default Comment;