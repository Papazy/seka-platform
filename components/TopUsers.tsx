'use client';

interface LeaderboardEntry {
  rank: number;
  name: string;
  time: string;
  memory: string;
  submittedAt: string;
  language: string;
  score: number;
}

interface TopUsersProps {
  leaderboardData: {
    time: LeaderboardEntry[];
    memory: LeaderboardEntry[];
    first: LeaderboardEntry[];
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TopUsers({ leaderboardData, activeTab, onTabChange }: TopUsersProps) {
  const getRankIcon = (rank: number) => <span className="text-gray-500 font-medium text-sm">#{rank}</span>;

  return (
    <div className="bg-white border border-gray-200 rounded-lg sticky top-6">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Users</h3>
        <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
        <button
            onClick={() => onTabChange('first')}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'first'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            First
          </button>
        
        {/* Leaderboard Tabs */}
          <button
            onClick={() => onTabChange('time')}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'time'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Time
          </button>
          <button
            onClick={() => onTabChange('memory')}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'memory'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Memory
          </button>
         
        </div>

        {/* Top Users List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {leaderboardData[activeTab as keyof typeof leaderboardData].map((entry) => (
            <div key={entry.rank} className={`flex items-center space-x-3 p-3 rounded-lg ${
              entry.name === 'You' ? 'bg-[#3ECF8E]/10 border border-[#3ECF8E]/20' : 'bg-gray-50'
            }`}>
              <div className="flex-shrink-0 w-8 flex justify-center">
                {getRankIcon(entry.rank)}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${
                  entry.name === 'You' ? 'text-[#3ECF8E]' : 'text-gray-900'
                }`}>
                  {entry.name}
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{entry.time}</span>
                  <span>•</span>
                  <span>{entry.memory}</span>
                  <span>•</span>
                  <span>{entry.language}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {entry.score}
                </div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Showing all submissions • {leaderboardData[activeTab as keyof typeof leaderboardData].length} users
          </div>
        </div>
      </div>
    </div>
  );
}