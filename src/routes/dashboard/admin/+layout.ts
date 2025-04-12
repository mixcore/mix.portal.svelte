import { roleGuard } from '$lib/guards/authGuard';

export const load = async () => {
  // Protect all admin routes with Admin role requirement
  return await roleGuard(['Admin', 'SuperAdmin']);
};

// Enable client-side load
export const ssr = false; 