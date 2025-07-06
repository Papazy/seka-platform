// app/class/[id]/assignment/[assignmentId]/problem/[problemId]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { use } from 'react';
import ProblemHeader from '@/components/ProblemHeader';
import Breadcrumb from '@/components/Breadcrumb';
import ProblemDescription from '@/components/ProblemDescription';
import SubmissionsList from '@/components/SubmissionsList';
import TopUsers from '@/components/TopUsers';
import CodeEditor from '@/components/CodeEditor';

interface ProblemData {
  id: number;
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  maxScore: number;
  timeLimit: number;
  memoryLimit: number;
  status: 'solved' | 'partial' | 'wrong-answer' | 'not-attempted';
  score: number;
  attempts: number;
  solvedAt: string | null;
  passedTests: number;
  totalTests: number;
  assignment: {
    id: number;
    title: string;
    class: {
      id: number;
      name: string;
      classCode: string;
    };
  };
  userRole: 'STUDENT' | 'DOSEN' | 'ASSISTANT';
  sampleTestCases: Array<{
    id: number;
    input: string;
    expectedOutput: string;
  }>;
  submissions: Array<{
    id: number;
    status: string;
    score: number;
    language: string;
    submittedAt: string;
    executionTime: string;
    memory: string;
    testsPassed: number;
    totalTests: number;
    code: string;
  }>;
  leaderboard: Array<{
    rank: number;
    name: string;
    time: string;
    memory: string;
    submittedAt: string;
    language: string;
    score: number;
    isCurrentUser: boolean;
  }>;
}

interface JudgeResult {
  input: string;
  expected_output: string;
  actual_output: string;
  passed: boolean;
  status: string;
  execution_time: number;
}

interface JudgeResponse {
  status: string;
  total_case: number;
  total_benar: number;
  results: JudgeResult[];
}

export default function ProblemDetail({ 
  params 
}: { 
  params: Promise<{ id: string; assignmentId: string; problemId: string }> 
}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { id: classId, assignmentId, problemId } = use(params);
  
  //  Real data states
  const [problemData, setProblemData] = useState<ProblemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  //  UI states
  const [activeTab, setActiveTab] = useState('description');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaderboardTab, setLeaderboardTab] = useState('first');

  const [pollingSubmissionId, setPollingSubmissionId] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated && user && problemId) {
      fetchProblemData();
    }
  }, [isAuthenticated, user, problemId]);

  const fetchProblemData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/problems/${problemId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data: ProblemData = await response.json();
        console.log('Problem data:', data);
        setProblemData(data);
        
        //  Load last submission code if available
        if (data.submissions.length > 0) {
          setCode(data.submissions[0].code || '');
          // Set language from last submission
          const lastLang = data.submissions[0].language.toLowerCase();
          if (['python', 'cpp', 'c', 'java'].includes(lastLang)) {
            setLanguage(lastLang);
          }
        }
      } else if (response.status === 404) {
        setError('Problem not found');
      } else if (response.status === 403) {
        const errorData = await response.json();
        setError(errorData.error || 'Access denied');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load problem');
      }
    } catch (error: any) {
      console.error('Error fetching problem:', error);
      setError('Failed to load problem data');
    } finally {
      setIsLoading(false);
    }
  };

  //  Helper functions

  const pollSubmissionStatus = async (submissionId: number) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}/status`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const statusData = await response.json();

        console.log("mendapatkan status data submission : ", statusData)
        
        //  Check if judging is complete
        if (['ACCEPTED', 'WRONG_ANSWER', 'PARTIAL', 'COMPILE_ERROR', 'RUNTIME_ERROR', 'JUDGE_ERROR'].includes(statusData.status)) {
          // Judging complete
          setPollingSubmissionId(null);
          setIsSubmitting(false);
          
          //  Refresh problem data
          await fetchProblemData();
          setActiveTab('submissions');
          
        } else if (statusData.status === 'JUDGING') {
          // Still judging, continue polling
          setTimeout(() => pollSubmissionStatus(submissionId), 2000);
        } else if (statusData.status === 'PENDING') {
          // Still pending, continue polling
          setTimeout(() => pollSubmissionStatus(submissionId), 1000);
        }
      } else {
        console.error('Error polling submission status');
        setPollingSubmissionId(null);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error polling submission status:', error);
      setPollingSubmissionId(null);
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'solved':
      case 'accepted': 
        return 'bg-green-50 text-green-700 border-green-200';
      case 'partial': 
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'wrong-answer':
      case 'wrong_answer': 
        return 'bg-red-50 text-red-700 border-red-200';
      case 'time_limit_exceeded': 
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'memory_limit_exceeded': 
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'runtime_error': 
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'not-attempted': 
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default: 
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'solved': return 'Solved';
      case 'accepted': return 'Accepted';
      case 'partial': return 'Partial';
      case 'wrong-answer':
      case 'wrong_answer': return 'Wrong Answer';
      case 'time_limit_exceeded': return 'Time Limit Exceeded';
      case 'memory_limit_exceeded': return 'Memory Limit Exceeded';
      case 'runtime_error': return 'Runtime Error';
      case 'not-attempted': return 'Not Attempted';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'solved':
      case 'accepted':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'wrong-answer':
      case 'wrong_answer':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'partial':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = async () => {
    if (!problemData || !code.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      //  Submit without judge results first
      const response = await fetch(`/api/problems/${problemId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          sourceCode: code,
          language: language
        })
      });
      
      if (response.ok) {
        const submissionData = await response.json();
        
        //  Start polling for results
        setPollingSubmissionId(submissionData.id);
        
        // Switch to submissions tab immediately
        setActiveTab('submissions');

        // Refresh data to show new submission
        await fetchProblemData();
        
        //  Start polling
        setTimeout(() => pollSubmissionStatus(submissionData.id), 1000);
        
      } else {
        const errorData = await response.json();
        console.error('Error submitting:', errorData.error);
        setIsSubmitting(false);
      }
      
    } catch (error) {
      console.error('Error submitting solution:', error);
      setIsSubmitting(false);
    }
  };

  const getSubmitButtonText = () => {
    if (pollingSubmissionId) {
      return 'Judging...';
    } else if (isSubmitting) {
      return 'Submitting...';
    } else {
      return 'Submit Solution';
    }
  };

  const languages = [
    { value: 'python', label: 'Python', aceMode: 'python' },
    { value: 'cpp', label: 'C++', aceMode: 'c_cpp' },
    { value: 'c', label: 'C', aceMode: 'c_cpp' },
    { value: 'java', label: 'Java', aceMode: 'java' },
  ];

  //  Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  //  Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Problem</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <button 
                onClick={fetchProblemData}
                className="bg-[#3ECF8E] text-white px-6 py-3 rounded-lg hover:bg-green-600"
              >
                Try Again
              </button>
              <button 
                onClick={() => router.back()}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!problemData) {
    return null;
  }

  //  Format leaderboard data for TopUsers component
  const leaderboardData = {
    first: [...problemData.leaderboard].sort((a, b) => 
      new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    ),
    time: [...problemData.leaderboard].sort((a, b) => 
      parseInt(a.time) - parseInt(b.time)
    ),
    memory: [...problemData.leaderboard].sort((a, b) => 
      parseFloat(a.memory) - parseFloat(b.memory)
    ),
  };

  //  Format test cases for CodeEditor
  const testCases = problemData.sampleTestCases.map(tc => ({
    input: tc.input,
    expected_output: tc.expectedOutput
  }));

  return (
    <div className="min-h-screen bg-white">
      {/*  Header dengan Real Data */}
      <ProblemHeader
        problemData={{
          ...problemData,
          examples: problemData.sampleTestCases.map((tc, index) => ({
            input: tc.input,
            output: tc.expectedOutput,
            explanation: `Test case ${index + 1}`
          }))
        }}
        assignmentData={{
          title: problemData.assignment.title,
          className: problemData.assignment.class.name
        }}
        onBack={() => router.back()}
        getStatusIcon={getStatusIcon}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
      />

      {/*  Breadcrumb dengan Real Data */}
      <Breadcrumb
        classId={classId}
        assignmentId={assignmentId}
        assignmentData={{
          title: problemData.assignment.title,
          className: problemData.assignment.class.name
        }}
        problemTitle={problemData.title}
        onNavigate={(path) => router.push(path)}
      />

      {/*  Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          {/* Left Column - Problem Description/Submissions */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-lg">
              {/* Tabs */}
              <div className="border-b border-gray-200 px-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'description'
                        ? 'border-[#3ECF8E] text-[#3ECF8E]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('submissions')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'submissions'
                        ? 'border-[#3ECF8E] text-[#3ECF8E]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Submissions ({problemData.submissions.length})
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'description' && (
                  <ProblemDescription 
                    problemData={{
                      ...problemData,
                      examples: problemData.sampleTestCases.map((tc, index) => ({
                        input: tc.input,
                        output: tc.expectedOutput,
                        explanation: `Test case ${index + 1}`
                      }))
                    }} 
                  />
                )}
                {activeTab === 'submissions' && (
                  <SubmissionsList
                    submissions={problemData.submissions}
                    maxScore={problemData.maxScore}
                    getStatusColor={getStatusColor}
                    formatDate={formatDate}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Conditional Content */}
          <div className="lg:col-span-2">
            {activeTab === 'submissions' ? (
              <TopUsers
                leaderboardData={leaderboardData}
                activeTab={leaderboardTab}
                onTabChange={setLeaderboardTab}
              />
            ) : (
              <CodeEditor
              code={code}
              language={language}
              languages={languages}
              isSubmitting={isSubmitting || pollingSubmissionId !== null}
              maxScore={problemData.maxScore}
              testCases={testCases}
              onCodeChange={setCode}
              onLanguageChange={setLanguage}
              onSubmit={handleSubmit} //  Updated handler (remove judgeResults parameter)
              submitButtonText={getSubmitButtonText()}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}