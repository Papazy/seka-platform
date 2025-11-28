import { HasilTugasStatus } from "@prisma/client";

export const getStatusTugasCardForPraktikan = (tugas : any) => {
    // Belum
    // Selesai
    // Terlambat
    let status = "";
    let statusStyle = "";

    let deadlineTime = new Date(tugas.deadline).getTime();
    let now = Date.now();

    if(tugas.status === "not_submitted" || tugas.status === HasilTugasStatus.NOT_STARTED){
        if(deadlineTime < now){
            status = "Terlambat";
            statusStyle = "bg-red-50 text-red-700";
        }else{
            status = "Belum Diserahkan";
            statusStyle = "bg-gray-50 text-gray-600";
        }
    }else{
        status = "Selesai";
        statusStyle = "bg-green-50 text-green-700";
    }
    return {status, statusStyle};
}