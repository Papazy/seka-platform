import { Submission } from "@prisma/client";

export type ServiceResponseProps = {
  success?: boolean;
  data?: any;
  error?: any;
  message?: string;
};

export type ServiceResponseType<T = any> = {
  success: boolean;
  data?: T;
  error?: any;
  message?: string;
};

export const ServiceResponse = <T = any>({
  success = true,
  data,
  error,
  message,
}: ServiceResponseProps): ServiceResponseType<T> => {
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

export interface SubmissionsStats {
    totalSubmission: number,
    latestSubmission: Submission | null,
    highestScore: number,
    highestScoreSubmission: Submission | null,
} 



export const getSubmissionStatsFromSubmissions = (submissions: Submission[]): SubmissionsStats => {
    const totalSubmission = submissions.length;
    let highestScore = 0;
    let latestSubmission = submissions?.[0] || null
    let highestScoreSubmission = submissions?.[0] || null

    if(totalSubmission === 0){
        return {
                totalSubmission,
                latestSubmission,
                highestScore,
                highestScoreSubmission
            }
    }

    submissions.map((sub) => {
        if(sub.score > highestScore) {
            highestScore = sub.score;
            highestScoreSubmission = sub;
        }

        if (highestScore === 100) return // tidak perlu looping jika sudah seratus
    })

    return {
            totalSubmission,
            latestSubmission,
            highestScore,
            highestScoreSubmission
        }
}