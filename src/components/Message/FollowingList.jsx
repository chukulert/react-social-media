const FollowingList = (props) => {
  const { following, handleUserClick } = props;

  const followingItems = (
    <ul>
      {following.map((user) => (
        // eslint-disable-next-line react/jsx-key

        <li key={user.userID} onClick={handleUserClick} id={user.userID}>
          <p>{user.displayName}</p>
          <p>{user.email}</p>
        </li>
      ))}
    </ul>
  );

  return <div>{followingItems}</div>;
};

export default FollowingList;
