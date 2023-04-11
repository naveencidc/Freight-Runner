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

export type HomeStackParamList = {
  dashboard: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={ContactUs} />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
