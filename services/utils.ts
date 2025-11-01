export type ServiceResponseProps = {
  success?: boolean;
  data?: any;
  error?: any;
  message?: string;
};

export type ServiceResponseType = {
  success: boolean;
  data?: any;
  error?: any;
  message?: string;
};

export const ServiceResponse = ({
  success = true,
  data,
  error,
  message,
}: ServiceResponseProps): ServiceResponseType => {
  if (success) {
    return {
      success: success,
      data: data,
      message,
    };
  } else {
    return {
      success: false,
      error: error,
      message,
    };
  }
};
