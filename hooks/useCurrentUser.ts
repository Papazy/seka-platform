import { useQuery } from "@tanstack/react-query";
import {fetchCurrentUser} from '@/data/services/user'


export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, 
    retry: 1, 
  })
}