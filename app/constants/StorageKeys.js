import { APP_STORAGE_KEY } from '../../env';

const tokenKeys = {
  token: `${APP_STORAGE_KEY}:token`,
  city: `${APP_STORAGE_KEY}:city`,
  mapCategory: `${APP_STORAGE_KEY}:mapCategory`,
  loginInProgress: `${APP_STORAGE_KEY}:loginInProgress`,
  notificationsLastChecked: `${APP_STORAGE_KEY}:notificationsLastChecked`,
};

export default tokenKeys;
