'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { use } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";


interface ClassData {
  id: number;
  name: string;
  classCode: string;
  semester: string;
  year: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  assignments: Assignment[];
  members: ClassMember[];
  announcements: Announcement[];
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  maxTotalScore: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ClassMember {
  userId: number;
  roleInClass: 'STUDENT' | 'DOSEN' | 'ASSISTANT';
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    profilePictureUrl?: string;
  };
}

interface Announcement {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  author: {
    name: string;
    role: string;
  };
}

export default function ClassPage({ params } : {params: Promise<{id: string}>}) {
  const router = useRouter();
  const { id } = use(params);
  const [classData, setClassData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [userRole, setUserRole] = useState<'STUDENT' | 'DOSEN' | 'ASSISTANT' | null>(null)

  const [activeTab, setActiveTab] = useState<'assignments' | 'announcements' | 'members'>('assignments');


  const {user, isAuthenticated}= useAuth()

  useEffect(() => {
    if (isAuthenticated && user && id){
      fetchClassData();
    }
  }, [isAuthenticated, user, id]);

  const fetchClassData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/classes/${id}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data: ClassData = await response.json();
        console.log('Class Data', data)

        setClassData(data);

        const currentUserMembership = data.members.find((member: ClassMember) => member.user.id === user?.id);

        if (currentUserMembership) {
          setUserRole(currentUserMembership.roleInClass);
        }else{
          setError("You are not a member of this class.");
        }
      }else if(response.status === 404) {
        throw new Error('Class Not Found')
      }else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch class data.");
      }
    }catch (err: any) {
      console.error("Failed to fetch class data:", err);
      setClassData(null);
    }finally {
      setIsLoading(false)
    }
  }

  




  if (!classData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-gray-600">Loading class...</p>
          </div>
        </div>
      </div>
    );
  }


  const getAssignmentStatus = (assignment: Assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);

    if(!assignment.isPublished) {
      return { status: 'draft', color: 'bg-gray-50 text-gray-700 border-gray-200', text: 'Draft' };
    }

    if (dueDate < now) {
      return { status: 'overdue', color: 'bg-red-50 text-red-700 border-red-200', text: 'Overdue' };
    }

    const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 1) {
      return { status: 'due_soon', color: 'bg-orange-50 text-orange-700 border-orange-200', text: 'Due Soon' };
    }
    
    return { status: 'active', color: 'bg-green-50 text-green-700 border-green-200', text: 'Active' };
  
  }

  const getTimeLeft = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `${diffDays} days left`;
    }
  };

  const getStatusColor = (status : any) => {
    switch (status) {
      case 'assigned': return 'bg-blue-50 text-blue-700 border-blue-200'; // ditugaskan (baru, belum selesai)
      case 'not_submitted': return 'bg-red-50 text-red-700 border-red-200'; // tidak dikumpulkan satu pun
      case 'submitted': return 'bg-green-50 text-green-700 border-green-200'; // sudah dikumpulkan
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status : any) => {
    switch (status) {
      case 'assigned': return 'Assigned';
      case 'not_submitted': return 'Not Submitted';
      case 'submitted': return 'Submitted';
      default: return 'Unknown';
    }
  };

  const getRoleDisplayName = (role : string) => {
    switch (role) {
      case 'DOSEN': return 'Lecturer';
      case 'ASSISTANT': return 'Assistant';
      case 'STUDENT': return 'Student';
      default: return role;
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'STUDENT': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DOSEN': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'ASSISTANT': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleAssignmentClick = (assignmentId : any) => {
    router.push(`/class/${id}/assignment/${assignmentId}`);
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Class</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <button 
                onClick={fetchClassData}
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

  if (!classData) {
    return null;
  }

  const instructor = classData.members.find((member: ClassMember) => member.roleInClass === 'DOSEN');
  const assistants = classData.members.filter((member: ClassMember) => member.roleInClass === 'ASSISTANT');
  const students = classData.members.filter((member: ClassMember) => member.roleInClass === 'STUDENT');

  const assistantsList = assistants.map((assistant: ClassMember) => assistant.user.name).join(', ');

  const visibleAssignments = userRole === 'STUDENT' 
  ? classData.assignments.filter((assignment: Assignment) => assignment.isPublished)
  : classData.assignments; 

  
  return (
    <div className="min-h-screen bg-white">
      
      {/* Header Section */}
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
              
             
              {/* Class Info */}
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-semibold text-gray-900">{classData.name}</h1>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getRoleColor(userRole || '')}`}>
                    {getRoleDisplayName(userRole || '')}
                  </span>
                  {!classData.isActive && (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-300">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-1">{classData.code} • {assistantsList}</p>
                <p className="text-sm text-gray-500">
                {classData.semester} {classData.year} • {students.length} students
                </p>
              </div>
            </div>

            {/* Actions tambahan*/}
            <div className="flex space-x-3">
              {userRole === 'DOSEN' && (
                <button 
                onClick={() => router.push(`/class/${id}/review`)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium"
              >
                Review Class
              </button>
              )}
              {userRole === 'ASSISTANT' && (
                <>
                <button 
                onClick={() => router.push(`/class/${id}/create-assignment`)}
                className="bg-[#3ECF8E] text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm font-medium"
              >
                Create Assignment
              </button>
                <button 
                  onClick={() => router.push(`/class/${id}/review`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium"
                >
                  Review Class
                </button>
              </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assignments'
                  ? 'border-[#3ECF8E] text-[#3ECF8E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Assignments ({visibleAssignments.length})
            </button>
            {/* <button
              onClick={() => setActiveTab('announcements')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'announcements'
                  ? 'border-[#3ECF8E] text-[#3ECF8E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Announcements ({classData.announcements.length})
            </button> */}
            <button
              onClick={() => setActiveTab('members')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'members'
                  ? 'border-[#3ECF8E] text-[#3ECF8E]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Members ({classData.members.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Assignments List */}
          <div className="lg:col-span-3">
            {/* ✅ Assignments Tab */}
            {activeTab === 'assignments' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Assignments</h2>
                  {userRole === 'DOSEN' && (
                    <button 
                      onClick={() => router.push(`/class/${id}/create-assignment`)}
                      className="bg-[#3ECF8E] text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm font-medium"
                    >
                      + New Assignment
                    </button>
                  )}
                </div>

                {visibleAssignments.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No assignments yet</h3>
                    <p className="text-gray-600">
                      {userRole === 'DOSEN' 
                        ? 'Create your first assignment to get started.' 
                        : 'No assignments have been posted yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {visibleAssignments.map((assignment: any) => {
                      const status = getAssignmentStatus(assignment);
                      return (
                        <div 
                          key={assignment.id}
                          onClick={() => handleAssignmentClick(assignment.id)}
                          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#3ECF8E] transition-colors">
                                  {assignment.title}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${status.color}`}>
                                  {status.text}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-3 line-clamp-2">{assignment.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{getTimeLeft(assignment.dueDate)}</span>
                                <span>•</span>
                                <span>Max Score: {assignment.maxTotalScore}</span>
                              </div>
                            </div>
                            <div className="text-right ml-6 flex-shrink-0">
                              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#3ECF8E] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ✅ Announcements Tab */}
            {activeTab === 'announcements' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Announcements</h2>
                  {(userRole === 'DOSEN' || userRole === 'ASSISTANT') && (
                    <button 
                      onClick={() => router.push(`/class/${id}/create-announcement`)}
                      className="bg-[#3ECF8E] text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm font-medium"
                    >
                      + New Announcement
                    </button>
                  )}
                </div>

                {classData.announcements.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div className="text-4xl mb-4">📢</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements</h3>
                    <p className="text-gray-600">No announcements have been posted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {classData.announcements.map((announcement : any) => (
                      <div key={announcement.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 whitespace-pre-wrap">{announcement.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>By {announcement.author.name}</span>
                          <span className="mx-2">•</span>
                          <span>{getRoleDisplayName(announcement.author.role)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ✅ Members Tab */}
            {activeTab === 'members' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Class Members</h2>
                
                <div className="space-y-6">
                  {/* Instructor */}
                  {instructor && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Instructor</h3>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {instructor.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{instructor.user.name}</div>
                            <div className="text-sm text-gray-500">{instructor.user.email}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Assistants */}
                  {assistants.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                        Assistants ({assistants.length})
                      </h3>
                      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
                        {assistants.map((assistant :any) => (
                          <div key={assistant.userId} className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  {assistant.user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{assistant.user.name}</div>
                                <div className="text-sm text-gray-500">{assistant.user.email}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Students */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                      Students ({students.length})
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
                      {students.map((student : any) => (
                        <div key={student.userId} className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {student.user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{student.user.name}</div>
                              <div className="text-sm text-gray-500">{student.user.email}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Class Stats */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Overview</h3>
                <div className="space-y-1">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Total assignments</span>
                    <span className="font-semibold text-gray-900">{classData.assignments.length}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Students enrolled</span>
                    <span className="font-semibold text-gray-900">{students.length}</span>
                  </div>
                </div>
              </div>

        
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}