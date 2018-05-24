package com.futupolis;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import cl.json.RNSharePackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.reactnative.photoview.PhotoViewPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.image.zoom.ReactImageZoom;
import com.imagepicker.ImagePickerPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.auth0.react.A0Auth0Package;
import org.gamega.RNAsyncStoragePackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new FIRMessagingPackage(),
            new LocationServicesDialogBoxPackage(),
            new RNAsyncStoragePackage(),
            new VectorIconsPackage(),
            new RNSharePackage(),
            new ReactNativePushNotificationPackage(),
            new PhotoViewPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new ReactImageZoom(),
            new ImagePickerPackage(),
            new RNFirebasePackage(),
            new RNDeviceInfo(),
            new BlurViewPackage(),
            new A0Auth0Package(),
            new RNFirebaseDatabasePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
