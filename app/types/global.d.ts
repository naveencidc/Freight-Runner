import { Package } from "react-native-code-push";

type Account = {
  id: string;
  type: "account";
  attributes: {
    name: string;
    last4Digits: string;
    routingNumber: string | null;
    stripeToken: string;
    primary: boolean;
    status: "active" | "pending" | "archived";
    type: "bank_account" | "credit_card";
  };
  relationships: {
    accountMember: {
      data: {
        id: string;
        type: "organization" | "user";
      };
    };
  };
};

type Address = {
  id: string;
  type: "address";
  attributes: {
    line1: string;
    line2: string | null;
    city: string;
    region: string;
    postalCode: string;
    lat: string;
    lng: string;
    status: string;
  };
};

type ApiResponse<T> = {
  data: T;
  included: Array<any>;
  errors: Array<any>;
  message: string
};

type ApiError = {
  response: {
    data: {
      error?: string;
      errors?: any;
    };
  };
};

type BankAccount = {
  id: string;
  type: "account";
  attributes: {
    name: string;
    last4Digits: string;
    routingNumber: string;
    stripeToken: string;
    primary: boolean;
    status: string;
    type: "bank_account";
  };
};

type CreditCard = {
  id: string;
  attributes: {
    last4Digits: string;
    name: string;
    month: string;
    year: string;
    cvv: string;
    primary: boolean;
    stripeToken: string;
    type: "credit_card";
  };
};

type Email = {
  id: number;
  type: string;
  attributes: {
    address: string;
    primary: boolean;
    status: string;
  };
};

type FormHandler<T> = {
  loading: boolean;
  formik: any;
  attributes: T;
  onSubmit: (attributes?: T) => void;
  onReset?: () => void;
};

type ChangePasswordAttributes = {
  id: string;
  password: string;
  passwordConfirmation: string;
};

type ChargeDestination = {
  data: {
    id: string;
    type: "organization" | "user";
  };
};

type ChargeSource = {
  data: {
    id: string;
    type: "account";
  };
};

type ChargeRelationship = {
  id: string;
  type: "chargeRelationship";
  attributes: any;
  relationships: {
    charge: {
      data: {
        id: string;
        type: "charge";
      };
    };
    relationship: {
      data: {
        id: string;
        type: "job" | "quote" | "organization" | "user" | "unit";
      };
    };
  };
};

type Charge = {
  id: string;
  type: string;
  attributes: {
    amount: string;
    stripeChargeId: string;
    description: string | null;
    fee: string;
    createdAt: string;
    status: "captured" | "failed" | "paid" | "refunded";
    updatedAt: string;
    vendor: string;
  };
  relationships: {
    source: ChargeSource;
    destination: ChargeDestination;
  };
};

type JobStatus = "archived" | "cancelled" | "open" | "in_progress" | "resolved" | "invoiced";
type PaymentStatus = "paid" | "not_paid" | "refunded";

type ServiceTech = {
  id: string;
  user_id: string;
  full_name: string;
};

type runnerDashboard = {
  openCount: String;
  completedCount: String;
  totalSalesMonth: String;
  completedCountMonth: String;
  soldPackageMonth: String;
  freqBeachAccessMonth: String;
};

type Job = {
  id: string;
  type: string;
  attributes: {
    createdAt: string;
    organization_id: String;
    jobDate: String;
    jobTime: String;
    package: Object;
    addressLine1: String;
    addressLine2: String;
    city: String;
    state: String;
    additionalInstructions?: string | null;
    description?: string | null;
    imageUrls: string[];
    jobType: string;
    lat: string;
    lng: string;
    paymentStatus: PaymentStatus;
    status: JobStatus;
    total: string | null;
    zip_code: String;
    beachAccessPoint: String;
    hideJob: boolean;
    accountId: string;
    jobGoerDetails: Object;
    jobRunnerDetails: Object;
    live_lat: string;
    live_lng: string;
  };

  relationships?: {
    organization?: {
      data: { id: string; type: "organization" };
    };
    unit?: {
      data: { id: string; type: "unit" };
    };
    charges?: {
      data: Array<{ id: string; type: "charge" }>;
    };
    quotes?: {
      data: Array<{ id: string; type: "quote" }>;
    };
    user?: {
      data: { id: string; type: "user" };
    };
  };
};

type JobUnclaimed = Array<{
  id: string;
  type: string;
  attributes: {
    createdAt: string;
    organization_id: String;
    jobDate: String;
    jobTime: String;
    package: Object;
    addressLine1: String;
    addressLine2: String;
    city: String;
    state: String;
    additionalInstructions?: string | null;
    description?: string | null;
    imageUrls: string[];
    jobType: string;
    lat: string;
    lng: string;
    paymentStatus: PaymentStatus;
    status: JobStatus;
    total: string | null;
    zip_code: String;
    beachAccessPoint: String;
    hideJob: boolean;
    accountId: string;
    jobGoerDetails: Object;
    jobRunnerDetails: Object;
    live_lat: string;
    live_lng: string;
  };

  relationships?: {
    organization?: {
      data: { id: string; type: "organization" };
    };
    unit?: {
      data: { id: string; type: "unit" };
    };
    charges?: {
      data: Array<{ id: string; type: "charge" }>;
    };
    quotes?: {
      data: Array<{ id: string; type: "quote" }>;
    };
    user?: {
      data: { id: string; type: "user" };
    };
  };
}>;

type TypeExtras = {
  item: String;
  value: any;
};

type NotificationDefinition = {
  id: string;
  type: "notification";
  attributes: {
    name: string;
    category: "email" | "push";
    status: string;
  };
};

type NotificationPreference = {
  id: string;
  type: "notification_preference";
  attributes: {
    enabled: boolean;
  };
  relationships: {
    user: {
      data: {
        id: string;
        type: "user";
      };
    };
    notification: {
      data: {
        id: string;
        type: "notification";
      };
    };
  };
};

type NormalizedCollection<T> = {
  [id: string]: T;
};

type OrganizationMembership = "unknown" | "beach_goer" | "beach_runner" | null; // occurs if user is not a part of current organization

type Organization = {
  id: string;
  type: "organization";
  attributes: {
    name: string;
    role: string;
    slug: string;
    phoneNumber: string;
    emailAddress: string;
    createdAt: string;
    updatedAt: string;
    line1: string;
    line2: string;
    city: string;
    region: string;
    postalCode: string;
    lat: string;
    lng: string;
    currentUserAuthorized: boolean;
    currentUserOrganizationRole: OrganizationMembership;
    stripeVerified?: boolean;
  };
  relationships: {
    users?: {
      data: Array<{ id: string; type: string }>;
    };
    units?: {
      data: Array<{ id: string; type: string }>;
    };
  };
};

type OrganizationRelationship = {
  id: string;
  type: "organizationMembership";
  attributes: {
    role: string;
    status: "verified" | "pending";
  };
};

type Profile = {
  id: string;
  type: "profile";
  attributes: {
    fullName: string;
    handle: string;
    initials: string;
    phoneNumber: string;
    status: string;
    avatarUrl: string | null;
  };
};

type ProfileContactInfo = {
  phoneNumber: string;
  emailAddress: string;
};

type Quote = {
  id: string;
  type: string;
  attributes: {
    createdAt: string;
    description?: string;
    fee: string;
    price: string;
    total: string;
    status: "archived" | "void" | "rejected" | "requested" | "submitted" | "approved" | "completed";
    timeTilService: string | null;
    updatedAt: string;
  };
  relationships: {
    job?: {
      data: {
        id: string;
        type: "job";
      };
    };
    vendor?: {
      data: {
        id: string;
        type: "organization";
      };
    };
    serviceTech?: {
      data: {
        id: string;
      };
    };
  };
};

type SignInAttemptAttributes = RegistrationAttributes;

type RegistrationAttributes = {
  email: string;
  role: string;
  terms_accepted: boolean;
};

type Session = User;
type User = Registration;
type Registration = {
  id: string;
  type: "registration" | "user" | "session";
  attributes: {
    authenticationToken?: string;
    avatarUrl?: string;
    createdAt?: string;
    email: string;
    fullName?: string;
    handle?: string;
    role: UserRole;
    status: UserStatus;
    updatedAt?: string;
    isStripeVerified: boolean;
  };
  relationships: {
    user: { data: { id: number; type: "user" } };
    profile?: { data: { id: string; type: "profile" } };
    emailAddress: { data: { id: number; type: "email_address" }[] };
    organizations: { data: RelationshipOrganization[] };
    organizationMemberships?: { data: OrganizationRelationship[] };
    units: { data: { id: number; type: "unit" }[] };
  };
};

type RelationshipOrganization = {
  attributes: {
    name: string;
  };
  id: string;
  relationships: {
    units: {
      data: any[];
    };
    users: {
      data: {
        id: string;
        type: "user";
      }[];
    };
  };
  type: "organization";
};

type TempPhoto = {
  photoBase64String: string;
  photoFileName: string | null;
  signedImageId: string;
};

type UnitAttributes = {
  description?: string;
  image?: string;
  make: string;
  model: string;
  status?: string;
  type: "truck" | "trailer";
  vin?: string;
  year: number | string;
  unlisted?: boolean;
};

type Unit = { id: string; type: string; attributes: UnitAttributes };

type UserAttributes = {
  id: string;
  role: UserRole;
  status: UserStatus;
};

type UserSetupAttributes = UserAttributes & {
  termsOfService: boolean;
};

type UserRole = "unknown" | "beach_goer" | "beach_runner" | null;

type UserStatus = "pending" | "active";
type Packages = {
  id: string;
  name: string;
  cost: String;
  description: String;
  is_active: boolean;
  created_at: String;
  updated_at: String;
  extraAllowed: boolean;
  packageType: String;
  chairs: Number;
  umbrellas: Number;
  tent: Number;
  cooler: Number;
  beachBags: Number;
  accessories: Number;
};
