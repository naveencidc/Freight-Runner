// imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// components & utilities

import MyCommunity from "../screens/Home/MyCommunity";

export type ContentStackParamList = {
  MyCommunity: undefined;
};

const ContentStack = createStackNavigator<ContentStackParamList>();

const CommunityNavigator = () => {
  return (
    <ContentStack.Navigator screenOptions={{ headerShown: false }}>
      <ContentStack.Screen name="MyCommunity" component={MyCommunity} />
    </ContentStack.Navigator>
  );
};

export default CommunityNavigator;
