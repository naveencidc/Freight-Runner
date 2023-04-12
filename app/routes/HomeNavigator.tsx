/*************************************************
 * Beynd
 * @exports
 * HomeNavigator.tsx
 * Created by Abdul on 09/02/2023
 * Copyright © 2023 Beynd. All rights reserved.
 *************************************************/

// imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// components & utilities

import ContactUs from "../screens/ContactUsScreen";
import Home from "../screens/Home/Home";

export type HomeStackParamList = {
  dashboard: undefined;
  Home: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={Home} />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
