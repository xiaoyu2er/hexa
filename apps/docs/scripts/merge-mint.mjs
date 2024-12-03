import fs from 'fs/promises';
import path from 'path';

const MERGE_PROPERTIES = ['tabs', 'anchors', 'navigation'];
const LANG_FILES = ['mint.en.json', 'mint.zh-CN.json'];

async function readJsonFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

async function mergeConfigs() {
  const baseConfig = await readJsonFile('./config/mint.base.json');
  if (!baseConfig) {
    throw new Error('mint.base.json (base config) is required');
  }


  // Initialize merged properties
  const mergedConfig = { ...baseConfig };
  MERGE_PROPERTIES.forEach(prop => {
    mergedConfig[prop] = [];
  });

  // Merge each language file
  for (const langFile of LANG_FILES) {
    const langConfig = await readJsonFile(`./config/${langFile}`);
    if (!langConfig) continue;

    MERGE_PROPERTIES.forEach(prop => {
      if (Array.isArray(langConfig[prop])) {
        mergedConfig[prop].push(...langConfig[prop]);
      }
    });
  }

  // Write the merged config
  await fs.writeFile(
    'mint.json',
    JSON.stringify(mergedConfig, null, 2) + '\n',
    'utf8'
  );

  console.log('✓ Successfully merged mint configurations');
}

// Run the merge
mergeConfigs().catch(error => {
  console.error('Error merging configurations:', error);
  process.exit(1);
});
