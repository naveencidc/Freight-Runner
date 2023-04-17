/*************************************************
 * FreightRunner
 * @exports
 * @function RegistrationApprovedScreen.tsx
 * @extends Component
 * Created by Naveen E on 26/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  Alert,
  StyleSheet,
  ViewStyle,
  Platform,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import {
  CustomButton,
  Screen,
  SimpleInput as Input,
  Text,
  View,
} from "../../components";
import { fontSizes } from "../../styles/globalStyles";
import colors1 from "../../styles/colors";
import FastImage from "react-native-fast-image";
import ActionSheet from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";
import DocumentPicker from "react-native-document-picker";
import { uploadDocument, uploadToS3 } from "../../services/uploadS3Service";
import storage from "../../helpers/storage";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";
import { MyContext } from ".././../../app/context/MyContextProvider";
import { updateOnbardingStatus } from "../../services/userService";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

function RegistrationApprovedScreen({ navigation, route }) {
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const [selectedTab, setselectedTab] = useState("");
  const [loading, setLoading] = useState(false);
  const global: any = useContext(MyContext);
  let profileDetail = route.params?.profileDetail;
  const [isW9Uploaded, setisW9Uploaded] = useState(() => {
    const selectedindex =
      profileDetail &&
      profileDetail.documentDetails.findIndex((object: any) => {
        return object.document_type === "w9-form";
      });
    if (selectedindex > -1) {
      return true;
    } else {
      return false;
    }
  });
  useEffect(() => {
    if (global.myState.isW_9Uploaded) {
      setisW9Uploaded(true);
    }
  }, [global.myState.isW_9Uploaded]);

  const [isLicenseUploaded, setisLicenseUploaded] = useState(() => {
    const selectedindex =
      profileDetail &&
      profileDetail.documentDetails.findIndex((object: any) => {
        return object.document_type === "driver's_license";
      });
    if (selectedindex > -1) {
      return false;
    } else {
      return false;
    }
  });
  const [isCertificateUploaded, setisCertificateUploaded] = useState(() => {
    const selectedindex =
      profileDetail &&
      profileDetail.documentDetails.findIndex((object: any) => {
        return object.document_type === "certificate";
      });
    if (selectedindex && selectedindex > -1) {
      return true;
    } else {
      return false;
    }
  });
  const refActionSheet = useRef(null);
  const showActionSheet = () => {
    if (refActionSheet.current) {
      refActionSheet.current.show();
    }
  };
  const renderTickOrTriangle = (status: boolean) => {
    if (status) {
      return (
        <FastImage
          resizeMode={"contain"}
          source={require("../../../app/assets/images/greenTick.png")}
          style={{ height: 20, width: 20, alignSelf: "center" }}
        />
      );
    } else {
      return (
        <FastImage
          resizeMode={"contain"}
          source={require("../../../app/assets/images/RightTriangle.png")}
          style={{ height: 12, width: 12, alignSelf: "center" }}
        />
      );
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* <KeyboardAwareScrollView keyboardShouldPersistTaps="handled"> */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "black",
            alignItems: "center",
            paddingTop: deviceHeight / 40,
            paddingBottom: deviceHeight / 60,
          }}
        >
          <Text
            style={{
              color: colors1.white,
              fontSize: fontSizes.large,
              fontWeight: "600",
            }}
          >
            Congrats, You're now a
          </Text>
          <Text
            style={{
              color: colors1.white,
              fontSize: fontSizes.large,
              fontWeight: "600",
            }}
          >
            FreightRunner Partner!!!
          </Text>
          <Text
            style={{
              color: colors1.white,
              textAlign: "center",
              fontSize: fontSizes.small,
              paddingHorizontal: deviceWidth / 12,
              paddingVertical: deviceHeight / 45,
            }}
          >
            Please Review/eSign the Documents below and you'll be all set to hit
            the road
          </Text>

          {/* <FastImage
            resizeMode={"contain"}
            source={require("../../../app/assets/images/Approved.png")}
            style={{
              alignSelf: "center",
              height: 125,
              width: "100%",
              marginTop: deviceHeight / 40
            }}
          /> */}
        </View>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("RegistrationUploadW9Screen")}
              style={{
                flexDirection: "row",
                paddingTop: deviceHeight / 25,
                paddingHorizontal: deviceWidth / 30,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginHorizontal: 3,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#F5F4F7",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: deviceHeight / 50,
                    borderRadius: 50,
                  }}
                >
                  <FastImage
                    resizeMode={"contain"}
                    source={require("../../../app/assets/images/fileUpload.png")}
                    style={{ height: 20, width: 20 }}
                  />
                </View>
              </View>

              <View style={{ flex: 1, marginHorizontal: deviceWidth / 25 }}>
                <Text
                  style={{ fontSize: fontSizes.regular, fontWeight: "700" }}
                >
                  Review W-9
                </Text>
                <Text
                  style={{
                    fontSize: fontSizes.small,
                    color: "#757E8E",
                    fontWeight: "500",
                    marginTop: 8,
                  }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </Text>
              </View>
              {renderTickOrTriangle(isW9Uploaded)}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                await setselectedTab("license");
                showActionSheet();
              }}
              style={{
                flexDirection: "row",
                paddingTop: deviceHeight / 25,
                paddingHorizontal: deviceWidth / 30,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginHorizontal: 3,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#F5F4F7",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: deviceHeight / 50,
                    borderRadius: 50,
                  }}
                >
                  <FastImage
                    resizeMode={"contain"}
                    source={require("../../../app/assets/images/UploadArrow.png")}
                    style={{ height: 20, width: 20 }}
                  />
                </View>
              </View>

              <View style={{ flex: 1, marginHorizontal: deviceWidth / 25 }}>
                <Text
                  style={{ fontSize: fontSizes.regular, fontWeight: "700" }}
                >
                  Upload Driver's License
                </Text>
                <Text
                  style={{
                    fontSize: fontSizes.small,
                    color: "#757E8E",
                    fontWeight: "500",
                    marginTop: 8,
                  }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </Text>
              </View>

              {selectedTab === "license" && loading ? (
                <ActivityIndicator
                  animating={loading}
                  size="small"
                  color={colors1.background}
                />
              ) : (
                <>{renderTickOrTriangle(isLicenseUploaded)}</>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                await setselectedTab("certificate");
                showActionSheet();
              }}
              style={{
                flexDirection: "row",
                paddingTop: deviceHeight / 25,
                paddingHorizontal: deviceWidth / 30,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginHorizontal: 3,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#F5F4F7",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: deviceHeight / 50,
                    borderRadius: 50,
                  }}
                >
                  <FastImage
                    resizeMode={"contain"}
                    source={require("../../../app/assets/images/UploadArrow.png")}
                    style={{ height: 20, width: 20 }}
                  />
                </View>
              </View>

              <View style={{ flex: 1, marginHorizontal: deviceWidth / 25 }}>
                <Text
                  style={{ fontSize: fontSizes.regular, fontWeight: "700" }}
                >
                  Upload CDL{" "}
                  <Text style={{ fontSize: fontSizes.xSmall, color: "gray" }}>
                    (Optional)
                  </Text>
                </Text>
                <Text
                  style={{
                    fontSize: fontSizes.small,
                    color: "#757E8E",
                    fontWeight: "500",
                    marginTop: 8,
                  }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </Text>
              </View>
              {selectedTab === "certificate" && loading ? (
                <ActivityIndicator
                  animating={loading}
                  size="small"
                  color={colors1.background}
                />
              ) : (
                <>{renderTickOrTriangle(isCertificateUploaded)}</>
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginBottom: deviceHeight / 35,
              paddingHorizontal: deviceWidth / 25,
            }}
          >
            <CustomButton
              titleColor={colors1.white}
              borderColor={"#1F1F1F"}
              onPress={async () => {
                const userDetail = await storage.get("userData");
                if (!isW9Uploaded) {
                  Alert.alert("Error", "Please upload W-9 form");
                } else if (!isLicenseUploaded) {
                  Alert.alert("Error", "Please upload your driving license");
                } else {
                  const updateOnbardingStatusResponse =
                    await updateOnbardingStatus({
                      user_id: userDetail.user_id,
                      is_onboard_pending: 2,
                      completed_step: 7,
                      is_welcome_screen_viewed: 2,
                    });
                  navigation.navigate("WelcomeScreen");
                }
              }}
              title="Finish"
              backgroundColor={colors1.background}
            ></CustomButton>
          </View>
        </View>
      </View>

      {/* </KeyboardAwareScrollView> */}
      <ActionSheet
        ref={refActionSheet}
        title={"Select"}
        options={["Camera", "Gallery", "Document", "Cancel"]}
        cancelButtonIndex={3}
        onPress={async (index) => {
          if (index === 0) {
            ImagePicker.openCamera({
              // width: 300,
              // height: 300,
              // cropping: true
            })
              .then(async (item: any) => {
                if (!item.fileName) item.filename = item.path.split("/").pop();
                console.log("-----camera image--", item);
                global.myDispatch({ type: "UPLOADING_INIT", payload: true });
                setLoading(true);
                const response = await uploadToS3(item, "image", global);
                if (response) {
                  const userDetail: any = await storage.get("userData");
                  const finalUploadresponse = await uploadDocument({
                    user_id: userDetail.user_id,
                    document_type:
                      selectedTab === "license"
                        ? "driver's_license"
                        : "certificate",
                    file_path: item.filename,
                  });
                  let message =
                    selectedTab === "license"
                      ? "License uploaded successfully."
                      : "Certificate uploaded successfully.";
                  if (finalUploadresponse.status === 201) {
                    global.myDispatch({
                      type: "UPLOADING_COMPLETED",
                      payload: true,
                    });
                    global.myDispatch({
                      type: "HIDE_UPLOAD_DAILOG",
                      payload: true,
                    });
                    if (selectedTab === "license") {
                      setisLicenseUploaded(true);
                    } else {
                      setisCertificateUploaded(true);
                    }
                    setLoading(false);
                    setMessage(message);
                    setVisible(true);
                  } else {
                    global.myDispatch({
                      type: "HIDE_UPLOAD_DAILOG",
                      payload: true,
                    });
                    setLoading(false);
                    Alert.alert(
                      "Error",
                      "There was an error. Please try again."
                    );
                  }
                }
              })
              .catch((err) => {
                global.myDispatch({
                  type: "HIDE_UPLOAD_DAILOG",
                  payload: true,
                });
                setLoading(false);
                Alert.alert("Error", "There was an error. Please try again.");
              });
          } else if (index === 1) {
            ImagePicker.openPicker({
              multiple: false,
              mediaType: "photo",
              cropping: false,
              maxFiles: 5,
              compressImageQuality: Platform.OS === "ios" ? 0.4 : 0.8,
            })
              .then(async (item: any) => {
                if (!item.fileName) item.filename = item.path.split("/").pop();
                console.log("-----------selected image-", item, selectedTab);
                // setLoading(true);
                global.myDispatch({ type: "UPLOADING_INIT", payload: true });
                const response = await uploadToS3(item, "image", global);
                console.log("------ASDFGHJJJJJ", response);
                if (response) {
                  const userDetail: any = await storage.get("userData");
                  const finalUploadresponse = await uploadDocument({
                    user_id: userDetail.user_id,
                    document_type:
                      selectedTab === "license"
                        ? "driver's_license"
                        : "certificate",
                    file_path: item.filename,
                  });
                  console.log("fghjk", finalUploadresponse);
                  let message =
                    selectedTab === "license"
                      ? "License uploaded successfully."
                      : "Certificate uploaded successfully.";
                  if (finalUploadresponse.status === 201) {
                    global.myDispatch({
                      type: "UPLOADING_COMPLETED",
                      payload: true,
                    });
                    global.myDispatch({
                      type: "HIDE_UPLOAD_DAILOG",
                      payload: true,
                    });
                    if (selectedTab === "license") {
                      setisLicenseUploaded(true);
                    } else {
                      setisCertificateUploaded(true);
                    }
                    setLoading(false);
                    setMessage(message);
                    setVisible(true);
                  } else {
                    global.myDispatch({
                      type: "HIDE_UPLOAD_DAILOG",
                      payload: true,
                    });
                    setLoading(false);
                    Alert.alert(
                      "Error",
                      "There was an error. Please try again."
                    );
                  }
                }
              })
              .catch((error) => {});
          } else if (index === 2) {
            try {
              const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.doc],
                allowMultiSelection: false,
              });
              if (res) {
                setLoading(true);
                global.myDispatch({ type: "UPLOADING_INIT", payload: true });
                const response = await uploadToS3(res, "document", global);
                if (response) {
                  const userDetail: any = await storage.get("userData");
                  const finalUploadresponse = await uploadDocument({
                    user_id: userDetail.user_id,
                    document_type:
                      selectedTab === "license"
                        ? "driver's_license"
                        : "certificate",
                    file_path: res.name,
                  });
                  if (finalUploadresponse.status === 201) {
                    global.myDispatch({
                      type: "UPLOADING_COMPLETED",
                      payload: true,
                    });
                    global.myDispatch({
                      type: "HIDE_UPLOAD_DAILOG",
                      payload: true,
                    });
                    if (selectedTab === "license") {
                      setisLicenseUploaded(true);
                    } else {
                      setisCertificateUploaded(true);
                    }
                    setLoading(false);
                    setMessage(
                      selectedTab === "license"
                        ? "License uploaded successfully."
                        : "Certificate uploaded successfully."
                    );
                    setVisible(true);
                  } else {
                    setLoading(false);
                    global.myDispatch({
                      type: "HIDE_UPLOAD_DAILOG",
                      payload: true,
                    });
                    Alert.alert(
                      "Error",
                      "There was an error. Please try again."
                    );
                  }
                }
              }
            } catch (err) {
              if (DocumentPicker.isCancel(err)) {
              } else {
                throw err;
              }
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

type Styles = {
  container: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
});

export default RegistrationApprovedScreen;
