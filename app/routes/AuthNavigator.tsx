// imports
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// components & utilities
import LoginScreen from '../screens/Login';
import ForgotPassword from '../screens/ForgotPassword';
import CreatePassword from '../screens/CreatePassword';
// import SignupScreen from "../screens/auth/SignupScreen";
// import ForgotPassword from "../screens/auth/ForgotPassword";
// import ResetPassword from "../screens/auth/ResetPassword";
// import EmailVerification from "../screens/auth/EmailVerification";
// import Subscription from "../screens/auth/Subscription";

export type AuthStackParamList = {
  login: undefined;
  // signup: undefined;
  // forgotPassword: undefined;
  // emailVerification: undefined;
  // subscription: undefined;
  // resetPassword: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="login" component={LoginScreen} />
      {/* <AuthStack.Screen name="signup" component={SignupScreen} /> */}
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <AuthStack.Screen name="CreatePassword" component={CreatePassword} />
      {/* <AuthStack.Screen
        name="emailVerification"
        component={EmailVerification}
      /> */}
      {/* <AuthStack.Screen name="subscription" component={Subscription} /> */}
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
