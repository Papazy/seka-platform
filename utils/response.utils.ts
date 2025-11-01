import { NextResponse } from "next/server";

// Utils untuk handler route
export type FormattedResponseProps = {
  success: boolean;
  data?: any;
  error?: any;
  status_code?: number;
  message?: string;
};

export const FormattedResponse = (props: FormattedResponseProps) => {
  if (!props.success) {
    return NextResponse.json(
      {
        success: props.success,
        error: props.error,
        message: props.message ?? "",
      },
      { status: props.status_code || 500 },
    );
  }
  return NextResponse.json(
    {
      data: props.data,
      success: props.success,
      message: props.message ?? "",
    },
    { status: props.status_code || 200 },
  );
};
