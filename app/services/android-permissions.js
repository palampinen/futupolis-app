import { PermissionsAndroid } from 'react-native';
import { get, noop } from 'lodash';

async function requestLocationPermission(callback = noop, error = noop) {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Futupolis Location Permission',
        message: 'Futupolis needs access to location ' + 'to serve best possible experience.',
      }
    );
    if (granted) {
      console.log('You can use the Location');
      callback();
    } else {
      console.log('Location permission denied');
      error();
    }
  } catch (err) {
    console.warn(err);
    error();
  }
}

async function requestCameraPermission(cb = noop) {
  try {
    /*
    const grantCamera = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        'title': 'Futupolis Camera Permission',
        'message': 'Futupolis needs access to camera ' +
                   'to post images to feed.'
      }
    );

    const grantWrite = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        'title': 'Futupolis Storage Permission',
        'message': 'Futupolis needs access to storage ' +
        'to post images to feed.'
      }
    );
    */

    const grantCamera = await PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ],
      {
        title: 'Futupolis Camera Permission',
        message: 'Futupolis needs access to camera and storage to post images to feed.',
      }
    ); /*.then((response) => {
      console.log('PERMISSIONS: ', response);
    });*/

    if (grantCamera) {
      console.log('You can use the Camera and storage');
      cb();
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

export default {
  requestLocationPermission,
  requestCameraPermission,
};
