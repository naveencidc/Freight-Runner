import { destroy, fetch, patch, post } from ".";
import { Registration } from "../types/global";

export const registerUser = (email: string, role: string, terms_accepted: boolean = true) =>
  post<Registration>({
    endpoint: "new_user_registrations",
    data: { registration: { email, role, terms_accepted } }
  }).then(response => response);

export const getStateList = () => {
  return fetch({
    endpoint: `state`
  });
};

export const getVehileDetails = (vinNumber: string) => {
  return fetch({
    endpoint: `vehicle/${vinNumber}`
  });
};

export const createProfile = (config: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  city: string;
  state: string;
  mobile_number: string;
  zip: string;
  is_business: number;
  mc: string;
  us_dot: string;
  businessEntity: any;
  federal_id: any;
  referral_code: string;
}) => {
  const {
    email,
    password,
    first_name,
    last_name,
    profile_image,
    city,
    state,
    mobile_number,
    zip,
    is_business,
    mc,
    us_dot,
    businessEntity,
    federal_id,
    referral_code
  } = config;
  let userProfileObject = {
    email: email,
    password: password,
    first_name: first_name,
    last_name: last_name,
    profile_image: null,
    city: city,
    state: state,
    mobile_number: mobile_number,
    zip_code: zip,
    is_business: is_business,
    mc: mc,
    us_dot: us_dot,
    business_name: businessEntity,
    federal_id: federal_id
  };
  return post({
    endpoint: `auth/register/partner`,
    data: referral_code.trim().length
      ? { ...userProfileObject, referral_code: referral_code }
      : userProfileObject
  });
};

export const updateProfile = (config: {
  first_name: string;
  last_name: string;
  profile_image: string;
  city: string;
  state: string;
  mobile_number: string;
  zip: string;
  user_id: number;
}) => {
  const { first_name, last_name, profile_image, city, state, mobile_number, zip, user_id } = config;
  return patch({
    endpoint: `partner/profile`,
    data: {
      first_name: first_name,
      last_name: last_name,
      profile_image: profile_image,
      city: city,
      state: state,
      mobile_number: mobile_number,
      zip_code: zip,
      user_id: user_id
    }
  });
};

export const registerBusinessInfo = (config: {
  user_id: string;
  name: string;
  scac_code: string;
  mc: string;
  us_dot: string;
  federal_id: string;
  dba: string;
  cdl: string;
}) => {
  const { user_id, name, scac_code, mc, us_dot, federal_id, dba, cdl } = config;
  return post({
    endpoint: `partner/business-info`,
    data: {
      user_id: user_id,
      name: name,
      scac_code: scac_code,
      mc: mc,
      us_dot: us_dot,
      federal_id: federal_id,
      dba: dba,
      cdl: cdl
    }
  });
};

export const saveBusinessAddress = (config: {
  user_id: string;
  address: string;
  lat: string;
  long: string;
}) => {
  const { user_id, address, lat, long } = config;
  return post({
    endpoint: `partner/business-address`,
    data: {
      user_id: user_id,
      address: address,
      lat: lat,
      long: long
    }
  });
};

export const getTrailerTypeList = (config: { trailer_hookup_id: string }) => {
  const { trailer_hookup_id } = config;
  return fetch({
    endpoint: `trailer-type?all=true&trailer_hookup_id=${trailer_hookup_id}`
  });
};

export const getTrailerHookup = () => {
  return fetch({
    endpoint: `trailer-hookup?all=true&sortBy=hookup_id:asc`
  });
};

export const getTrailerTypeConfig = () => {
  return fetch({
    endpoint: `trailer-type/config`
  });
};

export const getCargoTypeList = () => {
  return fetch({
    endpoint: `cargo-type?size=100`
  });
};

export const getServiceAreaList = () => {
  return fetch({
    endpoint: `partner/service-area`
  });
};

export const getUserServiceAreaList = (config: { user_id: string }) => {
  const { user_id } = config;
  return fetch({
    endpoint: `partner/${user_id}/service-area`
  });
};

export const getW9Form = () => {
  return fetch({
    endpoint: `partner/download-w9form`
  });
};

export const getPresignedUrl = (fileName: string) => {
  return fetch({
    endpoint: `s3/put-presigned-url?fileName=${fileName}`
  });
};

export const getTruckBrandName = () => {
  return fetch({
    endpoint: `brand?all=true`
  });
};
export const getTruckModelName = selectedBrandId => {
  return fetch({
    endpoint: `model?all=true&brand_id=${selectedBrandId}`
  });
};

export const getPowerType = () => {
  return fetch({
    endpoint: `power-type?all=true`
  });
};

export const createUserTruck = (config: {
  user_id: number;
  model_id: number;
  brand_id: number;
  year: number;
  vin: string;
  power_type_id: number;
}) => {
  const { user_id, model_id, brand_id, year, vin, power_type_id } = config;
  return post({
    endpoint: `user-truck`,
    data: {
      user_id: user_id,
      model_id: model_id,
      brand_id: brand_id,
      year: year,
      vin: vin,
      power_type_id: power_type_id
    }
  });
};

export const createUserTrailer = (config: {
  user_id: number;
  trailer_type_id: number;
  trailer_connection_id: number;
  trailer_platform_id: number;
  trailer_axle_id: number;
  offload_equipments: Array<number>;
  length: number;
  capacity: number;
  trailer_hookup_id: number;
}) => {
  const {
    user_id,
    trailer_type_id,
    trailer_connection_id,
    trailer_platform_id,
    trailer_axle_id,
    offload_equipments,
    length,
    capacity,
    trailer_hookup_id
  } = config;
  console.log(
    "---ggg ut--",
    user_id,
    trailer_type_id,
    trailer_connection_id,
    trailer_platform_id,
    trailer_axle_id,
    offload_equipments,
    length,
    capacity,
    trailer_hookup_id
  );

  return post({
    endpoint: `user-trailer`,
    data: {
      user_id: user_id,
      trailer_type_id: trailer_type_id,
      trailer_connection_id: trailer_connection_id,
      trailer_platform_id: trailer_platform_id,
      trailer_axle_id: trailer_axle_id,
      offload_equipments: offload_equipments,
      length: length,
      capacity: capacity,
      trailer_hookup_id
    }
  });
};

export const createUserCargoTypes = (config: { user_id: number; cargo_type_id: Array<number> }) => {
  const { user_id, cargo_type_id } = config;
  console.log("---ggg ut--", user_id, cargo_type_id);

  return post({
    endpoint: `user-cargo`,
    data: {
      user_id: user_id,
      cargo_type_id: cargo_type_id
    }
  });
};

export const createDriverServiceArea = (config: {
  user_id: number;
  service_areas: Array<number>;
}) => {
  const { user_id, service_areas } = config;
  console.log("---ggg ut--", user_id, service_areas);

  return post({
    endpoint: `partner/service-area`,
    data: {
      user_id: user_id,
      service_areas: service_areas
    }
  });
};

export const forgotPassword = (config: { email: string }) => {
  const { email } = config;
  console.log("---ggg ut--", email);
  return post({
    endpoint: `auth/forgot-password`,
    data: {
      email: email
    }
  });
};

export const validateOTP = (config: { otp: string; email: string }) => {
  const { otp, email } = config;
  console.log("---ggg ut--", otp, email);
  return post({
    endpoint: `auth/validate-OTP`,
    data: {
      otp: otp,
      email: email
    }
  });
};

export const resetPassword = (config: {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  const { token, newPassword, confirmNewPassword } = config;
  return post({
    endpoint: `auth/reset-password?token=${token}`,
    data: {
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword
    }
  });
};

export const changePassword = (config: {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  const { oldPassword, newPassword, confirmNewPassword } = config;
  return post({
    endpoint: `auth/change-password`,
    data: {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword
    }
  });
};

export const resendOTP = (config: { email: string }) => {
  const { email } = config;
  console.log("---ggg ut--", email);
  return post({
    endpoint: `auth/resend-OTP`,
    data: {
      email: email
    }
  });
};

export const deleteUserAccount = () => {
  return destroy({
    endpoint: `auth/delete-account`
  });
};
