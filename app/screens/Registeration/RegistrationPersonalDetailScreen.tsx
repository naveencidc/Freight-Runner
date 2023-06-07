/*************************************************
 * FreightRunner
 * @exports
 * @function RegistrationPersonalDetailScreen.tsx
 * @extends Component
 * Created by Naveen E on 10/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Alert,
  StyleSheet,
  ViewStyle,
  Platform,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  SafeAreaView,
} from "react-native";
import { CheckBox, colors } from "react-native-elements";
// import { Dropdown } from "react-native-material-dropdown";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { Formik } from "formik";
import * as yup from "yup";
import { CustomButton, Text, View } from "../../components";
import {
  registerUser,
  getStateList,
  createProfile,
  updateProfile,
} from "../../services/registrationService";
import { fontSizes, STANDARD_PADDING } from "../../styles/globalStyles";
import { extractError } from "../../utilities/errorUtilities";
import colors1 from "../../styles/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import HeaderWithBack from "../../components/HeaderWithBack";
import FastImage from "react-native-fast-image";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import ImagePicker from "react-native-image-crop-picker";
import ActionSheet from "react-native-actionsheet";
import {
  deleteAWSImage,
  getProfileImage,
  uploadToS3,
} from "../../services/uploadS3Service";
const axios = require("axios").default;
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";
import Icon from "react-native-vector-icons/FontAwesome5";
import { MyContext } from "../../../app/context/MyContextProvider";
import storage from "../../helpers/storage";
import { updateOnbardingStatus } from "../../services/userService";
import * as Progress from "react-native-progress";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";

type FormProps = {
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  mobile: string;
  zipCode: string;
  email: string;
  password: string;
  mc: string;
  us_dot: string;
  businessEntity: string;
  federal_id: string;
  max_load_capacity: null;
};

function RegistrationPersonalDetailScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [indeterminate, setIndeterminate] = useState(true);
  const [selectedImageObject, setSelectedImageObject] = useState({});
  const [stateList, setStateList] = useState([]);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const [hidePass, setHidePass] = useState(true);
  const [checkMaxLength, setCheckMaxLength] = useState(false);
  const [checkNumber, setCheckNumber] = useState(false);
  const [checkCapitalLetter, setCheckCapitalLetter] = useState(false);
  const [checkSpecialCharacter, setSpecialCharacter] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [isAcceptTerms, setAcceptTerms] = useState(false);
  const [imgLoading, setimgLoading] = useState(false);

  const global: any = useContext(MyContext);
  const userProfileDetails =
    global.myState.userProfileDetails &&
    global.myState.userProfileDetails.partnerProfile;
  const [count, setCount] = useState(null);
  const [params, setparams] = useState({
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    mobile: "",
    zipCode: "",
    email: "",
    password: "",
    mc: "",
    us_dot: "",
    businessEntity: "",
    federal_id: "",
    max_load_capacity: null,
  });
  const [referral, setReferral] = useState("");
  let isFromEdit = route.params?.isFromEdit;
  let userPersonalDetail =
    global.myState.userProfileDetails?.partnerProfile?.partnerProfileDetails;
  const [accountTypePersonal, setaccountTypePersonal] = useState(
    isFromEdit ? (userPersonalDetail?.is_business === 1 ? false : true) : true
  );
  const getStateName = (stateList, stateCode) => {
    let stateObj = stateList.find((e) => e.code == stateCode);
    setSelectedStateCode(stateObj?.code);
    return stateObj?.name;
  };
  const refActionSheet = useRef(null);
  const showActionSheet = () => {
    if (refActionSheet.current) {
      refActionSheet.current.show();
    }
  };
  useEffect(() => {
    try {
      async function fetchStateListAPI() {
        const response = await getStateList();
        setStateList(response.data);
        if (isFromEdit) {
          setaccountTypePersonal(
            userPersonalDetail?.is_business === 1 ? false : true
          );
          setparams({
            firstName: userPersonalDetail.first_name,
            lastName: userPersonalDetail.last_name,
            city: userPersonalDetail.city,
            state: getStateName(response.data, userPersonalDetail.state),
            mobile: userPersonalDetail.mobile_number.slice(2),
            zipCode: userPersonalDetail.zip_code,
            email: "",
            password: "",
            mc: "",
            us_dot: "",
            businessEntity: "",
            federal_id: "",
            max_load_capacity: null,
          });
        }
      }
      fetchStateListAPI();
    } catch (error) {
      Alert.alert("Error", "There was an error. Please try again.");
    }
  }, []);

  const animate = () => {
    let progress = 0;
    setProgress(progress);
    setTimeout(() => {
      setIndeterminate(false);
      // setInterval(() => {
      //   progress += Math.random() / 5;
      //   if (progress > 1) {
      //     progress = 1;
      //   }
      //   setProgress(progress);
      // }, 500);
    }, 1500);
  };

  const _checkIsValueEntered = async (values, boolvalue, setFieldValue) => {
    if (
      values.businessEntity !== "" ||
      values.city !== "" ||
      values.state !== "" ||
      values.email !== "" ||
      values.federal_id !== "" ||
      values.firstName !== "" ||
      values.lastName !== "" ||
      values.mc !== "" ||
      values.mobile !== "" ||
      password !== "" ||
      values.us_dot !== "" ||
      values.zipCode !== ""
    ) {
      Alert.alert("", "Changes you made may not be saved", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            setPassword("");
            setaccountTypePersonal(boolvalue);
          },
        },
      ]);
    } else {
      setPassword("");
      setaccountTypePersonal(boolvalue);
    }
  };
  const onSubmit = async (values: FormProps) => {
    setLoading(true);
    animate();
    if (selectedImageObject.filename) {
      //Delete previous image
      if (
        userPersonalDetail.actual_profile_image &&
        userPersonalDetail.actual_profile_image.length > 0
      ) {
        const deleteImage = await deleteAWSImage({
          imageName: userPersonalDetail.actual_profile_image,
        });
      }
      const response = await uploadToS3(selectedImageObject, "image", global);
      if (response) {
        const getImage = await getProfileImage(selectedImageObject.filename);
        // if (getImage.status === 200) {
        //   // setSelectedImageObject(item);
        //   // setLoading(false);
        // }
      }
    }

    const userDetail = await storage.get("userData");
    try {
      if (isFromEdit) {
        await updateProfile({
          first_name: values.firstName,
          last_name: values.lastName,
          profile_image: selectedImageObject.filename,
          city: values.city,
          state: selectedStateCode,
          mobile_number: `+1${values.mobile}`,
          zip: values.zipCode,
          user_id: userDetail.user_id,
          max_load_capacity: null,
        })
          .then(async (response) => {
            setLoading(false);
            if (response.status === 201) {
              setMessage("Profile updated successfully.");
              setVisible(true);
              global.myDispatch({
                type: "GET_USER_PROFILE_DETAILS",
                payload: response.data,
              });
              navigation.goBack();
            }
          })
          .catch((e) => {
            setLoading(false);
            console.log("update profile error", e.response);
            Alert.alert("Error", e.response.data.message);
            // returnResponse = e.response;
          });
      } else {
        if (isAcceptTerms) {
          await createProfile({
            is_business: accountTypePersonal ? 2 : 1,
            email: values.email,
            password: password,
            first_name: values.firstName,
            last_name: values.lastName,
            profile_image: "",
            city: values.city,
            state: selectedStateCode,
            mobile_number: `+1${values.mobile}`,
            zip: values.zipCode,
            mc: values.mc,
            us_dot: values.us_dot,
            max_load_capacity: null,
            businessEntity: !accountTypePersonal ? values.businessEntity : null,
            federal_id: !accountTypePersonal ? values.federal_id : null,
            referral_code: referral,
          })
            .then(async (response) => {
              setLoading(false);
              if (response.status === 201) {
                await storage.set("tokens", {
                  access: response.data.access,
                  refresh: response.data.refresh,
                }); // To update new token when app loads
                await storage.set("userData", response.data); // To update new token when app loads
                const userToken = await storage.get("tokens"); // Get previous tokens
                global.myDispatch({
                  type: "USER_PERSONAL_INFO",
                  payload: response.data,
                });
                const userDetail = await storage.get("userData");
                const updateOnbardingStatusResponse =
                  await updateOnbardingStatus({
                    user_id: userDetail.user_id,
                    is_onboard_pending: 2,
                    completed_step: 0,
                    is_welcome_screen_viewed: 2,
                  });
                setMessage("Profile created successfully.");
                setVisible(true);
                navigation.navigate("RegistrationUnderReviewScreen");
                // navigation.navigate("TruckList", { isFromOnboarding: true });
              }
            })
            .catch((e) => {
              setLoading(false);
              console.log("create profile error", e.response);
              Alert.alert("Error", e.response.data.message);
              // returnResponse = e.response;
            });
        } else {
          setLoading(false);
          Alert.alert(
            "",
            "Please accept the Terms of Service and Privacy Policy."
          );
        }
      }
      //Create Personal information api call
    } catch (e) {
      Alert.alert(
        "Error",
        "There was a problem registering your email. Please try again soon."
      );
      setLoading(false);
    }
  };

  const validationSchema = yup.object().shape({
    accountTypePersonal: yup.boolean(),
    firstName: yup.string().required("Please enter a valid first name"),
    lastName: yup.string().required("Please enter a valid last name"),
    mc: yup.string().required("Please enter a valid MC#"),
    us_dot: yup.string().required("Please enter a valid US DOT#"),
    city: yup.string().required("Please enter a valid city"),
    state: yup.string().required("Please enter a valid state"),
    mobile: yup
      .string()
      .min(10, "Please enter a valid mobile number")
      .matches(/^[0-9]+$/, "Please enter a valid cell number")
      .required("Please enter a valid mobile number"),
    zipCode: yup.string().required("Please enter a valid zip code"),
    email: yup
      .string()
      .required("Please enter a valid email address")
      .email("Please enter a valid email address"),
    businessEntity: yup.string().when("accountTypePersonal", {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) =>
        schema.required("Please enter a valid business entity"),
    }),

    federal_id: yup.string().when("accountTypePersonal", {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) =>
        schema.required("Please enter a valid federal tax ID entity"),
    }),
  });

  const editvalidationSchema = yup.object().shape({
    firstName: yup.string().required("Please enter a valid first name"),
    lastName: yup.string().required("Please enter a valid last name"),
    city: yup.string().required("Please enter a valid city"),
    state: yup.string().required("Please enter a valid state"),
    mobile: yup
      .string()
      .min(10, "Please enter a valid mobile number")
      .matches(/^[0-9]+$/, "Please enter a valid cell number")
      .required("Please enter a valid mobile number"),
    zipCode: yup.string().required("Please enter a valid zip code"),
  });

  const ref_lastName = useRef();
  const ref_city = useRef();
  const ref_mobile = useRef();
  const ref_zipCode = useRef();
  const ref_email = useRef();
  const ref_password = useRef();
  const ref_mc = useRef();
  const ref_us_dot = useRef();
  const ref_businessName = useRef();
  const ref_federalID = useRef();
  const ref_referral = useRef();
  const ref_max_load_capacity = useRef();

  const _verifyPassword = (newPwd) => {
    setPassword(newPwd);
    if (newPwd.match(/[A-Z]/) != null) {
      setCheckCapitalLetter(true);
    } else {
      setCheckCapitalLetter(false);
    }
    if (newPwd.match(/[0-9]/) != null) {
      setCheckNumber(true);
    } else {
      setCheckNumber(false);
    }
    if (newPwd.match(/[!@$%&]/)) {
      setSpecialCharacter(true);
    } else {
      setSpecialCharacter(false);
    }
    if (
      checkCapitalLetter &&
      checkNumber &&
      checkSpecialCharacter &&
      checkMaxLength &&
      newPwd.length > 7
    ) {
      setCheckMaxLength(true);
    } else if (newPwd.length > 7) {
      setCheckMaxLength(true);
    } else {
      setCheckMaxLength(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack
        title="PERSONAL INFORMATION"
        onPress={() => navigation.goBack()}
      ></HeaderWithBack>
      <KeyboardAwareScrollView
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {isFromEdit ? (
          <View
            style={{ alignItems: "center", marginVertical: deviceHeight / 35 }}
          >
            <TouchableOpacity
              onPress={() => {
                if (!loading) {
                  showActionSheet();
                }
              }}
            >
              {loading ? (
                <Progress.Circle
                  size={100}
                  progress={global.myState.progress / 100}
                  indeterminate={indeterminate}
                  showsText={true}
                  color={"green"}
                  direction="clockwise"
                  fill="white"
                />
              ) : (
                <View>
                  <FastImage
                    onLoadStart={() => {
                      setimgLoading(true);
                    }}
                    onLoadEnd={() => {
                      setimgLoading(false);
                    }}
                    resizeMode={"cover"}
                    source={
                      selectedImageObject.path
                        ? { uri: selectedImageObject.path }
                        : userProfileDetails.partnerProfileDetails.profile_image
                        ? {
                            uri: userProfileDetails.partnerProfileDetails
                              .profile_image,
                          }
                        : require("../../../app/assets/images/profile.png")
                    }
                    style={{ height: 100, width: 100, borderRadius: 50 }}
                  />
                  {imgLoading ? (
                    <ShimmerPlaceholder
                      style={{
                        height: 100,
                        width: 100,
                        borderRadius: 50,
                        position: "absolute",
                      }}
                      LinearGradient={LinearGradient}
                    />
                  ) : null}
                </View>
              )}

              <FastImage
                resizeMode={"contain"}
                source={require("../../../app/assets/images/edit.png")}
                style={{
                  height: 30,
                  width: 30,
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                }}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        <Formik
          initialValues={{
            ...params,
            accountTypePersonal: accountTypePersonal,
          }}
          enableReinitialize={true}
          onSubmit={onSubmit}
          validationSchema={
            isFromEdit ? editvalidationSchema : validationSchema
          }
          render={({
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            errors,
            values,
            touched,
          }) => {
            return (
              <>
                <View style={{}}>
                  <View
                    style={{
                      paddingVertical: deviceHeight / 70,
                      paddingHorizontal: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: "gray",
                      }}
                    >
                      Account Type
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      {isFromEdit && !accountTypePersonal ? null : (
                        <CheckBox
                          disabled={isFromEdit}
                          containerStyle={{
                            backgroundColor: "transparent",
                            paddingHorizontal: 0,
                            borderWidth: 0,
                          }}
                          textStyle={{
                            color: accountTypePersonal ? "black" : "gray",
                          }}
                          title="Personal"
                          checkedIcon="dot-circle-o"
                          uncheckedIcon="circle-o"
                          checkedColor="black"
                          checked={accountTypePersonal}
                          onPress={() => {
                            _checkIsValueEntered(values, true, setFieldValue);
                          }}
                        />
                      )}
                      {isFromEdit && accountTypePersonal ? null : (
                        <CheckBox
                          disabled={isFromEdit}
                          containerStyle={{
                            backgroundColor: "transparent",
                            paddingHorizontal: 0,
                            borderWidth: 0,
                          }}
                          textStyle={{
                            color: !accountTypePersonal ? "black" : "gray",
                          }}
                          title="Business"
                          checkedIcon="dot-circle-o"
                          uncheckedIcon="circle-o"
                          checkedColor="black"
                          checked={!accountTypePersonal}
                          onPress={() => {
                            _checkIsValueEntered(values, false, setFieldValue);
                          }}
                        />
                      )}
                    </View>
                  </View>

                  <View
                    style={{
                      paddingHorizontal: deviceWidth / 30,
                      flexDirection: "column",
                      justifyContent: "space-between",
                      marginBottom: deviceHeight / 55,
                    }}
                  >
                    <Text
                      style={{ fontSize: 14, fontWeight: "500", color: "gray" }}
                    >
                      Personal Info
                    </Text>
                  </View>

                  <View style={styles.textInputView}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color:
                          touched.firstName && errors.firstName
                            ? colors1.red
                            : "gray",
                      }}
                    >
                      {touched.firstName && errors.firstName
                        ? errors.firstName
                        : "First Name"}
                    </Text>
                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                      <TextInput
                        autoCapitalize="sentences"
                        autoCorrect={false}
                        style={{
                          padding: 0,
                          fontWeight: "600",
                          fontSize: 16,
                          flex: 1,
                        }}
                        onChangeText={handleChange("firstName")}
                        onBlur={handleBlur("firstName")}
                        value={values.firstName}
                        placeholder=""
                        keyboardType="default"
                        returnKeyType="next"
                        onSubmitEditing={() => ref_lastName.current.focus()}
                        blurOnSubmit={false}
                      />
                    </View>
                  </View>

                  <View
                    style={[
                      styles.textInputView,
                      { marginTop: deviceHeight / 55 },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color:
                          touched.lastName && errors.lastName
                            ? colors1.red
                            : "gray",
                      }}
                    >
                      {touched.lastName && errors.lastName
                        ? errors.lastName
                        : "Last Name"}
                    </Text>
                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                      <TextInput
                        ref={ref_lastName}
                        autoCapitalize="sentences"
                        autoCorrect={false}
                        style={{
                          padding: 0,
                          fontWeight: "600",
                          fontSize: 16,
                          flex: 1,
                        }}
                        onChangeText={handleChange("lastName")}
                        onBlur={handleBlur("lastName")}
                        value={values.lastName}
                        placeholder=""
                        keyboardType="default"
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          accountTypePersonal
                            ? isFromEdit
                              ? ref_city.current.focus()
                              : ref_mc.current.focus()
                            : isFromEdit
                            ? ref_city.current.focus()
                            : ref_businessName.current.focus()
                        }
                        blurOnSubmit={false}
                      />
                    </View>
                  </View>
                  {!accountTypePersonal && !isFromEdit ? (
                    <>
                      <View
                        style={[
                          styles.textInputView,
                          { marginTop: deviceHeight / 55 },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "500",
                            color:
                              touched.businessEntity && errors.businessEntity
                                ? colors1.red
                                : "gray",
                          }}
                        >
                          {touched.businessEntity && errors.businessEntity
                            ? errors.businessEntity
                            : "Business Entity"}
                        </Text>
                        <View
                          style={{ flexDirection: "row", marginVertical: 5 }}
                        >
                          <TextInput
                            ref={ref_businessName}
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            style={{
                              padding: 0,
                              fontWeight: "600",
                              fontSize: 16,
                              flex: 1,
                            }}
                            onChangeText={handleChange("businessEntity")}
                            onBlur={handleBlur("businessEntity")}
                            value={values.businessEntity}
                            placeholder=""
                            keyboardType="default"
                            returnKeyType="next"
                            onSubmitEditing={() =>
                              ref_federalID.current.focus()
                            }
                            blurOnSubmit={false}
                          />
                        </View>
                      </View>

                      <View
                        style={[
                          styles.textInputView,
                          { marginTop: deviceHeight / 55 },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "500",
                            color:
                              touched.federal_id && errors.federal_id
                                ? colors1.red
                                : "gray",
                          }}
                        >
                          {touched.federal_id && errors.federal_id
                            ? errors.federal_id
                            : "Federal Tax ID"}
                        </Text>
                        <View
                          style={{ flexDirection: "row", marginVertical: 5 }}
                        >
                          <TextInput
                            ref={ref_federalID}
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            style={{
                              padding: 0,
                              fontWeight: "600",
                              fontSize: 16,
                              flex: 1,
                            }}
                            onChangeText={handleChange("federal_id")}
                            onBlur={handleBlur("federal_id")}
                            value={values.federal_id}
                            placeholder=""
                            keyboardType="default"
                            returnKeyType="next"
                            onSubmitEditing={() => ref_mc.current.focus()}
                            blurOnSubmit={false}
                          />
                        </View>
                      </View>
                    </>
                  ) : null}

                  {!isFromEdit ? (
                    <>
                      <View
                        style={[
                          styles.textInputView,
                          { marginTop: deviceHeight / 55 },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "500",
                            color:
                              touched.mc && errors.mc ? colors1.red : "gray",
                          }}
                        >
                          {touched.mc && errors.mc ? errors.mc : "MC#"}
                        </Text>
                        <View
                          style={{ flexDirection: "row", marginVertical: 5 }}
                        >
                          <TextInput
                            maxLength={8}
                            ref={ref_mc}
                            autoCapitalize="none"
                            autoCorrect={false}
                            style={{
                              padding: 0,
                              fontWeight: "600",
                              fontSize: 16,
                              flex: 1,
                            }}
                            onChangeText={handleChange("mc")}
                            onBlur={handleBlur("mc")}
                            value={values.mc}
                            placeholder=""
                            keyboardType="number-pad"
                            returnKeyType="done"
                            onSubmitEditing={() => ref_us_dot.current.focus()}
                            blurOnSubmit={false}
                          />
                        </View>
                      </View>
                      <View
                        style={[
                          styles.textInputView,
                          { marginTop: deviceHeight / 55 },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "500",
                            color:
                              touched.us_dot && errors.us_dot
                                ? colors1.red
                                : "gray",
                          }}
                        >
                          {touched.us_dot && errors.us_dot
                            ? errors.us_dot
                            : "US DOT#"}
                        </Text>
                        <View
                          style={{ flexDirection: "row", marginVertical: 5 }}
                        >
                          <TextInput
                            maxLength={8}
                            ref={ref_us_dot}
                            autoCapitalize="none"
                            autoCorrect={false}
                            style={{
                              padding: 0,
                              fontWeight: "600",
                              fontSize: 16,
                              flex: 1,
                            }}
                            onChangeText={handleChange("us_dot")}
                            onBlur={handleBlur("us_dot")}
                            value={values.us_dot}
                            placeholder=""
                            keyboardType="number-pad"
                            returnKeyType="done"
                            onSubmitEditing={() => ref_city.current.focus()}
                            blurOnSubmit={false}
                          />
                        </View>
                      </View>
                    </>
                  ) : null}

                  {/* <View
                    style={[
                      styles.textInputView,
                      { marginTop: deviceHeight / 55 },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: touched.mc && errors.mc ? colors1.red : "gray",
                      }}
                    >
                      {touched.mc && errors.mc
                        ? errors.mc
                        : "Max Load Capacity(lbs)"}
                    </Text>
                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                      <TextInput
                        maxLength={8}
                        // ref={ref_mc}
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={{
                          padding: 0,
                          fontWeight: "600",
                          fontSize: 16,
                          flex: 1,
                        }}
                        onChangeText={handleChange("max_load_capacity")}
                        onBlur={handleBlur("max_load_capacity")}
                        value={values.max_load_capacity}
                        placeholder=""
                        keyboardType="number-pad"
                        returnKeyType="done"
                        // onSubmitEditing={() => ref_us_dot.current.focus()}
                        blurOnSubmit={false}
                      />
                    </View>
                  </View> */}

                  <View
                    style={[
                      styles.textInputView,
                      { marginTop: deviceHeight / 55 },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color:
                          touched.city && errors.city ? colors1.red : "gray",
                      }}
                    >
                      {touched.city && errors.city
                        ? errors.city
                        : "City Of Residence"}
                    </Text>
                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                      <TextInput
                        autoCapitalize="sentences"
                        ref={ref_city}
                        autoCorrect={false}
                        style={{
                          padding: 0,
                          fontWeight: "600",
                          fontSize: 16,
                          flex: 1,
                        }}
                        onChangeText={handleChange("city")}
                        onBlur={handleBlur("city")}
                        value={values.city}
                        placeholder=""
                        keyboardType="default"
                        returnKeyType="next"
                      />
                    </View>
                  </View>

                  <View
                    style={[
                      styles.textInputView,
                      { marginTop: deviceHeight / 55 },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color:
                          touched.state && errors.state ? colors1.red : "gray",
                      }}
                    >
                      {touched.state && errors.state ? errors.state : "State"}
                    </Text>
                    <Dropdown
                      value={values.state}
                      data={stateList}
                      labelField="name"
                      valueField="name"
                      placeholder={"Select State"}
                      // search={search}
                      // searchPlaceholder={`Search ${label?.toLocaleLowerCase()}`}
                      maxHeight={240}
                      style={{
                        borderColor: "red",

                        marginBottom: 2,
                      }}
                      itemContainerStyle={{}}
                      itemTextStyle={{ color: "black" }}
                      placeholderStyle={{ color: "lightgray" }}
                      selectedTextStyle={{ color: "black", fontWeight: "500" }}
                      onChange={(item: any) => {
                        setFieldValue("state", item.name);
                        setSelectedStateCode(item.code);
                      }}
                    />
                  </View>

                  <View
                    style={[
                      styles.textInputView,
                      { marginTop: deviceHeight / 55 },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color:
                          touched.zipCode && errors.zipCode
                            ? colors1.red
                            : "gray",
                      }}
                    >
                      {touched.zipCode && errors.zipCode
                        ? errors.zipCode
                        : "Zip code"}
                    </Text>
                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                      <TextInput
                        maxLength={6}
                        ref={ref_zipCode}
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={{
                          padding: 0,
                          fontWeight: "600",
                          fontSize: 16,
                          flex: 1,
                        }}
                        onChangeText={handleChange("zipCode")}
                        onBlur={handleBlur("zipCode")}
                        value={values.zipCode}
                        placeholder=""
                        keyboardType="numeric"
                        returnKeyType="next"
                        onSubmitEditing={() => ref_mobile.current.focus()}
                        blurOnSubmit={false}
                      />
                    </View>
                  </View>

                  <View
                    style={[
                      styles.textInputView,
                      { marginTop: deviceHeight / 55 },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color:
                          touched.mobile && errors.mobile
                            ? colors1.red
                            : "gray",
                      }}
                    >
                      {touched.mobile && errors.mobile ? errors.mobile : "Cell"}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        marginVertical: 5,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          padding: 0,
                          fontWeight: "700",
                          fontSize: 16,
                          marginRight: 5,
                        }}
                      >
                        +1
                      </Text>
                      <TextInput
                        ref={ref_mobile}
                        maxLength={10}
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={{
                          padding: 0,
                          fontWeight: "600",
                          fontSize: 16,
                          flex: 1,
                        }}
                        onChangeText={handleChange("mobile")}
                        onBlur={handleBlur("mobile")}
                        value={values.mobile}
                        placeholder=""
                        keyboardType="number-pad"
                        returnKeyType="next"
                        blurOnSubmit={false}
                      />
                    </View>
                  </View>
                </View>
                {!isFromEdit ? (
                  <View style={{ marginTop: 10 }}>
                    <View
                      style={{
                        paddingHorizontal: deviceWidth / 30,
                        flexDirection: "column",
                        justifyContent: "space-between",
                        marginTop: deviceHeight / 35,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: "gray",
                        }}
                      >
                        Account Info
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.textInputView,
                        { marginTop: deviceHeight / 55 },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color:
                            touched.email && errors.email
                              ? colors1.red
                              : "gray",
                        }}
                      >
                        {touched.email && errors.email ? errors.email : "Email"}
                      </Text>
                      <View style={{ flexDirection: "row", marginVertical: 5 }}>
                        <TextInput
                          ref={ref_email}
                          autoCapitalize="none"
                          autoCorrect={false}
                          style={{
                            padding: 0,
                            fontWeight: "600",
                            fontSize: 16,
                            flex: 1,
                          }}
                          onChangeText={handleChange("email")}
                          onBlur={handleBlur("email")}
                          value={values.email}
                          placeholder=""
                          keyboardType="email-address"
                          returnKeyType="next"
                          onSubmitEditing={() => ref_password.current.focus()}
                          blurOnSubmit={false}
                        />
                      </View>
                    </View>

                    <View
                      style={[
                        styles.textInputView,
                        { marginTop: deviceHeight / 55 },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color:
                            touched.password && errors.password
                              ? colors1.red
                              : "gray",
                        }}
                      >
                        {touched.password && errors.password
                          ? errors.password
                          : "Set Password"}
                      </Text>
                      <View style={{ flexDirection: "row", marginVertical: 5 }}>
                        <TextInput
                          ref={ref_password}
                          autoCapitalize="none"
                          autoCorrect={false}
                          style={{
                            padding: 0,
                            fontWeight: "600",
                            fontSize: 16,
                            flex: 1,
                          }}
                          onChangeText={(e) => {
                            _verifyPassword(e), handleChange("password");
                          }}
                          onBlur={handleBlur("password")}
                          value={password}
                          placeholder=""
                          keyboardType="default"
                          returnKeyType="done"
                          secureTextEntry={hidePass}
                          //  onSubmitEditing={() => ref_password.current.focus()}
                          //  blurOnSubmit={false}
                        />
                        <Icon
                          name={hidePass ? "eye-slash" : "eye"}
                          size={16}
                          color={"grey"}
                          // style={styles.passwordMustIcon}
                          onPress={() => setHidePass(!hidePass)}
                        />
                      </View>
                    </View>
                    {checkCapitalLetter &&
                    checkNumber &&
                    checkSpecialCharacter &&
                    checkMaxLength ? null : (
                      <View
                        style={{
                          marginTop: 20,
                          paddingHorizontal: deviceWidth / 30,
                        }}
                      >
                        <Text style={{ fontSize: fontSizes.regular }}>
                          Password must:
                        </Text>
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                          <FastImage
                            style={{
                              width: 18,
                              height: 18,
                              alignSelf: "center",
                            }}
                            source={
                              checkMaxLength
                                ? require("../../../app/assets/images/passwordChecked.png")
                                : require("../../../app/assets/images/passwordUnchecked.png")
                            }
                            resizeMode={FastImage.resizeMode.contain}
                          />
                          <Text
                            style={{
                              fontSize: fontSizes.small,
                              paddingHorizontal: 10,
                            }}
                          >
                            Be a minimum of eight character
                          </Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                          <FastImage
                            style={{
                              width: 18,
                              height: 18,
                              alignSelf: "center",
                            }}
                            source={
                              checkCapitalLetter
                                ? require("../../../app/assets/images/passwordChecked.png")
                                : require("../../../app/assets/images/passwordUnchecked.png")
                            }
                            resizeMode={FastImage.resizeMode.contain}
                          />
                          <Text
                            style={{
                              fontSize: fontSizes.small,
                              paddingHorizontal: 10,
                            }}
                          >
                            Have at least one capital letter
                          </Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                          <FastImage
                            style={{
                              width: 18,
                              height: 18,
                              alignSelf: "center",
                            }}
                            source={
                              checkNumber
                                ? require("../../../app/assets/images/passwordChecked.png")
                                : require("../../../app/assets/images/passwordUnchecked.png")
                            }
                            resizeMode={FastImage.resizeMode.contain}
                          />
                          <Text
                            style={{
                              fontSize: fontSizes.small,
                              paddingHorizontal: 10,
                            }}
                          >
                            Have at least one number
                          </Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                          <FastImage
                            style={{
                              width: 18,
                              height: 18,
                              alignSelf: "center",
                            }}
                            source={
                              checkSpecialCharacter
                                ? require("../../../app/assets/images/passwordChecked.png")
                                : require("../../../app/assets/images/passwordUnchecked.png")
                            }
                            resizeMode={FastImage.resizeMode.contain}
                          />
                          <Text
                            style={{
                              fontSize: fontSizes.small,
                              paddingHorizontal: 10,
                            }}
                          >
                            Have at least one special character
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                ) : null}
                {!isFromEdit ? (
                  <View style={{}}>
                    <View
                      style={{
                        paddingHorizontal: deviceWidth / 30,
                        flexDirection: "column",
                        justifyContent: "space-between",
                        marginTop: deviceHeight / 35,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: "gray",
                        }}
                      >
                        Referral (Optional)
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.textInputView,
                        { marginTop: deviceHeight / 55 },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color:
                            touched.email && errors.email
                              ? colors1.red
                              : "gray",
                        }}
                      >
                        Referral code
                      </Text>
                      <View style={{ flexDirection: "row", marginVertical: 5 }}>
                        <TextInput
                          ref={ref_referral}
                          autoCapitalize="none"
                          autoCorrect={false}
                          style={{
                            padding: 0,
                            fontWeight: "600",
                            fontSize: 16,
                            flex: 1,
                          }}
                          onChangeText={(text) => {
                            setReferral(text);
                          }}
                          // onBlur={handleBlur("email")}
                          value={referral}
                          placeholder=""
                          keyboardType="default"
                          returnKeyType="done"
                          // onSubmitEditing={() => {}}
                          // blurOnSubmit={false}
                        />
                      </View>
                    </View>
                  </View>
                ) : null}
                {!isFromEdit ? (
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 20,
                      paddingHorizontal: 5,
                    }}
                  >
                    <CheckBox
                      checkedColor={colors1.background}
                      containerStyle={{
                        backgroundColor: "white",
                        borderWidth: 0,
                        padding: 0,
                        alignItems: "center",
                      }}
                      checked={isAcceptTerms}
                      onPress={() => {
                        setAcceptTerms(!isAcceptTerms);
                      }}
                    />
                    <Text
                      style={{
                        color: colors1.black,
                        flex: 1,
                        paddingRight: 20,
                        marginTop: 2,
                      }}
                    >
                      By contiuing, you agree to FreightRunner's{" "}
                      <Text
                        onPress={() => navigation.navigate("termsOfService")}
                        style={{
                          color: colors1.black,
                          textDecorationLine: "underline",
                          fontWeight: "bold",
                        }}
                      >
                        Terms of Service
                      </Text>{" "}
                      and{" "}
                      <Text
                        onPress={() =>
                          navigation.navigate("PrivacyPolicyScreen")
                        }
                        style={{
                          color: colors1.black,
                          textDecorationLine: "underline",
                          fontWeight: "bold",
                        }}
                      >
                        Privacy Policy
                      </Text>
                    </Text>
                  </View>
                ) : null}

                <View
                  style={{
                    marginVertical: deviceHeight / 15,
                    paddingHorizontal: deviceWidth / 15,
                  }}
                >
                  <CustomButton
                    titleColor={colors1.white}
                    borderColor={
                      isFromEdit
                        ? colors1.background
                        : checkCapitalLetter &&
                          checkNumber &&
                          checkSpecialCharacter &&
                          checkMaxLength
                        ? "#1F1F1F"
                        : "#454545"
                    }
                    onPress={handleSubmit}
                    title={isFromEdit ? "Update" : "Create Profile"}
                    backgroundColor={
                      isFromEdit
                        ? colors1.background
                        : checkCapitalLetter &&
                          checkNumber &&
                          checkSpecialCharacter &&
                          checkMaxLength
                        ? "#1F1F1F"
                        : "#454545"
                    }
                    btnLoading={loading}
                    disableButton={
                      isFromEdit
                        ? false
                        : checkCapitalLetter &&
                          checkNumber &&
                          checkSpecialCharacter &&
                          checkMaxLength
                        ? false
                        : true
                    }
                  ></CustomButton>
                </View>
              </>
            );
          }}
        />
      </KeyboardAwareScrollView>

      <ActionSheet
        ref={refActionSheet}
        title={"Select Profile Picture"}
        options={["Take Photo", "Choose from Library", "Cancel"]}
        cancelButtonIndex={2}
        onPress={async (index) => {
          if (index === 0) {
            ImagePicker.openCamera({
              multiple: false,
              // mediaType: "photo",
              // cropping: false,
              // maxFiles: 5,
              compressImageQuality: Platform.OS === "ios" ? 0.4 : 0.8,
            })
              .then(async (item) => {
                setProgress(progress);
                if (!item.fileName) item.filename = item.path.split("/").pop();
                setSelectedImageObject(item);
                setLoading(false);
              })
              .catch((error) => {});
            // openDocumentPicker();
          } else if (index === 1) {
            ImagePicker.openPicker({
              multiple: false,
              mediaType: "photo",
              cropping: false,
              maxFiles: 5,
              compressImageQuality: Platform.OS === "ios" ? 0.4 : 0.8,
            })
              .then(async (item) => {
                setProgress(progress);
                if (!item.fileName) item.filename = item.path.split("/").pop();
                setSelectedImageObject(item);
                setLoading(false);
              })
              .catch((error) => {});
          }
        }}
      />
    </SafeAreaView>
  );
}

type Styles = {
  container: ViewStyle;
  name: ViewStyle;
  textInputView: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  name: {
    fontSize: 12,
  },
  container: {
    backgroundColor: "white",
    flex: 1,
    // paddingHorizontal: STANDARD_PADDING
  },
  textInputView: {
    paddingHorizontal: deviceWidth / 30,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#F5F4F7",
    borderColor: "#EDEDED",
    // borderColor: "#0F0F0F",
    borderWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginHorizontal: 15,
    borderRadius: 8,
    shadowOffset: { width: -2, height: 2 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default RegistrationPersonalDetailScreen;
