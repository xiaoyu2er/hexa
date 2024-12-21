import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const SOURCE_APP = 'app';
const APPS_TO_LINK = ['admin', 'www', 'link']; // Add other apps that need the link

// Get the absolute path to the apps directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appsDir = path.resolve(__dirname, '../apps');
const sourceWranglerPath = path.resolve(appsDir, SOURCE_APP, '.wrangler');

function setupWranglerLinks() {
  console.log('Setting up wrangler symbolic links...');

  // Ensure source .wrangler exists
  if (!fs.existsSync(sourceWranglerPath)) {
    console.log(`Creating source .wrangler directory in ${SOURCE_APP}...`);
    fs.mkdirSync(sourceWranglerPath, { recursive: true });
  }

  // Create symlinks for each app
  APPS_TO_LINK.forEach(app => {
    const targetPath = path.resolve(appsDir, app, '.wrangler');
    const relativePath = path.relative(path.dirname(targetPath), sourceWranglerPath);

    try {
      // Remove existing symlink or directory
      if (fs.existsSync(targetPath)) {
        const stats = fs.lstatSync(targetPath);
        if (stats.isSymbolicLink()) {
          fs.unlinkSync(targetPath);
        } else {
          fs.rmSync(targetPath, { recursive: true, force: true });
        }
      }

      // Create new symlink
      fs.symlinkSync(
        relativePath,
        targetPath,
        process.platform === 'win32' ? 'junction' : 'dir'
      );
      console.log(`✓ Created symlink for ${app}`);
    } catch (error) {
      if (error.code === 'EPERM') {
        console.error(`
Error: Permission denied. On Windows, you may need to:
1. Run as administrator, or
2. Enable Developer Mode in Windows Settings
`);
      } else {
        console.error(`Error creating symlink for ${app}:`, error.message);
      }
    }
  });
}

// Run the setup
setupWranglerLinks();
