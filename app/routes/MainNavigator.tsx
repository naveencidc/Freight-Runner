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
import RegistrationTrailerDetailScreen from "../screens/Registeration/RegistrationTrailerDetailScreen";
import SettingsList from "../screens/Home/settings/SettingsList";
import ChangePassword from "../screens/Home/settings/ChangePassword";
import TransactionList from "../screens/TransactionList";
import TransactionDetail from "../screens/Home/TransactionDetail";
import WithdrawFunds from "../screens/Home/settings/WithdrawFunds";
import Payouts from "../screens/Home/Payouts";
import Premium from "../screens/Home/settings/Premium";
import PremiumPricing from "../screens/Home/settings/PremiumPricing";
import SelectPaymentMethod from "../screens/Home/settings/SelectPaymentMethod";
import PaymentMethodsList from "../screens/Home/PaymentMethodsList";
import PayoutAccounts from "../screens/Home/PayoutAccounts";
import Accounts from "../screens/Home/Accounts";
import BankAccountDetails from "../screens/Home/BankAccountDetails";
import AccountDetail from "../screens/Home/AccountDetail";
import AddAccounts from "../screens/Home/AddAccounts";
import AddCardDetail from "../screens/Home/AddCardDetail";
import RegistrationApprovedScreen from "../screens/Registeration/RegistrationApprovedScreen";
import RegistrationUploadW9Screen from "../screens/Registeration/RegistrationUploadW9Screen";
import PickUpDetailScreen from "../screens/Home/PickUpDetailScreen";
import WelcomeScreen from "../screens/Registeration/WelcomeScreen";
import BolScreen from "../screens/Home/BolScreen";
import PdfViewer from "../screens/Home/PdfViewer";
import MyLocation from "../screens/Home/MyLocation";
import ChooseFromMap from "../screens/Home/ChooseFromMap";

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
          name="RegistrationTrailerDetailScreen"
          component={RegistrationTrailerDetailScreen}
        />
        <RootStack.Screen
          name="RegistrationServiceAreasScreen"
          component={RegistrationServiceAreasScreen}
        />
        <RootStack.Screen
          name="RegistrationApprovedScreen"
          component={RegistrationApprovedScreen}
        />
        <RootStack.Screen
          name="RegistrationUploadW9Screen"
          component={RegistrationUploadW9Screen}
        />
        <RootStack.Screen name="WelcomeScreen" component={WelcomeScreen} />

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

        <RootStack.Screen name="SettingsList" component={SettingsList} />
        <RootStack.Screen name="ChangePassword" component={ChangePassword} />
        <RootStack.Screen name="TransactionList" component={TransactionList} />
        <RootStack.Screen
          name="TransactionDetail"
          component={TransactionDetail}
        />
        <RootStack.Screen name="WithdrawFunds" component={WithdrawFunds} />
        <RootStack.Screen name="Payouts" component={Payouts} />
        <RootStack.Screen name="Premium" component={Premium} />
        <RootStack.Screen name="PremiumPricing" component={PremiumPricing} />
        <RootStack.Screen
          name="SelectPaymentMethod"
          component={SelectPaymentMethod}
        />
        <RootStack.Screen
          name="PaymentMethodsList"
          component={PaymentMethodsList}
        />
        <RootStack.Screen name="PayoutAccounts" component={PayoutAccounts} />
        <RootStack.Screen name="Accounts" component={Accounts} />
        <RootStack.Screen
          name="BankAccountDetails"
          component={BankAccountDetails}
        />
        <RootStack.Screen name="AccountDetail" component={AccountDetail} />
        <RootStack.Screen name="AddAccounts" component={AddAccounts} />
        <RootStack.Screen name="AddCardDetail" component={AddCardDetail} />
        <RootStack.Screen
          name="PickUpDetailScreen"
          component={PickUpDetailScreen}
        />
        <RootStack.Screen name="BolScreen" component={BolScreen} />
        <RootStack.Screen name="PdfViewer" component={PdfViewer} />
        <RootStack.Screen name="MyLocation" component={MyLocation} />
        <RootStack.Screen name="ChooseFromMap" component={ChooseFromMap} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
