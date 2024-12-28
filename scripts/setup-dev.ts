import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prompts from 'prompts';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function getDomainConfig() {
  const response = await prompts([
    {
      type: 'text',
      name: 'productionDomain',
      message: 'What is your production domain? (e.g. example.com)',
      validate: (value) => {
        const valid =
          /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(
            value
          );
        return valid ? true : 'Please enter a valid domain';
      },
    },
    {
      type: 'text',
      name: 'stagingDomain',
      message: 'What is your staging domain? (e.g. xyz.example.com)',
      validate: (value) => {
        const valid =
          /^[a-zA-Z0-9][a-zA-Z0-9.-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(
            value
          );
        return valid ? true : 'Please enter a valid domain';
      },
    },
  ]);

  const domain: string = response.productionDomain;
  const stagingDomain: string = response.stagingDomain;

  return {
    production: domain,
    staging: stagingDomain,
    development: {
      link: 'localhost:7001',
      app: 'localhost:7002',
      admin: 'localhost:7004',
    },
  };
}

type DomainConfig = Awaited<ReturnType<typeof getDomainConfig>>;

async function setupWranglerConfig(domainConfig: DomainConfig) {
  console.log('\nSetting up Wrangler configuration...');

  const templatePath = path.resolve(
    rootDir,
    'apps/app',
    'wrangler.toml.example'
  );
  for (const [appName, appConfig] of Object.entries({
    app: {
      name: 'hexa-app',
      subdomain: 'app',
    },
    admin: {
      name: 'hexa-admin',
      subdomain: 'admin',
    },
    link: {
      name: 'hexa-link',
      subdomain: null,
    },
  })) {
    const appDir = path.resolve(rootDir, 'apps', appName);
    const targetPath = path.resolve(appDir, 'wrangler.toml');
    let content = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders
    content = content
      .replaceAll('{{name}}', appConfig.name)
      .replaceAll(
        '{{domain}}',
        appConfig.subdomain
          ? `${appConfig.subdomain}.${domainConfig.production}`
          : domainConfig.production
      )
      .replaceAll(
        '{{staging_domain}}',
        appConfig.subdomain
          ? `${appConfig.subdomain}.${domainConfig.staging}`
          : domainConfig.staging
      );

    fs.writeFileSync(targetPath, content);
    console.log(`✓ Created wrangler.toml for ${appName}`);
  }
}

async function setupEnvironmentFiles() {
  console.log('\nSetting up environment files...');

  const sourceAppDir = path.resolve(rootDir, 'apps/app');

  // Copy example files to actual files
  for (const file of ['.env.example', '.dev.vars.example']) {
    const source = path.resolve(sourceAppDir, file);
    const target = path.resolve(sourceAppDir, file.replace('.example', ''));

    if (!fs.existsSync(source)) {
      console.warn(`Warning: ${file} not found`);
      continue;
    }

    if (!fs.existsSync(target)) {
      fs.copyFileSync(source, target);
      console.log(`✓ Created ${file.replace('.example', '')}`);
    }
  }

  // Create symlinks for other apps
  for (const app of ['www', 'admin', 'link']) {
    const appDir = path.resolve(rootDir, 'apps', app);

    // Determine which files to symlink based on the app
    const filesToLink =
      app === 'www'
        ? ['.env'] // www only needs .env
        : ['.env', '.dev.vars']; // admin and link need both

    for (const file of filesToLink) {
      const sourcePath = path.resolve(sourceAppDir, file);
      const targetPath = path.resolve(appDir, file);
      const relativePath = path.relative(path.dirname(targetPath), sourcePath);

      try {
        if (fs.existsSync(targetPath)) {
          fs.unlinkSync(targetPath);
        }
        fs.symlinkSync(relativePath, targetPath, 'file');
        console.log(`✓ Created symlink for ${app}/${file}`);
      } catch (error) {
        console.error(`Error creating symlink for ${app}/${file}:`, error);
      }
    }
  }
}

async function setupWranglerFolder() {
  console.log('\nSetting up Wrangler folder structure...');

  const appWranglerDir = path.resolve(rootDir, 'apps/app/.wrangler');
  const d1Dir = path.resolve(
    appWranglerDir,
    'state/v3/d1/miniflare-D1DatabaseObject'
  );

  // Create directory structure for app
  fs.mkdirSync(d1Dir, { recursive: true });

  // Create symlinks for admin and link
  for (const app of ['admin', 'link']) {
    const targetWranglerDir = path.resolve(rootDir, `apps/${app}/.wrangler`);
    const relativePath = path.relative(
      path.dirname(targetWranglerDir),
      appWranglerDir
    );

    try {
      if (fs.existsSync(targetWranglerDir)) {
        fs.rmSync(targetWranglerDir, { recursive: true, force: true });
      }
      fs.symlinkSync(relativePath, targetWranglerDir, 'junction');
      console.log(`✓ Created .wrangler symlink for ${app}`);
    } catch (error) {
      console.error(`Error creating .wrangler symlink for ${app}:`, error);
    }
  }
}

async function setupLocalDatabase() {
  console.log('\nSetting up local database...');

  const appDir = path.resolve(rootDir, 'apps/app');
  process.chdir(appDir);

  try {
    console.log('Generating database schema...');
    execSync('pnpm run db:generate', { stdio: 'inherit' });

    console.log('Running local database migrations...');
    execSync('pnpm run db:migrate:local', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

async function main() {
  try {
    console.log('Starting development environment setup...\n');

    const domainConfig = await getDomainConfig();
    await setupWranglerConfig(domainConfig);
    await setupEnvironmentFiles();
    await setupWranglerFolder();
    await setupLocalDatabase();

    console.log('\n✨ Development environment setup complete!');
    console.log('\nNext steps:');
    console.log('1. Review and update environment variables in apps/app/.env');
    console.log('2. Review and update apps/app/.dev.vars');
    console.log('3. Start development server with: pnpm dev');
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

main();
