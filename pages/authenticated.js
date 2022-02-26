import { verifyToken } from '../src/utils/init-firebaseAdmin';
import nookies from 'nookies'
import { fetchAllUsers, fetchFriendsData, fetchUserProfile } from '../src/utils/firebase-adminhelpers';

// const authenticatedPage = ({session}) => {

//     if (session) {
//         return (
//             <div>Authenticated</div>
//         )
//     } else {
//         return (<div>Loading..</div>)
//     }
// }


const authenticatedPage = (props) => {

  return (<div>{props.session}</div>)
}
export async function getServerSideProps(context) {
    try {
       
      const cookies = nookies.get(context);
      //this returns the user
      const user = await verifyToken(cookies.token);
      //this returns the user profile in firestore
      const userProfile = await fetchUserProfile(user)
      //get all friends data
      const friendsData = await fetchFriendsData(userProfile)
      const allUsersData = await fetchAllUsers()
      return {
        props: { userProfile: userProfile, friendsData: friendsData, allUsersData: allUsersData },
      };
    } catch (err) {
        console.log(err)
      context.res.writeHead(302, { Location: "/login" });
      context.res.end();
      return { props: {} };
    }
  }

export default authenticatedPage;