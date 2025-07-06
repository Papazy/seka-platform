export default function LoadingSpinner() {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-white -z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3ECF8E] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}