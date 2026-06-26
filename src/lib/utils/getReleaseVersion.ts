import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import path from 'path'

const packageJsonPath = path.join(process.cwd(), 'package.json')

export function getReleaseVersion(): string {
  if (process.env.RELEASE_VERSION) {
    return process.env.RELEASE_VERSION.replace(/^v/, '')
  }

  try {
    const tag = execSync('git tag -l "v*" --sort=-version:refname', { encoding: 'utf8' })
      .trim()
      .split('\n')
      .find(Boolean)

    if (tag) {
      return tag.replace(/^v/, '')
    }
  } catch {
    // fall through to package.json
  }

  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { version: string }
  return pkg.version
}
