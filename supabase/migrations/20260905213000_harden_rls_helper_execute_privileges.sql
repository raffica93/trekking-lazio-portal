-- rls_auto_enable is an administrative helper, never an exposed RPC endpoint.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
