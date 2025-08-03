import { useQuery } from "@tanstack/react-query";

const fetchTopScores = async (soalId: string) => {
  const response = await fetch(`/api/soal/${soalId}/top-scores`)

  if (!response.ok) {
    throw new Error('Failed to fetch top scores');
  }

  const data = await response.json()
  return data
}


export const useTopScoreSoal = (soalId: string) => {
  return useQuery({
    queryKey: ['topScores', soalId],
    queryFn: () => fetchTopScores(soalId),
    enabled: !!soalId, // Only run if soalId is defined
    refetchOnWindowFocus: false,
  });
};