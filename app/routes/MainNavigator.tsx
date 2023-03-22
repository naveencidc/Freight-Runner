// imports
import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

// components & utilities
import {navigationRef} from '../utils/Utility';
import SplashScreen from '../screens/SplashScreen';
import UpdateScreen from '../screens/UpdateScreen';
import Landing from '../screens/Landing';
import TermsOfService from '../screens/setup/TermsOfService';
import PrivacyPolicyScreen from '../screens/setup/PrivacyPolicyScreen';
import ContactUs from '../screens/ContactUsScreen';
import AuthNavigator from './AuthNavigator';
// import BottomTabNavigator from "./BottomTabNavigator";

export type RootStackParamList = {
  splash: undefined;
  welcome: undefined;
  auth: undefined;
  main: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

const MainNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        initialRouteName={'splash'}
        screenOptions={{headerShown: false}}>
        <RootStack.Screen name="splash" component={SplashScreen} />
        <RootStack.Screen name="UpdateScreen" component={UpdateScreen} />
        <RootStack.Screen name="Landing" component={Landing} />
        <RootStack.Screen name="termsOfService" component={TermsOfService} />
        <RootStack.Screen
          name="PrivacyPolicyScreen"
          component={PrivacyPolicyScreen}
        />
        <RootStack.Screen name="ContactUs" component={ContactUs} />

        <RootStack.Screen
          name="auth"
          component={AuthNavigator}
          options={{animationEnabled: false}}
        />
        {/* <RootStack.Screen
          name="main"
          component={BottomTabNavigator}
          options={{ animationEnabled: false }}
        /> */}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
