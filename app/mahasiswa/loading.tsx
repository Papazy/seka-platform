import LoadingSpinner from "@/components/LoadingSpinner";

export default function loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner height="12" width="12" />
    </div>
  )
}