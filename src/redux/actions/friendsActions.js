
//friends actions
export const SET_FRIENDS = 'SET_FRIENDS';
export const SET_FRIEND_USERNAME = 'SET_FRIEND_USERNAME';
export const SET_SEARCH_RESULT = 'SET_SEARCH_RESULT';
export const SET_ALL_USERS = 'SET_ALL_USERS';
export const fetchFriends = (friendsList) => {
  return {
    type: SET_FRIENDS,
    payload: friendsList,
  };

};

export const setFriendUsername = (friend) => {
  return {
    type: SET_FRIEND_USERNAME,
    payload: friend
  }
}
//add friend
export const addFriend = (friend) => ({
  type: SET_SEARCH_RESULT,
  payload: friend,
});

export const addAllUsers = (users) => ({
  type: SET_ALL_USERS,
  payload: users
});