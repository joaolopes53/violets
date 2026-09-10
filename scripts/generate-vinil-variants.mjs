import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const projectRoot = path.resolve(import.meta.dirname, '..')
const sourceRoot = path.join(projectRoot, 'public/vinil')
const responsiveWidths = [320, 640, 960]

async function collectWebpFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory() && entry.name !== 'generated') {
      files.push(...await collectWebpFiles(entryPath))
    } else if (entry.isFile() && entry.name.endsWith('.webp')) {
      files.push(entryPath)
    }
  }

  return files
}

const sourceFiles = await collectWebpFiles(sourceRoot)
let generatedCount = 0

for (const sourceFile of sourceFiles) {
  const relativePath = path.relative(sourceRoot, sourceFile)
  const parsedPath = path.parse(relativePath)
  const outputDirectory = path.join(sourceRoot, 'generated', parsedPath.dir)
  const sourceStats = await fs.stat(sourceFile)
  const metadata = await sharp(sourceFile).metadata()

  await fs.mkdir(outputDirectory, { recursive: true })

  for (const width of responsiveWidths) {
    const outputPath = path.join(outputDirectory, `${parsedPath.name}-${width}.webp`)
    const targetWidth = Math.min(width, metadata.width ?? width)

    try {
      const outputStats = await fs.stat(outputPath)
      if (outputStats.mtimeMs >= sourceStats.mtimeMs) continue
    } catch {
      // Generate missing variants.
    }

    await sharp(sourceFile)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(outputPath)
    generatedCount += 1
  }
}

console.log(`Generated ${generatedCount} Vinil image variants.`)
