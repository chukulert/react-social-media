import styles from "./SideTabProfile.module.css";
import Image from "next/image";
import Link from "next/link";

const SideTabProfile = ({ userProfile, followingCount }) => {
  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
     
          <Link href={`/profile/${userProfile.userID}`}>
            <a className={styles.profileLink}>
             <Image
                src={userProfile.profilePhoto || '/profile-photo.png'}
                width={50}
                height={50}
                className="avatar"
                alt="profile photo"
              />
              <div className={styles.flexCenter}>{userProfile.displayName}</div>
            </a>
          </Link>
    
        <div className={styles.footer}>
          <p>
            Following: <strong>{followingCount}</strong>
          </p>
          <p>
            Followers: <strong>{userProfile.followers.length}</strong>
          </p>
        </div>
      
      </div>
    </div>
  );
};

export default SideTabProfile;
