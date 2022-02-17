
import styles from './FriendListItem.module.css'
import Link from 'next/link'

const FriendListItem = (props) => {
    // const {displaName, profilePhoto} = props

    return (
        <div>
            <p>Friend Item</p>
            <Link href={`/profile/${props.id}`}><a>{props.displayName}</a></Link>
            <p>{props.profilePhoto}</p>
        </div>
    )
}

export default FriendListItem