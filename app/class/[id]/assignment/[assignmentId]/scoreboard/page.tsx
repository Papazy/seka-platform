// app/class/[id]/assignment/[assignmentId]/scoreboard/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { use } from 'react';

interface Problem {
  id: string;
  title: string;
  maxScore: number;
}

interface StudentScore {
  userId: string;
  name: string;
  npm: string;
  totalScore: number;
  totalMaxScore: number;
  problemScores: {
    [problemId: string]: {
      score: number;
      maxScore: number;
      status: string;
      attempts: number;
    };
  };
}

interface ScoreboardData {
  assignment: {
    id: string;
    title: string;
    class: {
      name: string;
      classCode: string;
    };
  };
  problems: Problem[];
  students: StudentScore[];
  summary: {
    totalStudents: number;
    totalProblems: number;
    averageScore: number;
  };
}

export default function ScoreboardPage({ 
  params 
}: { 
  params: Promise<{ id: string; assignmentId: string }> 
}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { id: classId, assignmentId } = use(params);

  const [scoreboardData, setScoreboardData] = useState<ScoreboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user && assignmentId) {
      fetchScoreboardData();
    }
  }, [isAuthenticated, user, assignmentId]);

  const fetchScoreboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/assignments/${assignmentId}/scoreboard`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data: ScoreboardData = await response.json();
        setScoreboardData(data);
      } else if (response.status === 404) {
        setError('Assignment not found');
      } else if (response.status === 403) {
        setError('Access denied');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load scoreboard');
      }
    } catch (error: any) {
      console.error('Error fetching scoreboard:', error);
      setError('Failed to load scoreboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Better status colors with background
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'solved':
        return 'bg-green-100 text-green-800 px-1 py-0.5 rounded font-medium';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded font-medium';
      case 'wrong-answer':
        return 'bg-red-100 text-red-800 px-1 py-0.5 rounded';
      case 'not-attempted':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  // ✅ Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'solved':
        return 'AC';
      case 'partial':
        return 'PA';
      case 'wrong-answer':
        return 'WA';
      case 'not-attempted':
        return '-';
      default:
        return '-';
    }
  };

  // ✅ Calculate stats
  const calculateStats = () => {
    if (!scoreboardData) return null;

    const stats = {
      totalSubmissions: 0,
      solvedProblems: 0,
      partialProblems: 0,
      wrongAnswers: 0,
      notAttempted: 0
    };

    scoreboardData.students.forEach(student => {
      scoreboardData.problems.forEach(problem => {
        const problemScore = student.problemScores[problem.id];
        stats.totalSubmissions += problemScore.attempts;
        
        switch (problemScore.status) {
          case 'solved':
            stats.solvedProblems++;
            break;
          case 'partial':
            stats.partialProblems++;
            break;
          case 'wrong-answer':
            stats.wrongAnswers++;
            break;
          case 'not-attempted':
            stats.notAttempted++;
            break;
        }
      });
    });

    return stats;
  };

  const stats = calculateStats();

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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Scoreboard</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <button 
                onClick={fetchScoreboardData}
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

  if (!scoreboardData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Scoreboard</h1>
                <p className="text-gray-600 text-sm">
                  {scoreboardData.assignment.title} • {scoreboardData.assignment.class.classCode}
                </p>
              </div>
            </div>

            {/* ✅ Quick Stats */}
            <div className="text-right text-sm">
              <div className="text-lg font-semibold text-gray-900">
                {scoreboardData.summary.totalStudents} Students
              </div>
              <div className="text-xs text-gray-500">
                Avg: {scoreboardData.summary.averageScore} pts
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Table */}
      <div className="max-w-full mx-auto px-4 py-4">
        <div className="bg-white rounded border border-gray-200 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-700 border-r border-gray-200 w-8">
                  No
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 border-r border-gray-200 w-20">
                  NPM
                </th>
                {/* ✅ Smaller name column */}
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 border-r border-gray-200 w-24 max-w-24">
                  Nama
                </th>
                {scoreboardData.problems.map((problem, index) => (
                  <th key={problem.id} className="px-2 py-2 text-center text-xs font-medium text-gray-700 border-r border-gray-200 w-16">
                    <div>P{index + 1}</div>
                    <div className="text-xs text-gray-500">({problem.maxScore})</div>
                  </th>
                ))}
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-700 w-16">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scoreboardData.students.map((student, index) => (
                <tr key={student.userId} className="hover:bg-gray-50">
                  {/* No */}
                  <td className="px-2 py-2 text-gray-600 text-center text-xs border-r border-gray-200 font-medium">
                    {index + 1}
                  </td>
                  
                  {/* NPM */}
                  <td className="px-2 py-2 text-gray-600 text-xs border-r border-gray-200 font-mono">
                    {student.npm}
                  </td>
                  
                  {/* ✅ Smaller Nama with truncation */}
                  <td className="px-2 py-2 text-gray-600 text-xs border-r border-gray-200 w-24 max-w-24">
                    <div className="truncate" title={student.name}>
                      {student.name.length > 20 ? student.name.substring(0, 20) + '...' : student.name}
                    </div>
                  </td>
                  
                  {/* Problem Scores */}
                  {scoreboardData.problems.map((problem) => {
                    const problemScore = student.problemScores[problem.id];
                    return (
                      <td key={problem.id} className="px-1 py-2 text-center border-r border-gray-200">
                        <div className="space-y-0.5">
                          {/* Score with background color */}
                          <div className={`text-xs ${getStatusStyle(problemScore.status)}`}>
                            {problemScore.score}
                          </div>
                         
                        </div>
                      </td>
                    );
                  })}
                  
                  {/* Total */}
                  <td className="px-1 py-2 text-center text-xs font-bold text-gray-900">
                    <div>{student.totalScore}</div>
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}