import { authGuard } from '$lib/guards/authGuard';

export const load = async () => {
  return await authGuard();
};

// Enable client-side load
export const ssr = false; 