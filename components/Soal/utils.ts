export const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
            AC: "AC",
            WA: "WA",
            TLE: "TLE",
            CE: "CE",
            RTE: "RE",
            PENDING: "PENDING",
        };
        return statusMap[status] || status;
    };

export const getStatusColor = (status: string) => {
        const colorMap: { [key: string]: string } = {
            AC: "bg-green-600 text-white",
            WA: "bg-red-600 text-white",
            TLE: "bg-orange-600 text-white",
            CE: "bg-red-600 text-white",
            RTE: "bg-red-600 text-white",
            PENDING: "bg-slate-400 text-white",
        };
        return colorMap[status] || "bg-gray-600 text-white";
    };
