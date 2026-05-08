SELECT proname, prosecdef, prosrc 
FROM pg_proc 
WHERE proname = 'get_my_role';
