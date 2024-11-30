/**
 * Add local host entries for development environment
 * Adds the following entries to hosts file:
 * - admin.hexa.local -> 127.0.0.1
 * - app.hexa.local -> 127.0.0.1
 * - www.hexa.local -> 127.0.0.1
 * 
 * Usage: 
 * - Mac/Linux: sudo pnpm setup-hosts
 * - Windows: Run as administrator: pnpm setup-hosts
 */

import { readFileSync, appendFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const COMMENTS = ['# Hexa local development'];
const HOSTS_ENTRIES = [
  '127.0.0.1 admin.hexa.local',
  '127.0.0.1 app.hexa.local',
  '127.0.0.1 www.hexa.local'
];

function getHostsPath(): string {
  return process.platform === 'win32'
    ? 'C:\\Windows\\System32\\drivers\\etc\\hosts'
    : '/etc/hosts';
}

function addHostEntries(): void {
  const hostsPath = getHostsPath();

  try {
    const currentHosts = readFileSync(hostsPath, 'utf8');
    
    // Filter out entries that already exist
    const entriesToAdd = HOSTS_ENTRIES.filter(entry => 
      !currentHosts.includes(entry)
    );

    if (entriesToAdd.length === 0) {
      console.log('✓ Host entries already exist', hostsPath);
      return;
    }

    // Add new entries with comments and newlines
    const newEntries = '\n' + COMMENTS.join('\n') + '\n' + entriesToAdd.join('\n');

    if (process.platform === 'win32') {
      // Windows - write directly with admin privileges
      appendFileSync(hostsPath, newEntries);
    } else {
      // Mac/Linux - use sudo to write
      execSync(`echo "${newEntries}" | sudo tee -a ${hostsPath}`);
    }

    console.log('✓ Successfully added host entries',hostsPath);

  } catch (error) {
    console.error('Failed to update hosts file:', error.message);
    console.error('Please run this script with admin/sudo privileges');
    process.exit(1);
  }
}

addHostEntries();
