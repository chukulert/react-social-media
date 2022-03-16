
import styles from './FriendListItem.module.css'
import Link from 'next/link'
import Image from 'next/image'

const FriendListItem = (props) => {
    const {displayName, profilePhoto, id, handleUserClick } = props


    return (
        <div className={styles.friendListItemContainer} onClick={handleUserClick} id={id}>
           <div><Image src={profilePhoto} width={50} height={50} alt='profile photo'  className='avatar' /></div>
            <div className={styles.displayNameContainer}><Link href={`/profile/${id}`}><a className={styles.displayName}>{displayName}</a></Link>
</div>        </div>
    )
}

export default FriendListItem