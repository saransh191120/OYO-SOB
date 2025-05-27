import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = {
  ...process.env,
  NODE_ENV: 'development',
  PORT: '3000',
  DATABASE_URL: 'postgresql://neondb_owner:npg_WoYsuZ5PL7gA@ep-autumn-tree-a5fzm5kg-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
};

const child = spawn('npm', ['run', 'dev'], {
  env,
  stdio: 'inherit',
  shell: true,
  cwd: resolve(__dirname)
});

child.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 