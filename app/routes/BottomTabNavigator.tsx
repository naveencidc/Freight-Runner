/*************************************************
 * Beynd
 * @exports
 * BottomTabNavigator.tsx
 * Created by Abdul on 09/02/2023
 * Copyright © 2023 Beynd. All rights reserved.
 *************************************************/

// imports
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, ImageBackground, Platform, StyleSheet } from "react-native";

// components & utilities
import HomeNavigator from "./HomeNavigator";
// import RecipientsNavigator from "./RecipientsNavigator";
import ProfileNavigator from "./ProfileNavigator";
import FastImage from "react-native-fast-image";
import BoardIcon from "react-native-vector-icons/AntDesign";
import colors from "../styles/colors";
import CommunityNavigator from "./CommunityNavigator";
import { fontSizes } from "../styles/globalStyles";

export type BottomTabParamList = {
  login: undefined;
  signup: undefined;
  forgotPassword: undefined;
  emailVerification: undefined;
};

// global initialization
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconStyle = { height: 18, width: 18 };

          if (route.name === "Load Offers") {
            return (
              <FastImage
                style={styles.bottomTabsIcon}
                tintColor={!focused ? "#808F99" : null}
                source={require("../assets/images/requests.png")}
              />
            );
          } else if (route.name === "My Jobs") {
            return (
              <FastImage
                style={{ width: 20, height: 15 }}
                tintColor={!focused ? "#808F99" : null}
                source={require("../assets/images/myjobs-active.png")}
              />
            );
          } else if (route.name === "Load Board") {
            return (
              <BoardIcon
                name="dashboard"
                style={{ height: 25, width: 25 }}
                size={22}
                color={!focused ? "#808F99" : "#6E6EE5"}
              />
            );
          } else if (route.name === "Community") {
            return (
              <FastImage
                style={styles.bottomTabsIcon}
                tintColor={!focused ? "#808F99" : null}
                source={require("../assets/images/community-active.png")}
              />
            );
          } else if (route.name === "My Profile") {
            return (
              <FastImage
                style={styles.bottomTabsIcon}
                tintColor={!focused ? "#808F99" : null}
                source={require("../assets/images/profile-active.png")}
              />
            );
          }
        },
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: "#808F99",
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 80 : 60,
          paddingBottom: Platform.OS === "ios" ? 15 : 5,
        },
        tabBarLabelStyle: {
          paddingBottom: Platform.OS === "ios" ? 10 : 5,
          // fontSize: fontSizes.xSmall,
          marginTop: -10,
        },
      })}
    >
      <Tab.Screen
        name="Load Offers"
        component={HomeNavigator}
        options={{
          tabBarLabelPosition: "below-icon",
        }}
      />
      {/* <Tab.Screen
          name="My Jobs"
          component={RecipientsNavigator}
          options={{
            tabBarLabelPosition: "below-icon",
          }}
        /> */}
      {/* <Tab.Screen
          name="Load Board"
          component={ContentNavigator}
          options={{
            tabBarLabelPosition: "below-icon",
          }}
        /> */}
      <Tab.Screen
        name="Community"
        component={CommunityNavigator}
        options={{
          tabBarLabelPosition: "below-icon",
        }}
      />

      <Tab.Screen
        name="My Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabelPosition: "below-icon",
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
const styles = StyleSheet.create({
  bottomTabsIcon: {
    width: 20,
    height: 20,
  },
});
