import { build } from 'esbuild';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

async function buildServer() {
  try {
    await build({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      format: 'esm',
      outfile: 'dist/server.js',
      external: ['express', 'vite'],
      minify: true,
      sourcemap: true,
    });
    console.log('Server build completed');
  } catch (error) {
    console.error('Server build failed:', error);
    process.exit(1);
  }
}

async function buildClient() {
  try {
    // Ensure dist directory exists
    await fs.mkdir('dist', { recursive: true });
    
    // Copy client files to dist
    await fs.cp('client', 'dist/client', { recursive: true });
    
    console.log('Client files copied to dist');
  } catch (error) {
    console.error('Client build failed:', error);
    process.exit(1);
  }
}

async function build() {
  try {
    // Clean dist directory
    await fs.rm('dist', { recursive: true, force: true });
    console.log('Cleaned dist directory');

    // Run builds in parallel
    await Promise.all([
      buildServer(),
      buildClient()
    ]);

    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build(); 