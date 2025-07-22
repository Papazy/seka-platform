type viewMode = 'grid' | 'list';

const ToggleViewMode = ({
  viewMode,
  setViewMode
}: {
  viewMode: viewMode,
  setViewMode: (mode: viewMode) => void;
}) => {
  return (
    <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1 shadow-sm">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded-md transition-all ${viewMode === 'grid'
          ? 'bg-[#3ECF8E] text-white shadow-sm'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        title="Grid View"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-md transition-all ${viewMode === 'list'
          ? 'bg-[#3ECF8E] text-white shadow-sm'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        title="List View"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </button>
    </div>
  )
}


export default ToggleViewMode;