
export function getCurrentUser(req: Request){
  const headers = req.headers;
  const userId = headers.get('x-user-id');
  const userRole = headers.get('x-user-role');
  if (!userId || !userRole) {
    throw new Error('Unauthorized')
  }
  return {
    id: parseInt(userId),
    role: userRole
  }
} 