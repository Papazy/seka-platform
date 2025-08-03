import { MahasiswaRole } from "@/contexts/RolePraktikumContext"
import { useQuery } from "@tanstack/react-query"

const fetchMahasiswalRoles = async () : Promise<MahasiswaRole[]> => {
  const response = await fetch('/api/user/roles', {
    credentials: 'include',
  })

  if(!response.ok) throw new Error('Failed to fetch roles')

    const data = await response.json()
    return data.roles
}




export const useFetchMahasiswaRoles = (enabled: boolean) => {
  return useQuery({
    queryKey: ['mahasiswaRoles'],
    queryFn: async () => fetchMahasiswalRoles(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
    refetchOnWindowFocus: false,
  })
}