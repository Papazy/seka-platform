"use client";
import { useSoal } from "@/hooks/useSoal";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Bahasa, useBahasa } from "@/hooks/useBahasa";
import toast from "react-hot-toast";
import { Clipboard, Edit } from "lucide-react";
import { useBahasaTugas } from "@/hooks/useBahasaTugas";
import { Button } from "@/components/ui/button";
import { useSubmissionsSoalMahasiswa } from "@/hooks/useSubmissionsSoalMahasiswa";
import { Submission } from "@/types/submission";
import { useRolePraktikum } from "@/contexts/RolePraktikumContext";
import AsistenSubmissions from "@/components/Soal/AsistenSubmission";

import { getRelativeTime } from "@/utils/getRelativeTime";
import SoalLayout from "@/components/layouts/mahasiswa/SoalLayout";
import { PraktikumRole } from "@/lib/constants";

import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import RightSidebar from "@/components/Soal/RightSidebar";
import SoalContent from "@/components/Soal/SoalContent";
import SubmissionContent from "@/components/Soal/SubmissionContent";

export interface TestResultResponse {
  success: boolean;
  data: Data;
  message: string;
  error?: string;
}

export interface Data {
  verdict: string;
  score: number;
  total_cases: number;
  passed_cases: number;
  total_time_ms: number;
  max_time_ms: number;
  avg_time_ms: number;
  max_memory_kb: number;
  test_results: TestResult[];
  error_message: any;
  judged_at: string;
}

export interface TestResult {
  case_number: number;
  verdict: string;
  time_ms: number;
  memory_kb: number;
  input_data: string;
  expected_output: string;
  actual_output: string;
  error_message: any;
}

export type RolePraktikum = (typeof PraktikumRole)[keyof typeof PraktikumRole];

interface TopScore {
  rank: number;
  nama: string;
  npm: string;
  score: number;
  submittedAt: string;
}

export default function SoalPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"soal" | "submission">("soal");
  const router = useRouter();

  const { data: soalData, isLoading: soalLoading } = useSoal(
    params.soalId as string,
  );
  const { data: bahasaData, isLoading: bahasaLoading } = useBahasaTugas(
    params.tugasId as string,
  );
  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    refetch: refetchSubmission,
  } = useSubmissionsSoalMahasiswa(params.soalId as string);

  const { isAsisten } = useRolePraktikum();
  const [role, setRole] = useState<
    (typeof PraktikumRole)[keyof typeof PraktikumRole]
  >(PraktikumRole.PRAKTIKAN);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "soal" | "submission");
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  useEffect(() => {
    if (isAsisten(params.id as string)) {
      setRole(PraktikumRole.ASISTEN);
    }
  }, [isAsisten, params.id]);

  // Set initial tab from URL params
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as "soal" | "submission";
    if (tabFromUrl && (tabFromUrl === "soal" || tabFromUrl === "submission")) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <SoalLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      rightSidebar={
        bahasaLoading ? (
          <div className="bg-white animate-pulse p-5 rounded-lg border h-32">
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <RightSidebar
            activeTab={activeTab}
            bahasa={bahasaData || []}
            soal={soalData}
            refetchSubmission={refetchSubmission}
            setActiveTab={setActiveTab}
            role={role}
          />
        )
      }
    >
      <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded-lg">
        {role === PraktikumRole.ASISTEN ? (
          activeTab === "soal" ? (
            <div className=" flex flex-col">
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeTab === "soal"
                    ? soalData?.judul || "Loading..."
                    : "Riwayat Submission"}
                </h2>
                {role === PraktikumRole.ASISTEN && (
                  <Button
                    onClick={() =>
                      router.push(
                        `/mahasiswa/praktikum/${params.id}/tugas/${params.tugasId}/soal/${params.soalId}/edit`,
                      )
                    }
                    className="bg-green-primary hover:bg-green-700 text-white cursor-pointer "
                  >
                    <Edit /> Edit
                  </Button>
                )}
              </div>

              <div className="flex-1 px-6 py-4">
                <SoalContent soal={soalData} />
              </div>
            </div>
          ) : (
            <AsistenSubmissions
              praktikumId={params.id as string}
              tugasId={params.tugasId as string}
              soalId={params.soalId as string}
              soalData={soalData}
            />
          )
        ) : soalLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : (
          <ContentArea
            activeTab={activeTab}
            soal={soalData}
            submissions={submissionsData}
            submissionsLoading={submissionsLoading}
            role={role}
            params={{
              id: params.id as string,
              tugasId: params.tugasId as string,
              soalId: params.soalId as string,
            }}
          />
        )}
      </div>
    </SoalLayout>
  );
}

// Content Area
const ContentArea = ({
  activeTab,
  soal,
  submissions,
  submissionsLoading,
  role,
  params,
}: {
  activeTab: "soal" | "submission";
  soal: any;
  submissions?: Submission[];
  submissionsLoading: boolean;
  role: RolePraktikum;
  params: { id: string; tugasId: string; soalId: string };
}) => {
  const router = useRouter();

  return (
    <div className=" flex flex-col">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {activeTab === "soal"
            ? soal?.judul || "Loading..."
            : "Riwayat Submission"}
        </h2>
        {role === PraktikumRole.ASISTEN && (
          <Button
            onClick={() =>
              router.push(
                `/mahasiswa/praktikum/${params.id}/tugas/${params.tugasId}/soal/${params.soalId}/edit`,
              )
            }
            className="bg-green-primary hover:bg-green-700 text-white cursor-pointer "
          >
            <Edit /> Edit
          </Button>
        )}
      </div>

      <div className="flex-1 px-6 py-4">
        {activeTab === "soal" ? (
          <SoalContent soal={soal} />
        ) : (
          <SubmissionContent
            submissions={submissions}
            submissionsLoading={submissionsLoading}
          />
        )}
      </div>
    </div>
  );
};