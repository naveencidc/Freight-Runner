/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useContext, useEffect, useState, useRef } from "react";
import type { PropsWithChildren } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";
import { MyContextProvider } from "./app/context";
import {
  SnackbarProvider,
  SnackbarContext,
} from "./app/context/SnackbarContext";
import Snackbar from "./app/components/Snackbar";
import MainNavigator from "./app/routes/MainNavigator";
import { request, PERMISSIONS } from "react-native-permissions";
import { PLATFORM } from "./app/styles/globalStyles";
import UploadDialog from "./app/components/UploadDialog";
import { showMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import SplashScreen from "react-native-splash-screen";
import OneSignal from "react-native-onesignal";
import Config from "react-native-config";
import { navigate } from "./app/utils/Utility";
import storage from "./app/helpers/storage";
import { enableLatestRenderer } from "react-native-maps";

enableLatestRenderer();

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  // OneSignal Initialization
  OneSignal.setAppId(Config.ONESIGNAL_APP_ID);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);

    try {
      async function fetchStateListAPI() {
        if (PLATFORM === "ios") {
          await request(PERMISSIONS.IOS.CAMERA);
          await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        } else {
          await request(PERMISSIONS.ANDROID.CAMERA);
        }
        // promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
        // We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
        OneSignal.promptForPushNotificationsWithUserResponse();
        const device: any = await OneSignal.getDeviceState();
        await storage.set("deviceId", device.userId);

        //Method for handling notifications received while app in foreground
        OneSignal.setNotificationWillShowInForegroundHandler(
          (notificationReceivedEvent) => {
            console.log(
              "OneSignal: notification will show in foreground:",
              notificationReceivedEvent
            );
            let notification: any = notificationReceivedEvent.getNotification();
            const data = notification.additionalData;
            const loadId = notification?.additionalData?.load_id;

            showMessage({
              message: notification.title,
              description: notification.body,
              type: "default",
              hideOnPress: true,
              autoHide: true,
              duration: 5000,
              onPress: () => {
                if (loadId) {
                  navigate("LoadDetailScreen", {
                    loadDetail: { load_id: loadId },
                  });
                }
              },
            });
            // Complete with null means don't show a notification.
            notificationReceivedEvent.complete();
          }
        );

        //Method for handling notifications opened
        let notificationData: any;
        OneSignal.setNotificationOpenedHandler(async (notification) => {
          let notificationMessgae: any = notification.notification;
          const loadId = notificationMessgae?.additionalData?.load_id;
          if (loadId) {
            await storage.set("notificationPayload", {
              load_id: loadId,
              isFromNotification: true,
            });
            navigate("splash", {});
          }
        });
      }
      fetchStateListAPI();
    } catch (error) {}
  }, []);
  return (
    <MyContextProvider>
      <SnackbarProvider>
        <MainNavigator />
        <SnackbarContext.Consumer>
          {({ message, setVisible, visible, duration }) => (
            <Snackbar
              duration={duration ? duration : 5000}
              onDismiss={() => setVisible(false)}
              visible={visible}
            >
              {message}
            </Snackbar>
          )}
        </SnackbarContext.Consumer>
      </SnackbarProvider>
      <UploadDialog />
      <FlashMessage position="top" />
    </MyContextProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default App;
