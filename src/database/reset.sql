SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'teso_project_first'
  AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS teso_project_first;

CREATE DATABASE teso_project_first;
