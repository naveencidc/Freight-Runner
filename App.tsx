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

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

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
