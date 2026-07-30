import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const projectRoot = path.resolve(import.meta.dirname, '..')
const publicRoot = path.join(projectRoot, 'public')
const galleryRoot = path.join(projectRoot, 'public', 'gallery')
const generatedRoot = path.join(galleryRoot, 'generated')
const dimensionsPath = path.join(projectRoot, 'src', 'data', 'galleryDimensions.js')
const widths = [480, 960, 1440]
const imagePattern = /\.(?:jpe?g|png|webp)$/i

async function findImages(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory() && entry.name !== 'generated') {
      files.push(...await findImages(entryPath))
    } else if (entry.isFile() && imagePattern.test(entry.name)) {
      files.push(entryPath)
    }
  }

  return files
}

async function shouldGenerate(sourcePath, outputPath) {
  try {
    const [sourceStats, outputStats] = await Promise.all([
      fs.stat(sourcePath),
      fs.stat(outputPath),
    ])

    return outputStats.mtimeMs < sourceStats.mtimeMs
  } catch (error) {
    if (error.code === 'ENOENT') return true
    throw error
  }
}

const sourceFiles = (await findImages(galleryRoot)).sort()
const dimensions = {}
let generatedCount = 0

await fs.mkdir(generatedRoot, { recursive: true })

for (const sourcePath of sourceFiles) {
  const metadata = await sharp(sourcePath).metadata()
  const sourceRelativePath = path.relative(publicRoot, sourcePath).split(path.sep).join('/')
  const publicPath = `/${sourceRelativePath}`

  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not determine dimensions for ${publicPath}`)
  }

  dimensions[publicPath] = {
    width: metadata.width,
    height: metadata.height,
  }

  const category = path.basename(path.dirname(sourcePath))
  const basename = path.basename(sourcePath, path.extname(sourcePath))
  const outputDirectory = path.join(generatedRoot, category)
  await fs.mkdir(outputDirectory, { recursive: true })

  for (const width of widths) {
    const outputPath = path.join(outputDirectory, `${basename}-${width}.webp`)

    if (!await shouldGenerate(sourcePath, outputPath)) continue

    await sharp(sourcePath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outputPath)
    generatedCount += 1
  }
}

const dimensionsModule = `export const galleryDimensions = ${JSON.stringify(dimensions, null, 2)}\n`
await fs.writeFile(dimensionsPath, dimensionsModule)

console.log(`Processed ${sourceFiles.length} gallery images; generated ${generatedCount} WebP variants.`)
