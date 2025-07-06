'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { use } from 'react';



interface AssignmentData {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  maxTotalScore: number;
  isPublished: boolean;
  createdAt: string;
  class: {
    id: number;
    name: string;
    classCode: string;
  };
  instructor: string;
  userRole: 'STUDENT' | 'DOSEN' | 'ASSISTANT';
  problems: Problem[];
  stats: {
    totalProblems: number;
    solvedProblems: number;
    totalScore: number;
    maxPossibleScore: number;
    progressPercentage: number;
  };
}

interface Problem {
  id: number;
  title: string;
  description: string;
  maxScore: number;
  timeLimit: number;
  memoryLimit: number;
  status: 'solved' | 'partial' | 'wrong-answer' | 'not-attempted';
  score: number;
  attempts: number;
  solvedAt: string | null;
  passedTests: number;
  totalTests: number;
  sampleTestCases: Array<{
    id: number;
    input: string;
    expectedOutput: string;
  }>;
}

export default function AssignmentDetail({ params } : {params: Promise<{id: string, assignmentId: string}>}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { id: classId, assignmentId } = use(params);
  

  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user && assignmentId) {
      fetchAssignmentData();
    }
  }, [isAuthenticated, user, assignmentId]);

  const fetchAssignmentData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data: AssignmentData = await response.json();
        console.log('Assignment data:', data);
        setAssignmentData(data);
      } else if (response.status === 404) {
        setError('Assignment not found');
      } else if (response.status === 403) {
        const errorData = await response.json();
        setError(errorData.error || 'Access denied');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load assignment');
      }
    } catch (error: any) {
      console.error('Error fetching assignment:', error);
      setError('Failed to load assignment data');
    } finally {
      setIsLoading(false);
    }
  };
  

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'solved': return 'bg-green-50 text-green-700 border-green-200';
      case 'partial': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'wrong-answer': return 'bg-red-50 text-red-700 border-red-200';
      case 'not-attempted': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'solved': return 'Solved';
      case 'partial': return 'Partial';
      case 'wrong-answer': return 'Wrong Answer';
      case 'not-attempted': return 'Not Attempted';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'solved':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'wrong-answer':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeLeft = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-600' };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: 'text-orange-600' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', color: 'text-orange-600' };
    } else if (diffDays <= 3) {
      return { text: `${diffDays} days left`, color: 'text-orange-600' };
    } else {
      return { text: `${diffDays} days left`, color: 'text-gray-600' };
    }
  };

  const handleProblemClick = (problemId: number) => {
    router.push(`/class/${classId}/assignment/${assignmentId}/problem/${problemId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Assignment</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <button 
                onClick={fetchAssignmentData}
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

  if (!assignmentData) {
    return null;
  }

  const timeLeft = getTimeLeft(assignmentData.dueDate);

  // const progressPercentage = (assignmentData.solvedProblems / assignmentData.totalProblems) * 100;

  return (
    <div className="min-h-screen bg-white">
    {/* ✅ Header Section dengan Real Data */}
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <button 
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* ✅ Real Assignment Info */}
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-semibold text-gray-900">{assignmentData.title}</h1>
                {!assignmentData.isPublished && assignmentData.userRole !== 'STUDENT' && (
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
                    Draft
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-1">
                {assignmentData.class.classCode} • {assignmentData.class.name}
              </p>
              <p className="text-sm text-gray-500">Instructor: {assignmentData.instructor}</p>
              <div className="flex items-center space-x-4 text-sm mt-2">
                <span className="text-gray-500">Due: {formatDate(assignmentData.dueDate)}</span>
                <span className="text-gray-400">•</span>
                <span className={timeLeft.color}>{timeLeft.text}</span>
              </div>
            </div>
          </div>
          
          {/* ✅ Real Progress */}
          <div className="text-right">
            <div className="text-2xl font-semibold text-gray-900 mb-1">
              {assignmentData.stats.progressPercentage}%
            </div>
            <div className="text-sm text-gray-600 mb-2">Complete</div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#3ECF8E] h-2 rounded-full transition-all"
                style={{ width: `${assignmentData.stats.progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {assignmentData.stats.solvedProblems}/{assignmentData.stats.totalProblems} problems
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ✅ Breadcrumb dengan Real Data */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <button 
              onClick={() => router.push('/class')}
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              Classes
            </button>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <button 
                onClick={() => router.push(`/class/${classId}`)}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                {assignmentData.class.name}
              </button>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 text-sm font-medium">{assignmentData.title}</span>
            </div>
          </li>
        </ol>
      </nav>
    </div>

    {/* ✅ Main Content */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* ✅ Problems List dengan Real Data */}
        <div className="lg:col-span-3">
          {/* Assignment Description */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Assignment Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{assignmentData.description}</p>
            <div className="flex items-center space-x-6 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Due: {formatDate(assignmentData.dueDate)}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>{assignmentData.stats.solvedProblems}/{assignmentData.stats.totalProblems} problems solved</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span>Score: {assignmentData.stats.totalScore}/{assignmentData.stats.maxPossibleScore}</span>
              </div>
            </div>
          </div>

          {/* Problems */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Problems</h2>
              <p className="text-gray-600">Complete all problems to finish this assignment</p>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {assignmentData.problems.length} problems
            </span>
          </div>

          {assignmentData.problems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No problems yet</h3>
              <p className="text-gray-600">Problems will be added to this assignment soon.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignmentData.problems.map((problem, index) => (
                <div 
                  key={problem.id} 
                  onClick={() => handleProblemClick(problem.id)}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(problem.status)}
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#3ECF8E] transition-colors">
                            {problem.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(problem.status)}`}>
                            {getStatusText(problem.status)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{problem.passedTests}/{problem.totalTests} tests passed</span>
                          </div>
                          {problem.attempts > 0 && (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>{problem.attempts} attempts</span>
                            </div>
                          )}
                          {problem.solvedAt && (
                            <div className="flex items-center text-green-600">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Solved {formatDate(problem.solvedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {problem.status === 'solved' && (
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {problem.score}/{problem.maxScore}
                          </div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                      )}
                      <button className="bg-[#3ECF8E] hover:bg-[#3ECF8E]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        {problem.status === 'not-attempted' ? 'Start' : 'View'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Sidebar dengan Real Stats */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Progress Overview */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Total problems</span>
                  <span className="font-semibold text-gray-900">{assignmentData.stats.totalProblems}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Solved</span>
                  <span className="font-semibold text-green-600">{assignmentData.stats.solvedProblems}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Total score</span>
                  <span className="font-semibold text-[#3ECF8E]">
                    {assignmentData.stats.totalScore}/{assignmentData.stats.maxPossibleScore}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Total attempts</span>
                  <span className="font-semibold text-gray-900">
                    {assignmentData.problems.reduce((sum, p) => sum + p.attempts, 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Assignment Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Due date</span>
                  <p className="font-medium text-gray-900">{formatDate(assignmentData.dueDate)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Class</span>
                  <p className="font-medium text-gray-900">{assignmentData.class.classCode}</p>
                </div>
                <div>
                  <span className="text-gray-600">Max score</span>
                  <p className="font-medium text-gray-900">{assignmentData.maxTotalScore}</p>
                </div>
                <div>
                  <span className="text-gray-600">Status</span>
                  <p className={`font-medium ${assignmentData.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>
                    {assignmentData.isPublished ? 'Published' : 'Draft'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
              <button 
      onClick={() => router.push(`/class/${classId}/assignment/${assignmentId}/scoreboard`)}
      className="w-full bg-[#3ECF8E] hover:bg-[#3ECF8E]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      View Scoreboard
    </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}