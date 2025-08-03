
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClassCard from '@/components/ClassCard';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

interface ClassItem {
  id: string;
  name: string;
  code: string;
  instructor: string;
  students: number;
  type: 'learning' | 'teaching';
  status: 'active' | 'inactive';
  semester: string;
  year: number;
 
  assignments?: number;
  completedAssignments?: number;
}



export default function ClassPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [roleFilter, setRoleFilter] = useState<'all' | 'learning' | 'teaching'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { user, isAuthenticated, isLoading } = useAuth();

  const [allClasses, setAllClasses] = useState<ClassItem[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if(isAuthenticated && user) {
      fetchClasses();
    }
  }, [isAuthenticated, user])

  const fetchClasses = async () => {
    setIsLoadingData(true);
    setError(null);

    try{

      const response = await fetch('/api/users/classes', {
        credentials: 'include',
      })

      if (response.ok){
        const data = await response.json();
        console.log('Classes data:', data);

        const combinedClasses: ClassItem[] = [
          ...data.learningClasses.map((cls: any) => ({
            id: cls.id,
            name: cls.name,
            code: cls.code,
            instructor: cls.instructor,
            students: cls.students,
            type: 'learning' as const,
            status: 'active' as const, 
            semester: cls.semester,
            year: cls.year || 2024,
            assignments: cls.assignments,
            completedAssignments: cls.completedAssignments,
            color: cls.color,
            coverImage: cls.coverImage,
            recentActivity: cls.recentActivity
          })),

          ...data.teachingClasses.map((cls: any) => ({
            id: cls.id,
            name: cls.name,
            code: cls.code,
            instructor: cls.instructor,
            students: cls.students,
            type: 'teaching' as const,
            status: 'active' as const,
            semester: cls.semester,
            year: cls.year || 2024,
            assignments: cls.assignments,
            completedAssignments: cls.completedAssignments,
            color: cls.color,
            coverImage: cls.coverImage,
            recentActivity: cls.recentActivity
          }))

        ];
        setAllClasses(combinedClasses);
      }
    }catch (err: any){
      console.error('Error fetching classes:', err);
      setError(err.message || 'Failed to fetch classes');
    } finally {
      setIsLoadingData(false);
    }
  }

  

  // Filter classes based on active tab, role filter, and search query
  const filteredClasses = allClasses.filter(classItem => {
    const matchesStatus = classItem.status === activeTab;
    const matchesRole = roleFilter === 'all' || classItem.type === roleFilter;
    const matchesSearch = classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         classItem.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         classItem.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesRole && matchesSearch;
  });

  // Group classes by role for better organization
  const teachingClasses = filteredClasses.filter(c => c.type === 'teaching');
  const learningClasses = filteredClasses.filter(c => c.type === 'learning');

  const handleClassClick = (id: string) => {
    router.push(`/class/${id}`);
  };

  const getStatusStats = (status: 'active' | 'inactive') => {
    const statusClasses = allClasses.filter(c => c.status === status);
    const teaching = statusClasses.filter(c => c.type === 'teaching').length;
    const learning = statusClasses.filter(c => c.type === 'learning').length;
    return { total: statusClasses.length, teaching, learning };
  };

  const activeStats = getStatusStats('active');
  const inactiveStats = getStatusStats('inactive');

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Classes</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchClasses}
              className="bg-[#3ECF8E] text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">My Classes</h1>
              <p className="text-gray-600 mt-1">
                Manage your teaching and learning activities
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-[#3ECF8E]">
                  {activeTab === 'active' ? activeStats.total : inactiveStats.total}
                </div>
                <div className="text-sm text-gray-600">
                  {activeTab === 'active' ? 'Active Classes' : 'Past Classes'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600">
                  {activeTab === 'active' ? activeStats.teaching : inactiveStats.teaching}
                </div>
                <div className="text-sm text-gray-600">Teaching</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-purple-600">
                  {activeTab === 'active' ? activeStats.learning : inactiveStats.learning}
                </div>
                <div className="text-sm text-gray-600">Learning</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'active'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Active Classes ({activeStats.total})
              </button>
              <button
                onClick={() => setActiveTab('inactive')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'inactive'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Past Classes ({inactiveStats.total})
              </button>
            </div>

            {/* Search and Role Filter */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-[#3ECF8E] text-sm"
                />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as 'all' | 'learning' | 'teaching')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:border-[#3ECF8E] text-sm"
              >
                <option value="all">All Roles</option>
                <option value="teaching">Teaching</option>
                <option value="learning">Learning</option>
              </select>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search or filters.' : 'No classes available for the selected criteria.'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Teaching Classes */}
            {(roleFilter === 'all' || roleFilter === 'teaching') && teachingClasses.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Teaching Classes ({teachingClasses.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teachingClasses.map((classItem) => (
                    <EnhancedClassCard
                      key={classItem.id}
                      classItem={classItem}
                      onClick={handleClassClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Learning Classes */}
            {(roleFilter === 'all' || roleFilter === 'learning') && learningClasses.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Learning Classes ({learningClasses.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {learningClasses.map((classItem) => (
                    <EnhancedClassCard
                      key={classItem.id}
                      classItem={classItem}
                      onClick={handleClassClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Class Card Component
interface EnhancedClassCardProps {
  classItem: ClassItem;
  onClick: (id: string) => void;
}

function EnhancedClassCard({ classItem, onClick }: EnhancedClassCardProps) {
  const getProgressPercentage = () => {
    if (!classItem.assignments || !classItem.completedAssignments) return 0;
    return Math.round((classItem.completedAssignments / classItem.assignments) * 100);
  };

  const getStatusColor = () => {
    if (classItem.status === 'active') {
      return classItem.type === 'teaching' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200';
    }
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getRoleIcon = () => {
    if (classItem.type === 'teaching') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    }
    return (<></>
      // <<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      //   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z" />
      //   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      // </svg>>
    );
  };

  return (
    <div
      onClick={() => onClick(classItem.id)}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-[#3ECF8E] transition-colors line-clamp-2">
            {classItem.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {classItem.code} • {classItem.semester} {classItem.year}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 ${getStatusColor()}`}>
          {/* {getRoleIcon()} */}
          <span>{classItem.type === 'teaching' ? 'Teaching' : ''}</span>
        </span>
      </div>

    

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {classItem.instructor}
        </div>
        
      
      </div>

      {/* Progress Bar (for learning classes with assignments) */}
      {classItem.type === 'learning' && classItem.assignments && classItem.status === 'active' && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{classItem.completedAssignments}/{classItem.assignments} assignments</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#3ECF8E] h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {classItem.students} students
          </span>
         
        </div>
        
        {classItem.status === 'active' && (
          <div className="flex items-center text-xs text-[#3ECF8E]">
            <div className="w-2 h-2 bg-[#3ECF8E] rounded-full mr-2"></div>
            Active
          </div>
        )}
      </div>
    </div>
  );
}