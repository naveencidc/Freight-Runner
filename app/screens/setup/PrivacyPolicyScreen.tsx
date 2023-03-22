import React, {FC, useContext} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Text,
  View,
  Linking,
} from 'react-native';
import colors from '../../styles/colors';
import {STANDARD_PADDING} from '../../styles/globalStyles';
import {Screen, Title} from '../../components';
import HeaderWithBack from '../../components/HeaderWithBack';

const PrivacyPolicyScreen: React.FC = ({navigation}: any, route: any) => {
  let isFrom = route.params?.isFrom;

  return (
    <SafeAreaView style={{flex: 1}}>
      <HeaderWithBack
        title="PRIVACY POLICY"
        onPress={() => {
          if (isFrom) {
            navigation.navigate('Landing');
          } else {
            navigation.goBack();
          }
        }}
        isRightText={false}
        rightText=""
        isFrom={'PrivacyPolicy'}
        rightOnPress={() => {}}></HeaderWithBack>
      <Screen style={styles.container}>
        <ScrollView style={{}}>
          <Text style={{marginTop: 15}}>
            Effective date: September 01, 2022{'\n'}
          </Text>
          <Text>
            The FreightRunner Terms of Use and Privacy Policy outline what data
            we collect and how that data is used. This outlines some of the
            information in the Terms of Use and Privacy Policy specifically
            related to your personal data. Please note, this is not an extensive
            review of the Terms of Use and Privacy Policy. If you have any
            questions, please refer to the Terms of Use and Privacy Policy which
            can be found at thefreightrunner.com or through your profile.
            FreightRunner collects the data and information you provide to us in
            order to provide you with the best experience possible while using
            our services. Collecting, storing, and processing this data is
            necessary for you to experience the FreightRunner services. We are
            committed to your privacy and want to be transparent in how your
            data is managed. We are breaking this overview into three sections:
            What information we collect, why we collect that information, and
            who has access to your information.{'\n'}
          </Text>

          <Title>WHAT INFORMATION WE COLLECT</Title>

          <Text>
            FreightRunner collects, stores, and processes the data and
            information you provide to us. We collect personal information such
            as your email address, name, and phone number. We also collect the
            necessary information you provide to shippers/carriers through our
            platform:{'\n'}
          </Text>

          <Text style={{fontSize: 14, color: colors.greyDark, marginBottom: 5}}>
            Personal Information:
          </Text>

          <Text style={{flex: 1, paddingLeft: 5}}>
            {'\u2022'} We collect and store the information you provide to us to
            create your account. Your email address, name, phone number, etc.
            are examples of this information. Along with the information you
            provide us, we also collect your IP address and other device-based
            analytics information.{'\n'}
          </Text>

          <Text style={{fontSize: 14, color: colors.greyDark, marginBottom: 5}}>
            Business Information:
          </Text>

          <Text style={{flex: 1, paddingLeft: 5}}>
            {'\u2022'} When you book a session, the information you include to
            be shared with a carrier or shipper is business information that is
            stored and processed. This information is transmitted to carriers
            and shippers for them to review and respond to your request. This
            information is considered a part of your profile record. {'\n'}
          </Text>

          <Text style={{fontSize: 14, color: colors.greyDark, marginBottom: 5}}>
            Financial Information:
          </Text>

          <Text style={{flex: 1, paddingLeft: 5}}>
            {'\u2022'} FreightRunner does not store your credit card
            information. FreightRunner uses a third-party company, Stripe, for
            credit card processing. All credit card information is securely sent
            to Stripe in an encrypted format. Information such as your name,
            email address, and billing address are sent to Stripe as well in
            order for payment processing to be completed. {'\n'}
          </Text>

          <Title>WHY WE COLLECT THET INFORMATION</Title>

          <Text>
            FreightRunner collects and processes the information you provide to
            us in order to provide you with a service and to comply with Federal
            and State regulations. Below are more details about why your
            information is collected and how it is used.{'\n'}
          </Text>

          <Text style={{fontSize: 14, color: colors.greyDark, marginBottom: 5}}>
            Needed for your use of our services:
          </Text>

          <Text>
            Your personal, business, and financial information is collected to
            provide the services FreightRunner offers. This information is
            necessary for:{'\n'}
          </Text>

          <Text style={{flex: 1, paddingLeft: 5}}>
            {'\u2022'} Creating an account{'\n'}
          </Text>
          <Text style={{flex: 1, paddingLeft: 5}}>
            {'\u2022'} Sending your business information to shippers and
            carriers{'\n'}
          </Text>
          <Text style={{flex: 1, paddingLeft: 5}}>
            {'\u2022'} Receiving payment for using FreightRunner{'\n'}
          </Text>
          <Text style={{flex: 1, paddingLeft: 5}}>
            {'\u2022'} Providing customer service{'\n'}
          </Text>
          <Text style={{flex: 1, paddingLeft: 5}}>
            {'\u2022'} Informing you about FreightRunner services{'\n'}
          </Text>
          <Text style={{flex: 1, paddingLeft: 5}}>
            {'\u2022'} Complying with regulations{'\n'}
          </Text>

          <Text style={{fontSize: 14, color: colors.greyDark, marginBottom: 5}}>
            Our legitimate interest:
          </Text>

          <Text style={{flex: 1, paddingLeft: 5}}>
            We additionally collect and process this information for our
            legitimate business interests. This includes research and data
            analysis. {'\n'}
          </Text>

          <Text style={{flex: 1, paddingLeft: 5}}>
            We de-identify and combine personal information and educational
            information to help us understand our users and the use of our
            services. This analysis is used to improve our services and provide
            the best experience possible for our users. {'\n'}
          </Text>

          <Title>WHO HAS ACCESS TO YOUR INFORMATION</Title>

          <Text>
            We only share your information with selected third parties that
            provide technical assistance or services to FreightRunner. These
            third parties only receive information that is necessary for them to
            provide services to FreightRunner and they have security protocols
            in place to protect your data. These third parties include:{'\n'}
          </Text>

          <Text style={{flex: 1, paddingLeft: 5}}>
            {'\u2022'} Partners that provide application development, support,
            and maintenance;
            {'\n'}
          </Text>
          <Text style={{flex: 1, paddingLeft: 5}}>
            {'\u2022'} Partners that provide technical infrastructure, hosting,
            and data storage;
            {'\n'}
          </Text>
          <Text style={{flex: 1, paddingLeft: 5}}>
            {'\u2022'} Partners that provide secure payment processing;{'\n'}
          </Text>
          <Text style={{flex: 1, paddingLeft: 5}}>
            {'\u2022'} Partners that provide communication services, such as
            email and text message notifications.{'\n'}
          </Text>

          <Text style={{flex: 1, paddingLeft: 5}}>
            We hope this overview helps you understand more clearly how your
            data is collected and used. If you have any questions about the
            FreightRunner Privacy Policies, please contact
            admin@thefreightrunner.com for more information.{'\n'}
          </Text>

          <Text style={{flex: 1, paddingLeft: 5}}>
            Please reference these Privacy Policies for more information about
            our third party partners and the policies they have in place.{'\n'}
          </Text>

          <Text style={{flex: 1, paddingLeft: 5}}>
            {'\u2022'}Amazon Web Services (AWS): https://aws.amazon.com/privacy/
            {'\n'}
          </Text>

          <Text style={{flex: 1, paddingLeft: 5}}>
            {'\u2022'}Stripe: https://stripe.com/privacy
            {'\n'}
          </Text>

          <Title>CONTACTING US</Title>

          <Text>
            If there are any questions regarding this privacy policy you may
            contact us via telephone at info@freightrunner.com or via mail at
            Attn: 7030 MEADOWLARK DR BIRMINGHAM, AL 35242.
            {'\n'}
            {'\n'}
          </Text>
        </ScrollView>
      </Screen>
    </SafeAreaView>
  );
};

type ScreenStyleSheet = {
  container: ViewStyle;
  header: ViewStyle;
};

const styles = StyleSheet.create<ScreenStyleSheet>({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: STANDARD_PADDING,
  },
  header: {
    paddingHorizontal: 15,
    paddingTop: 30,
    marginBottom: 20,
  },
});

export default PrivacyPolicyScreen;
