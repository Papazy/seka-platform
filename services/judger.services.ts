import { JudgerPayload } from "./submission.service";
import { ServiceResponse } from "./utils";

const JUDGE_API_URL = (process.env.JUDGE_API_URL || '') + '/v2/judge'

export const submitToJudger = async (payload: JudgerPayload) => {
    try {
        console.log("Payload sent to judger:", payload);
        const response = await fetch(JUDGE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        if (!response.ok) {
            const errorData = await response.json();
            return ServiceResponse({success: false, error: errorData, message: "Failed to submit to judger"});
        }

        const result = await response.json();
        return result;
    }catch(error){
        return error
    }
}

