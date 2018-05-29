/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <Firebase.h>

#import <React/RCTPushNotificationManager.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import "RNFirebaseNotifications.h"
#import "RNFirebaseMessaging.h"

@import GoogleMaps;
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  NSURL *jsCodeLocation;

  [GMSServices provideAPIKey:@"AIzaSyD-mtFqN7u86BpCduAu6kAzjnY_A_FHoxI"];
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Futupolis"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [RNFirebaseNotifications configure];

  return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url
    sourceApplication:sourceApplication annotation:annotation];
}

//  react-native-firebase Notifications
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
                                                       fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
}

// react-native-fcm
// - (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
// {
//  [RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
// }

// #if defined(__IPHONE_11_0)
// - (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
// {
//  [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
// }
// #else
// - (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)())completionHandler
// {
//  [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
// }
// #endif

//  //You can skip this method if you don't want to use local notification
// -(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
//  [RNFIRMessaging didReceiveLocalNotification:notification];
// }

// - (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
//  [RNFIRMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
// }

// // Required to register for notifications
//  - (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
//  {
//   [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
//  }
//  // Required for the register event.
//  - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
//  {
//   [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
//  }
//  // Required for the notification event. You must call the completion handler after handling the remote notification.
//  - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
//                                                         fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
//  {
//    [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
//  }
//  // Required for the registrationError event.
//  - (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
//  {
//   [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
//  }
//  // Required for the localNotification event.
//  - (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
//  {
//   [RCTPushNotificationManager didReceiveLocalNotification:notification];
//  }


@end
