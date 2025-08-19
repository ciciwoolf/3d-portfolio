import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Vite's manifest
const manifestPath = path.join(__dirname, '../dist/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

// Collect asset URLs (adjust filter for your needs)
const urls = Object.values(manifest)
  .map(entry => entry.file)
  .filter(name => /\.(glb|png|jpg|jpeg|svg)$/.test(name));

// Read the built service worker
const swPath = path.join(__dirname, '../dist/service-worker.js');
let swContent = fs.readFileSync(swPath, 'utf-8');

// Replace placeholder with asset URLs
swContent = swContent.replace('%HASHURLS%', JSON.stringify(urls));

// Write back the updated service worker
fs.writeFileSync(swPath, swContent, 'utf-8');
console.log('Service worker updated with hashed asset URLs.');