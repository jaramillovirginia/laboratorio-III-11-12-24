-- CREATE DATABASE IF NOT EXISTS market -- 
SELECT 'CREATE DATABASE market'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'market')\gexec