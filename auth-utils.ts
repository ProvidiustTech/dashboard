/**
 * utility to clear session and log user out
 */
export const handleLogout = () => {
  // Clear cookies by setting expiry to past
  document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
  document.cookie = "company_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
  
  // Redirect to login
  window.location.href = "/login";
};