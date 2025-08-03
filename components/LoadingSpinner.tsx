export default function LoadingSpinner({height = 'h-16', width = 'w-16'}: {height?: string, width?: string}) {
  return (
    <div className={`flex items-center justify-center -z-50 ${height} ${width}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full ${height} ${width} border-b-2 border-[#3ECF8E] mx-auto`}></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}