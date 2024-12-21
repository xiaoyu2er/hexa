import { parse } from 'yaml'
import { readFileSync } from 'fs'
import fetch from 'node-fetch'

async function getLatestVersion(packageName: string): Promise<string | null> {
  try {
    // Handle scoped packages and special cases
    const registryName = packageName.startsWith('@') 
      ? packageName.replace('/', '%2F')
      : packageName

    const response = await fetch(`https://registry.npmjs.org/${registryName}`)
    const data = await response.json()
    
    return data['dist-tags']?.latest || null
  } catch (error) {
    console.error(`Error fetching version for ${packageName}:`, error)
    return null
  }
}

async function checkUpdates() {
  // Read the workspace file
  const content = readFileSync('./pnpm-workspace.yaml', 'utf8')
  const workspace = parse(content)
  
  const updates: Array<{name: string, current: string, latest: string}> = []

  // Check each package in catalog
  for (const [name, version] of Object.entries(workspace.catalog)) {
    // Skip URLs or non-semver versions
    if (version.toString().startsWith('http')) continue

    const latest = await getLatestVersion(name)
    if (latest && latest !== version) {
      updates.push({
        name,
        current: version.toString(),
        latest
      })
    }
  }

  // Print results
  if (updates.length === 0) {
    console.log('All packages are up to date!')
    return
  }

  console.log('The following packages have updates available:\n')
  updates.forEach(({name, current, latest}) => {
    console.log(`${name}: ${current} → ${latest}`)
  })
}

checkUpdates().catch(console.error) 