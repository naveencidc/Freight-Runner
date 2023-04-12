/*************************************************
 * FreightRunner
 * @exports
 * @function RegistrationBusinessInfoScreen.tsx
 * @extends Component
 * Created by Naveen E on 17/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, ViewStyle, TextInput, Dimensions, SafeAreaView } from "react-native";
import { withNavigation } from "react-navigation";
import { Formik } from "formik";
import { CustomButton, Screen, SimpleInput as Input, Text, View } from "../../components";
import { NavigationProps } from "../../navigation";
import { registerBusinessInfo } from "../../services/registrationService";
import colors1 from "../../styles/colors";
import storage from "../../helpers/storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SnackbarContext, SnackbarContextType } from "../../context/SnackbarContext";
import HeaderWithBack from "../../components/HeaderWithBack";
import { MyContext } from ".././../../app/context/MyContextProvider";
import { updateOnbardingStatus } from "../../services/userService";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

type Props = NavigationProps;
type FormProps = {
  user_id: string;
  name: string;
  scac_code: string;
  mc: string;
  us_dot: string;
  federal_id: string;
  dba: string;
  cdl: string;
};

const initialValues: FormProps = {
  user_id: "",
  name: "",
  scac_code: "",
  mc: "",
  us_dot: "",
  federal_id: "",
  dba: "",
  cdl: ""
};

function RegistrationBusinessInfo({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const { setMessage, setVisible } = useContext<SnackbarContextType>(SnackbarContext);
  const global = useContext(MyContext);
  console.log("-state", global.myState);

  useEffect(() => {
    const { state } = navigation;
    if (state.params && state.params.setup && state.params.setupOrgId) {
      setSetup({ setup: true, orgId: state.params.setupOrgId });
    }
  }, [navigation]);

  const onSubmit = async (values: FormProps) => {
    const userDetail = await storage.get("userData");
    if (
      values.name === "" ||
      values.scac_code === "" ||
      values.us_dot === "" ||
      values.mc === "" ||
      values.cdl === "" ||
      values.federal_id === "" ||
      values.dba === ""
    ) {
      Alert.alert("Error", "Please enter the valid business information");
    } else {
      setLoading(true);
      try {
        //Create Personal information api call
        await registerBusinessInfo({
          user_id: userDetail.user_id,
          name: values.name,
          scac_code: values.scac_code,
          mc: values.mc,
          us_dot: values.mc,
          federal_id: values.federal_id,
          dba: values.dba,
          cdl: values.cdl
        })
          .then(async response => {
            setLoading(false);
            console.log(" Login response", response);
            if (response.status === 201) {
              global.myDispatch({ type: "REGISTER_BUSINESS_INFO_SUCCESS", payload: response });
              const updateOnbardingStatusResponse = await updateOnbardingStatus({
                user_id: userDetail.user_id,
                is_onboard_pending: 2,
                completed_step: 5,
                is_welcome_screen_viewed: 2
              });
              setMessage("Business Info Updated Successfully");
              navigation.navigate("RegistrationBusinessAddressScreen");
              setVisible(true);
              setLoading(false);
            }
          })
          .catch(e => {
            setLoading(false);
            console.log("create profile error", e.response);
            Alert.alert("Error", e.response.data.message);
            // returnResponse = e.response;
          });
      } catch (e) {
        Alert.alert(
          "Error",
          "There was a problem registering your Business Info. Please try again soon."
        );
        setLoading(false);
      }
    }
  };
  const business_name = useRef();
  const scac_code = useRef();
  const mc = useRef();
  const us_dot = useRef();
  const federal_id = useRef();
  const dba = useRef();
  const cdl = useRef();

  // const validationSchema = yup.object().shape({
  //   name: yup
  //     .string()
  //     .required("Please enter a valid email address:")
  //     .email("Please enter a valid email address:"),
  //   password: yup.string().required("Please enter your password:")
  // });

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        title="BUSINESS INFO"
        onPress={() => navigation.goBack()}
        isRightText={false}
        rightText="SELECT ALL"
        rightOnPress={() => navigation.goBack()}
      ></HeaderWithBack>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              paddingHorizontal: deviceWidth / 20,
              color: colors1.background,
              fontSize: 18,
              fontWeight: "600",
              paddingVertical: deviceHeight / 40
            }}
          >
            Tell us about your Business
          </Text>

          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            // validationSchema={validationSchema}
            render={({ handleBlur, handleChange, values, handleSubmit, touched, errors }) => {
              return (
                <View style={{ flex: 1 }}>
                  <View style={styles.textInputView}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: touched.name && errors.name ? colors1.red : "gray"
                      }}
                    >
                      {touched.name && errors.name ? errors.name : "Business Name"}
                    </Text>
                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                      <TextInput
                        ref={business_name}
                        style={{ padding: 0, fontWeight: "bold", fontSize: 16, flex: 1 }}
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        value={values.name}
                        placeholder=""
                        keyboardType="default"
                        returnKeyType="next"
                        onSubmitEditing={() => scac_code.current.focus()}
                        blurOnSubmit={false}
                      />
                    </View>
                  </View>

                  <View style={[styles.textInputView, { marginTop: deviceHeight / 60 }]}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: touched.scac_code && errors.scac_code ? colors1.red : "gray"
                      }}
                    >
                      {touched.scac_code && errors.scac_code ? errors.scac_code : "SCAC Code"}
                    </Text>
                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                      <TextInput
                        ref={scac_code}
                        style={{ padding: 0, fontWeight: "bold", fontSize: 16, flex: 1 }}
                        onChangeText={handleChange("scac_code")}
                        onBlur={handleBlur("scac_code")}
                        value={values.scac_code}
                        placeholder=""
                        keyboardType="numeric"
                        returnKeyType="next"
                        onSubmitEditing={() => mc.current.focus()}
                        blurOnSubmit={false}
                      />
                    </View>
                  </View>

                  <View style={[styles.textInputView, { marginTop: deviceHeight / 60 }]}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: touched.mc && errors.mc ? colors1.red : "gray"
                      }}
                    >
                      {touched.mc && errors.mc ? errors.mc : "MC#"}
                    </Text>
                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                      <TextInput
                        ref={mc}
                        style={{ padding: 0, fontWeight: "bold", fontSize: 16, flex: 1 }}
                        onChangeText={handleChange("mc")}
                        onBlur={handleBlur("mc")}
                        value={values.mc}
                        placeholder=""
                        keyboardType="numeric"
                        returnKeyType="next"
                        onSubmitEditing={() => us_dot.current.focus()}
                        blurOnSubmit={false}
                      />
                    </View>
                  </View>

                  <View style={[styles.textInputView, { marginTop: deviceHeight / 60 }]}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: touched.us_dot && errors.us_dot ? colors1.red : "gray"
                      }}
                    >
                      {touched.us_dot && errors.us_dot ? errors.us_dot : "US DOT#"}
                    </Text>
                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                      <TextInput
                        ref={us_dot}
                        style={{ padding: 0, fontWeight: "bold", fontSize: 16, flex: 1 }}
                        onChangeText={handleChange("us_dot")}
                        onBlur={handleBlur("us_dot")}
                        value={values.us_dot}
                        placeholder=""
                        keyboardType="numeric"
                        returnKeyType="next"
                        onSubmitEditing={() => federal_id.current.focus()}
                        blurOnSubmit={false}
                      />
                    </View>
                  </View>

                  <View style={[styles.textInputView, { marginTop: deviceHeight / 60 }]}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: touched.federal_id && errors.federal_id ? colors1.red : "gray"
                      }}
                    >
                      {touched.us_dot && errors.us_dot ? errors.us_dot : "Federal ID#"}
                    </Text>
                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                      <TextInput
                        ref={federal_id}
                        style={{ padding: 0, fontWeight: "bold", fontSize: 16, flex: 1 }}
                        onChangeText={handleChange("federal_id")}
                        onBlur={handleBlur("federal_id")}
                        value={values.federal_id}
                        placeholder=""
                        keyboardType="default"
                        returnKeyType="next"
                        onSubmitEditing={() => dba.current.focus()}
                        blurOnSubmit={false}
                      />
                    </View>
                  </View>

                  <View style={[styles.textInputView, { marginTop: deviceHeight / 60 }]}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: touched.dba && errors.dba ? colors1.red : "gray"
                      }}
                    >
                      {touched.dba && errors.dba ? errors.dba : "DBA"}
                    </Text>
                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                      <TextInput
                        ref={dba}
                        style={{ padding: 0, fontWeight: "bold", fontSize: 16, flex: 1 }}
                        onChangeText={handleChange("dba")}
                        onBlur={handleBlur("dba")}
                        value={values.dba}
                        placeholder=""
                        keyboardType="default"
                        returnKeyType="next"
                        onSubmitEditing={() => cdl.current.focus()}
                        blurOnSubmit={false}
                      />
                    </View>
                  </View>

                  <View style={[styles.textInputView, { marginTop: deviceHeight / 60 }]}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: touched.cdl && errors.cdl ? colors1.cdl : "gray"
                      }}
                    >
                      {touched.cdl && errors.cdl ? errors.cdl : "CDL#"}
                    </Text>
                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                      <TextInput
                        ref={cdl}
                        style={{ padding: 0, fontWeight: "bold", fontSize: 16, flex: 1 }}
                        onChangeText={handleChange("cdl")}
                        onBlur={handleBlur("cdl")}
                        value={values.cdl}
                        placeholder=""
                        keyboardType="numeric"
                        returnKeyType="next"
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      paddingVertical: deviceHeight / 35,
                      paddingHorizontal: deviceWidth / 20
                    }}
                  >
                    <CustomButton
                      titleColor={colors1.white}
                      borderColor={"#1F1F1F"}
                      onPress={handleSubmit}
                      title="Next"
                      backgroundColor={colors1.background}
                      btnLoading={loading}
                    ></CustomButton>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

type Styles = {
  container: ViewStyle;
  textInputView: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    backgroundColor: "white"
  },
  textInputView: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#F5F4F7",
    borderColor: "#EDEDED",
    borderWidth: 1,
    paddingVertical: deviceHeight / 85,
    paddingHorizontal: deviceWidth / 20,
    marginHorizontal: 15,
    borderRadius: 8,
    shadowOffset: { width: -2, height: 2 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3
  }
});

export default withNavigation(RegistrationBusinessInfo);
