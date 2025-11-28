import { Submission } from "@/types/submission";
import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { getRelativeTime } from "@/utils/getRelativeTime";
import { getStatusColor, getStatusText } from "./utils";

const SubmissionContent = ({
    submissions,
    submissionsLoading,
}: {
    submissions?: Submission[];
    submissionsLoading: boolean;
}) => {
    const [selectedSubmission, setSelectedSubmission] =
        useState<Submission | null>(null);
    const [currentView, setCurrentView] = useState("list");


    if (submissionsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    if (currentView === "detail" && selectedSubmission) {
        return (
            <DetailSubmissionContent
                setCurrentView={setCurrentView}
                selectedSubmission={selectedSubmission}
                getStatusText={getStatusText}
                getStatusColor={getStatusColor}
            />
        )
    }

    return (
        <ListSubmissionContent
            submissions={submissions}
            setSelectedSubmission={setSelectedSubmission}
            setCurrentView={setCurrentView}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
        />
    )
};

const ListPraktikanContent = () => {  
     
}

const ListSubmissionContent = ({submissions, setSelectedSubmission, setCurrentView, getStatusColor, getStatusText}: {submissions?: Submission[]; setSelectedSubmission: React.Dispatch<React.SetStateAction<Submission | null>>; setCurrentView: React.Dispatch<React.SetStateAction<string>>; getStatusColor: (status: string) => string; getStatusText: (status: string) => string; }) => { 
    return (
        <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">Submissions</h3>

            {submissions?.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">Belum ada submission</p>
                </div>
            ) : (
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr className="border-b">
                                    <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-700">
                                        No
                                    </th>
                                    <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-700">
                                        Waktu
                                    </th>
                                    <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-700 hidden sm:table-cell">
                                        Bahasa
                                    </th>
                                    <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-700">
                                        Verdict
                                    </th>
                                    <th className="px-3 md:px-4 py-3 text-left text-xs font-medium text-gray-700">
                                        Nilai
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions?.map((submission, index) => {
                                    const verdict = submission.statusCode;
                                    const length = submissions.length;
                                    return (
                                        <tr
                                            key={submission.id}
                                            className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => {
                                                setSelectedSubmission(submission);
                                                setCurrentView("detail");
                                            }}
                                        >
                                            <td className="px-3 md:px-4 py-3 text-xs">{length - index}</td>
                                            <td className="px-3 md:px-4 py-3 text-xs text-gray-600">
                                                {getRelativeTime(submission.submittedAt)}
                                            </td>
                                            <td className="px-3 md:px-4 py-3 text-xs hidden sm:table-cell">
                                                {submission.bahasa.nama}
                                            </td>
                                            <td className="px-3 md:px-4 py-3">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded ${getStatusColor(verdict)}`}
                                                >
                                                    {getStatusText(verdict)}
                                                </span>
                                            </td>
                                            <td className="px-3 md:px-4 py-3 text-xs font-medium">
                                                {submission.score}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

const DetailSubmissionContent = ({ setCurrentView, selectedSubmission, getStatusText, getStatusColor }: { setCurrentView: any, selectedSubmission: Submission, getStatusText: (status: string) => string, getStatusColor: (status: string) => string }) => {
    console.log({selectedSubmission})
    // Calculate average time and memory
    const avgTime = selectedSubmission.testCaseResult.length > 0
        ? Math.round(selectedSubmission.testCaseResult.reduce((sum, tc) => sum + tc.waktuEksekusiMs, 0) / selectedSubmission.testCaseResult.length)
        : 0;
    
    const avgMemory = selectedSubmission.testCaseResult.length > 0
        ? Math.round(selectedSubmission.testCaseResult.reduce((sum, tc) => sum + tc.memoriKb, 0) / selectedSubmission.testCaseResult.length)
        : 0;

    const testCasesLength = selectedSubmission.testCaseResult.length;
    const highestScorePerTestCase = 100 / testCasesLength;

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header with back button */}
            <div>
                <button
                    onClick={() => setCurrentView("list")}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium transition-colors"
                >
                    ← Kembali
                </button>
            </div>

            {/* Main Info Card */}
            <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">Hasil</h3>
                
                {/* Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
                    {/* Left Column */}
                    <div className="space-y-3">
                        <table className="w-full text-xs md:text-sm">
                            <tbody>
                                <tr>
                                    <td className="py-1.5 md:py-2 text-gray-600 w-32 md:w-40">Soal</td>
                                    <td className="py-1.5 md:py-2 font-semibold text-gray-800">{selectedSubmission.soal?.judul}</td>
                                </tr>
                                <tr>
                                    <td className="py-1.5 md:py-2 text-gray-600">Skor</td>
                                    <td className="py-1.5 md:py-2 font-semibold text-gray-800">{selectedSubmission.score}</td>
                                </tr>
                                <tr>
                                    <td className="py-1.5 md:py-2 text-gray-600">Waktu Rata-rata</td>
                                    <td className="py-1.5 md:py-2 font-semibold text-gray-800">{avgTime} ms</td>
                                </tr>
                                <tr>
                                    <td className="py-1.5 md:py-2 text-gray-600">Memori Rata-rata</td>
                                    <td className="py-1.5 md:py-2 font-semibold text-gray-800">{avgMemory} kb</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                         <table className="w-full text-xs md:text-sm">
                            <tbody>
                                <tr>
                                    <td className="py-1.5 md:py-2 text-gray-600 w-32 md:w-40">User</td>
                                    <td className="py-1.5 md:py-2 font-semibold text-gray-800 break-words">{selectedSubmission.peserta?.mahasiswa.nama}</td>
                                </tr>
                                <tr>
                                    <td className="py-1.5 md:py-2 text-gray-600">ID Submission</td>
                                    <td className="py-1.5 md:py-2 font-semibold text-gray-800 break-all text-[10px] md:text-xs">{selectedSubmission.id}</td>
                                </tr>
                                <tr>
                                    <td className="py-1.5 md:py-2 text-gray-600">Waktu</td>
                                    <td className="py-1.5 md:py-2 font-semibold text-gray-800"> {new Date(selectedSubmission.submittedAt).toLocaleString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit"
                                })}</td>
                                </tr>
                                <tr>
                                    <td className="py-1.5 md:py-2 text-gray-600">Bahasa</td>
                                    <td className="py-1.5 md:py-2 font-semibold text-gray-800">{selectedSubmission.bahasa.nama}</td>
                                </tr>
                            </tbody>
                        </table>
                       
                    </div>
                </div>
            </div>

            {/* Detail Test Case */}
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-b border-gray-300">
                    <h4 className="text-base md:text-lg font-bold text-gray-800">Detail Test Case</h4>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-300">
                            <tr>
                                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">
                                    No
                                </th>
                                <th className="px-3 md:px-6 py-2 md:py-3 text-center text-xs md:text-sm font-semibold text-gray-700">
                                    Status
                                </th>
                                <th className="px-3 md:px-6 py-2 md:py-3 text-center text-xs md:text-sm font-semibold text-gray-700">
                                    Waktu
                                </th>
                                <th className="px-3 md:px-6 py-2 md:py-3 text-center text-xs md:text-sm font-semibold text-gray-700">
                                    Memori
                                </th>
                                <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-gray-700">
                                    Nilai
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {selectedSubmission.testCaseResult.map((result, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-800">
                                        {index + 1}
                                    </td>
                                    <td className="px-3 md:px-6 py-3 md:py-4 text-center">
                                        <span className={`inline-block px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded ${getStatusColor(result.status)}`}>
                                            {getStatusText(result.status)}
                                        </span>
                                    </td>
                                    <td className="px-3 md:px-6 py-2 md:py-3 text-center text-xs md:text-sm font-semibold text-gray-700">
                                        {result.waktuEksekusiMs} ms
                                    </td>
                                    <td className="px-3 md:px-6 py-2 md:py-3 text-center text-xs md:text-sm font-semibold text-gray-700">
                                        {result.memoriKb} kb
                                    </td>
                                    <td className="px-3 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-semibold text-gray-800">
                                        {result.status === "AC" ? highestScorePerTestCase.toFixed(2) : 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                            <tr>
                                <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold text-gray-800" colSpan={4}>
                                    Skor
                                </td>

                                <td className="px-3 md:px-6 py-3 md:py-4 text-right text-base md:text-lg font-bold text-gray-800">
                                    {selectedSubmission.score}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Source Code */}
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-b border-gray-300">
                    <h4 className="text-base md:text-lg font-bold text-gray-800">Source Code</h4>
                </div>
                <div className="p-4 md:p-6">
                    <div className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
                        <div className="bg-gray-800 px-3 md:px-4 py-2 text-xs md:text-sm border-b border-gray-700 font-medium">
                            {selectedSubmission.bahasa.nama}
                        </div>
                        <pre className="p-3 md:p-6 text-xs md:text-sm leading-relaxed overflow-x-auto">
                            <code>{selectedSubmission.sourceCode}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubmissionContent;