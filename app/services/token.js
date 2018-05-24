import AsyncStorage from './AsyncStorage';
import STORAGE_KEYS from '../constants/StorageKeys';

// const getUserToken = async () => await AsyncStorage.getItem(STORAGE_KEYS.token, returnToken);
// .then(token => {
//   console.log(token);
//   const tokenObj = token ? JSON.parse(token) : {};
//   return tokenObj.userToken;
// })
// .catch(err => {
//   console.log('error getting user token', err);
// });

// const returnToken = (err, token) => {
//   const tokenObj = token ? JSON.parse(token) : {};
//   return tokenObj.userToken;
// };

export const getUserToken = viewName =>
  AsyncStorage.getItem(STORAGE_KEYS.token).then(token => {
    const tokenObj = token ? JSON.parse(token) : {};
    return tokenObj.userToken;
  });

export default getUserToken;
