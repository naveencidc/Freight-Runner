// imports
import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// components & utilities
import { navigationRef } from "../utils/Utility";
import SplashScreen from "../screens/SplashScreen";
import UpdateScreen from "../screens/UpdateScreen";
import Landing from "../screens/Landing";
import TermsOfService from "../screens/setup/TermsOfService";
import PrivacyPolicyScreen from "../screens/setup/PrivacyPolicyScreen";
import ContactUs from "../screens/ContactUsScreen";
import AuthNavigator from "./AuthNavigator";
import BottomTabNavigator from "./BottomTabNavigator";
import LoadDetailScreen from "../screens/Home/LoadDetailScreen";
import NotificationListScreen from "../screens/Home/NotificationListScreen";
import SosScreen from "../screens/Sos";
import TruckList from "../screens/Home/TruckList";
import TruckAndTrailerDetail from "../screens/Home/TruckAndTrailerDetail";
import TrailerList from "../screens/Home/TrailerList";
import CargoTypes from "../screens/Home/CargoTypes";
import BusinessInfoAndAddress from "../screens/Home/BusinessInfoAndAddress";
import RegistrationServiceAreasScreen from "../screens/Registeration/RegistrationServiceAreasScreen";
import RegistrationPersonalDetailScreen from "../screens/Registeration/RegistrationPersonalDetailScreen";
import RegistrationUnderReviewScreen from "../screens/Registeration/RegistrationUnderReviewScreen";
import RegistrationRejectedScreen from "../screens/Registeration/RegistrationRejectedScreen";
import RegistrationTruckDetailScreen from "../screens/Registeration/RegistrationTruckDetailScreen";

export type RootStackParamList = {
  splash: undefined;
  welcome: undefined;
  auth: undefined;
  main: undefined;
  UpdateScreen: undefined;
  Landing: undefined;
  termsOfService: undefined;
  PrivacyPolicyScreen: undefined;
  ContactUs: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

const MainNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        initialRouteName={"splash"}
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="splash" component={SplashScreen} />
        <RootStack.Screen name="UpdateScreen" component={UpdateScreen} />
        <RootStack.Screen name="Landing" component={Landing} />
        <RootStack.Screen name="termsOfService" component={TermsOfService} />
        <RootStack.Screen
          name="PrivacyPolicyScreen"
          component={PrivacyPolicyScreen}
        />
        <RootStack.Screen name="ContactUs" component={ContactUs} />

        {/* Registration Related */}

        <RootStack.Screen
          name="RegistrationPersonalDetailScreen"
          component={RegistrationPersonalDetailScreen}
        />
        <RootStack.Screen
          name="RegistrationRejectedScreen"
          component={RegistrationRejectedScreen}
        />
        <RootStack.Screen
          name="RegistrationUnderReviewScreen"
          component={RegistrationUnderReviewScreen}
        />

        <RootStack.Screen
          name="RegistrationTruckDetailScreen"
          component={RegistrationTruckDetailScreen}
        />
        <RootStack.Screen
          name="RegistrationServiceAreasScreen"
          component={RegistrationServiceAreasScreen}
        />
        <RootStack.Screen
          name="auth"
          component={AuthNavigator}
          options={{ animationEnabled: false }}
        />
        <RootStack.Screen
          name="main"
          component={BottomTabNavigator}
          options={{ animationEnabled: false }}
        />
        <RootStack.Screen
          name="LoadDetailScreen"
          component={LoadDetailScreen}
        />
        <RootStack.Screen
          name="NotificationListScreen"
          component={NotificationListScreen}
        />
        <RootStack.Screen name="SosScreen" component={SosScreen} />
        <RootStack.Screen name="TruckList" component={TruckList} />
        <RootStack.Screen
          name="TruckAndTrailerDetail"
          component={TruckAndTrailerDetail}
        />
        <RootStack.Screen name="TrailerList" component={TrailerList} />
        <RootStack.Screen name="CargoTypes" component={CargoTypes} />
        <RootStack.Screen
          name="BusinessInfoAndAddress"
          component={BusinessInfoAndAddress}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
