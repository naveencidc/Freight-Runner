import { destroy, fetch, post, patch, put } from ".";
import { Job } from "../types/global";
import { stringToNumber } from "../utilities/numberUtilities";

export const getUserLoadRequestList = (
  selectedSortType: string,
  params: any
) => {
  let selectedEndPoint = "";
  if (selectedSortType === "Latest") {
    selectedEndPoint = `partner/getloads?offset=${params.offset}&size=10`;
  } else if (selectedSortType === "Oldest") {
    selectedEndPoint = `partner/getloads?offset=${params.offset}&size=10&sortBy=createdAt:asc`;
  } else if (selectedSortType === "Nearest pickup") {
    selectedEndPoint = `partner/getloads?offset=${params.offset}&size=10&sortBy=nearest_pickup:${params.lat},${params.long}`;
  } else if (selectedSortType === "Nearest delivery") {
    selectedEndPoint = `partner/getloads?offset=${params.offset}&size=10&sortBy=nearest_destination:19.076,72.8777`;
  } else if (selectedSortType === "Delivery date - latest") {
    selectedEndPoint = `partner/getloads?offset=${params.offset}&size=10&sortBy=delivery_date:desc`;
  } else if (selectedSortType === "Delivery date - oldest") {
    selectedEndPoint = `partner/getloads?offset=${params.offset}&size=10&sortBy=delivery_date:asc`;
  } else if (selectedSortType === "Pickup date - latest") {
    selectedEndPoint = `partner/getloads?offset=${params.offset}&size=10&sortBy=pickup_date:desc`;
  } else if (selectedSortType === "Pickup date - oldest") {
    selectedEndPoint = `partner/getloads?offset=${params.offset}&size=10&sortBy=pickup_date:asc`;
  } else if (selectedSortType === "Distance - highest") {
    selectedEndPoint = `partner/getloads?offset=${params.offset}&size=10&sortBy=approx_distance:desc`;
  } else if (selectedSortType === "Distance - lowest") {
    selectedEndPoint = `partner/getloads?offset=${params.offset}&size=10&sortBy=approx_distance:asc`;
  } else if (selectedSortType === "Price - highest") {
    selectedEndPoint = `partner/getloads?offset=${params.offset}&size=10&sortBy=delivery_price:desc`;
  } else if (selectedSortType === "Price - lowest") {
    selectedEndPoint = `partner/getloads?offset=${params.offset}&size=10&sortBy=delivery_price:asc`;
  } else if (selectedSortType === "Rate per mile - highest") {
    selectedEndPoint = `partner/getloads?offset=${params.offset}&size=10&sortBy=delivery_rate:desc`;
  } else if (selectedSortType === "Rate per mile - lowest") {
    selectedEndPoint = `partner/getloads?offset=${params.offset}&size=10&sortBy=delivery_rate:asc`;
  } else if (selectedSortType === "search") {
    selectedEndPoint = `partner/getloads?offset=${params.offset}&size=10&searchValue=${params.searchText}`;
  }
  if (selectedEndPoint && selectedEndPoint.length > 0) {
    return fetch({
      endpoint: selectedEndPoint,
    });
  }
};

export const getLoadDetails = (config: { load_id: number }) => {
  const { load_id } = config;
  return fetch({
    endpoint: `loads/${load_id}`,
  });
};

export const declinetLoad = (config: { load_id: number; reason: string }) => {
  const { load_id, reason } = config;
  return patch({
    endpoint: `partner/load-decline/${load_id}`,
    data: {
      reason: reason,
    },
  });
};

export const acceptLoad = (config: { load_id: number }) => {
  const { load_id } = config;
  return patch({
    endpoint: `partner/load-accept/${load_id}`,
  });
};

export const sendFeedBack = (config: { message: string; load_id: number }) => {
  const { message, load_id } = config;
  return post({
    endpoint: `partner/send-feedback`,
    data: {
      message: message,
      load_id: load_id,
    },
  });
};

export const updateStartWaitingTime = (config: {
  load_id: number;
  isDelivered: boolean;
}) => {
  const { load_id, isDelivered } = config;
  return post({
    endpoint: `assessorial/updateStandbyStart`,
    data: {
      load_id: load_id,
      isDelivered: isDelivered,
    },
  });
};

export const getMyJobsList = (config: { offset: number }) => {
  const { offset } = config;
  return fetch({
    endpoint: `partner/my-jobs?offset=${offset}&size=10&sortBy=updated_at:desc`,
  });
};

export const getLoadBoardList = (config: { offset: number }) => {
  const { offset } = config;
  return fetch({
    endpoint: `partner/load-board?offset=${offset}&size=10&sortBy=updated_at:desc`,
  });
};

export const getMyCompletedJobsList = (config: { offset: number }) => {
  const { offset } = config;
  console.log("getMyCompletedJobsList", offset);
  return fetch({
    endpoint: `partner/my-jobs?status=10&offset=${offset}&size=10&sortBy=updated_at:desc`,
  });
};

export const updateLoadStatus = (config: {
  status: number;
  load_id: number;
}) => {
  const { status, load_id } = config;
  console.log("updateLoadStatus", status, load_id);
  return patch({
    endpoint: `partner/load-status/${load_id}`,
    data: {
      status: status,
    },
  });
};

export const approveQuote = (config: {
  jobId: string;
  userId: string;
  quoteId: string;
}) => {
  const { jobId, userId, quoteId } = config;
  return patch({ endpoint: `users/${userId}/jobs/${jobId}/quotes/${quoteId}` });
};

export const cancelJob = (config: { jobId: string; userId: string }) => {
  const { jobId, userId } = config;
  return destroy({
    endpoint: `users/${userId}/jobs/${jobId}`,
  });
};

export const acceptJob = (config: { jobId: string; userId: string }) => {
  const { jobId, userId } = config;
  return fetch({
    endpoint: `users/${userId}/jobs/${jobId}/accept`,
  });
};

export const statusChange = (config: {
  jobId: string;
  userId: string;
  job_status: string;
}) => {
  const { jobId, userId, job_status } = config;
  return post({
    endpoint: `users/${userId}/jobs/${jobId}/job_status_update`,
    data: { job_status: job_status },
  });
};

export const getCreditCardList = (config: { orgId: string }) => {
  const { orgId } = config;
  return fetch({
    endpoint: `organizations/${orgId}/credit_cards`,
  });
};

export const setupJobImages = (config: {
  jobId: string;
  userId: string;
  setupImage: string[];
  live_lat: string;
  live_lng: string;
}) => {
  const { jobId, userId, setupImage, live_lat, live_lng } = config;
  return post({
    endpoint: `users/${userId}/jobs/${jobId}/job_setup_images`,
    data: { job: { images: setupImage, live_lat, live_lng } },
  });
};

export const completeJob = (config: {
  userId: string;
  jobId: string;
  accountId?: string;
}) => {
  const { userId, jobId, accountId } = config;
  return patch({
    endpoint: `users/${userId}/jobs/${jobId}/complete`,
    data: { job: { account_id: accountId } },
  });
};

export const completeTip = (config: {
  userId: string;
  jobId: string;
  accountId?: string;
  tip: String;
}) => {
  const { userId, jobId, accountId, tip } = config;
  return patch({
    endpoint: `users/${userId}/jobs/${jobId}/tip`,
    data: { job: { account_id: accountId, amount: tip } },
  });
};

export const createJob = (
  userId: string,
  values: {
    additional_instructions?: string;
    organizationId: string;
    lat: string;
    lng: string;
    package_id: String;
    address_line1: String;
    address_line2: String;
    city: String;
    state: String;
    zip_code: String;
    beach_access_point: String;
    job_date: String;
    job_time: String;
    return_pickup_date: String;
    return_pickup_time: String;
  }
) => {
  return post({
    endpoint: `users/${userId}/jobs`,
    data: { job: values },
  });
};

export const fetchRunnerDashboardData = (config: { id: string }) => {
  const { id } = config;

  return fetch({
    endpoint: `users/${id}/jobs/runner_dashboard`,
  });
};

export const fetchAllJobs = (config: { id: string; role: String }) => {
  const { id, role } = config;

  // switch (role) {
  //   case "carrier":
  //   case "fleet_driver":
  //   case "owner_operator":

  if (role == "beach_runner") {
    return fetch<Job[]>({
      endpoint: `vendors/${id}/jobs`,
    });
  } else {
    return fetch<Job[]>({
      endpoint: `users/${id}/jobs`,
    });
  }

  //   case "service_tech":
  //     return fetch<Job[]>({
  //       endpoint: `vendors/${id}/jobs?filter[job.status]=in_progress,invoiced&filter[jobs.payment_status]=not_paid&sort[jobs.created_at]=desc&include=quotes,organization`
  //     });

  //   case "vendor":
  //     return fetch<Job[]>({
  //       endpoint: `vendors/${id}/jobs?sort[jobs.created_at]=desc&include=quotes`
  //     });

  //   default:
  //     return;
  // }
};

export const fetchAllUnClaimedJobs = (config: { id: string }) => {
  const { id } = config;
  return fetch<Job[]>({
    endpoint: `vendors/${id}/jobs/job_board`,
  });
};

export const fetchJob = (config: {
  userId: string;
  jobId: string;
  userRole: OrganizationMembership;
  role: String;
}) => {
  const { userId, userRole, jobId, role } = config;

  if (userRole == "beach_runner") {
    return fetch<Job[]>({
      endpoint: `vendors/${userId}/jobs/${jobId}`,
    });
  } else {
    return fetch<Job[]>({
      endpoint: `users/${userId}/jobs/${jobId}`,
    });
  }

  // switch (userRole) {
  //   case "carrier":
  //   case "fleet_driver":
  //   case "owner_operator":
  //     return fetch<Job>({
  //       endpoint: `users/${userId}/jobs/${jobId}?include=charges,charges.destination
  //       ,organization,quotes,quotes.service_tech,quotes.vendor,quotes.vendor.addresses,quotes.vendor.email_addresses,quotes.vendor.phone_number,user,user.profile,quotes.service_tech.profile`
  //     });

  //   case "service_tech":
  //   case "vendor":
  //     return fetch<Job>({
  //       endpoint: `vendors/${userId}/jobs/${jobId}?include=charges,charges.destination
  //       ,organization,quotes,quotes.service_tech,quotes.vendor,quotes.vendor.addresses,quotes.vendor.email_addresses,quotes.vendor.phone_number,user,user.profile,quotes.service_tech.profile`
  //     });

  //   default:
  //     return;
  // }
};

export const invoiceJob = (config: { vendorId: string; jobId: string }) => {
  const { vendorId, jobId } = config;
  return patch({
    endpoint: `vendors/${vendorId}/jobs/${jobId}/invoice`,
  });
};

export const assignServiceTech = (config: {
  vendorId: string;
  jobId: string;
  serviceTechId: string;
  quoteId: string;
}) => {
  const { vendorId, jobId, serviceTechId, quoteId } = config;
  return patch({
    endpoint: `vendors/${vendorId}/quotes/${quoteId}/assign`,
    data: { quote: { user_id: serviceTechId } },
  });
};

export const requoteJob = (config: {
  vendorId: string;
  jobId: string;
  price: string;
  description: string | undefined;
}) => {
  const { vendorId, jobId, price, description } = config;

  const priceAsNumber = stringToNumber(price);
  return patch({
    endpoint: `vendors/${vendorId}/jobs/${jobId}/requote`,
    data: { job: { price: priceAsNumber, description } },
  });
};

export const submitQuote = (
  vendorId: string,
  quoteId: string,
  values: { description?: string; quote: string; eta: string }
) => {
  return patch({
    endpoint: `vendors/${vendorId}/quotes/${quoteId}`,
    data: { quote: { price: values.quote, timeTilService: values.eta } },
  });
};

export const fetchPackages = () =>
  fetch<Packages>({
    endpoint: "packages",
  }).then((response) => response);
