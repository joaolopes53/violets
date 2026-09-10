import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import crypto from 'node:crypto'
import sharp from 'sharp'

const projectRoot = path.resolve(import.meta.dirname, '..')
const defaultSourceRoot = path.join(os.homedir(), 'Downloads', 'TREVO VINIL')
const sourceRoot = process.env.VINIL_SOURCE_DIR || defaultSourceRoot
const publicVinil = path.join(projectRoot, 'public', 'vinil')

function sanitizeName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const NAME_OVERRIDES = {
  'natuaral-oak': 'Natural Oak',
  'american-wallnut': 'American Walnut',
  'heringbone-traditional': 'Herringbone Traditional',
  'vilage': 'Village',
}

function cleanDisplayName(rawName) {
  let cleaned = rawName
    .replace(/\b(5\.5mm|6\.5mm|6\.5|8mm|8\.00|9mm|12mm)\b/gi, '')
    .trim()
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')

  const slug = sanitizeName(cleaned)
  if (NAME_OVERRIDES[slug]) {
    return NAME_OVERRIDES[slug]
  }

  return cleaned
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

async function fileHash(filePath) {
  const buf = await fs.readFile(filePath)
  return crypto.createHash('md5').update(buf).digest('hex')
}

async function main() {
  console.log(`--- Ingesting & Sanitizing Vinil Assets from ${sourceRoot} ---`)
  await fs.mkdir(path.join(publicVinil, 'catalogo'), { recursive: true })
  await fs.mkdir(path.join(publicVinil, 'fichas-tecnicas'), { recursive: true })
  await fs.mkdir(path.join(publicVinil, 'trabalhos'), { recursive: true })
  await fs.mkdir(path.join(publicVinil, 'madeiras'), { recursive: true })

  // 1. Process Completed Works
  const completedWorksDir = path.join(sourceRoot, 'descriçao e trabalhos concluidos')
  const completedEntries = await fs.readdir(completedWorksDir)
  const seenHashes = new Set()
  let workIndex = 1
  const processedWorks = []

  completedEntries.sort()

  for (const file of completedEntries) {
    if (!/\.(?:png|jpe?g)$/i.test(file)) continue
    const sourcePath = path.join(completedWorksDir, file)
    const hash = await fileHash(sourcePath)
    if (seenHashes.has(hash)) {
      continue
    }
    seenHashes.add(hash)

    const destFileName = `trabalho-${String(workIndex).padStart(2, '0')}.webp`
    const destPath = path.join(publicVinil, 'trabalhos', destFileName)

    await sharp(sourcePath, { failOn: 'none' })
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(destPath)

    processedWorks.push({
      id: `obra-${workIndex}`,
      image: `/vinil/trabalhos/${destFileName}`,
      titlePt: `Projeto Concluído ${workIndex}`,
      titleEn: `Completed Project ${workIndex}`,
    })
    workIndex++
  }
  console.log(`Processed ${processedWorks.length} unique completed work photos.`)

  // 2. Process Catalog Thicknesses: 5.5mm, 6.5mm, 8mm, 9mm, 12mm
  const thicknessFolders = [
    { folder: 'TREVO 5.5', thickness: '5.5mm', slug: '5-5mm' },
    { folder: 'TREVO 6.5', thickness: '6.5mm', slug: '6-5mm' },
    { folder: 'TREVO 8.00', thickness: '8mm', slug: '8mm' },
    { folder: 'TREVO 9mm', thickness: '9mm', slug: '9mm' },
    { folder: 'trevo 12mm', thickness: '12mm', slug: '12mm' },
  ]

  const catalogProducts = []

  for (const { folder, thickness, slug } of thicknessFolders) {
    const thicknessDir = path.join(sourceRoot, folder)
    const destCatDir = path.join(publicVinil, 'catalogo', slug)
    const destPdfDir = path.join(publicVinil, 'fichas-tecnicas', slug)
    await fs.mkdir(destCatDir, { recursive: true })
    await fs.mkdir(destPdfDir, { recursive: true })

    const subEntries = await fs.readdir(thicknessDir, { withFileTypes: true })
    for (const sub of subEntries) {
      if (!sub.isDirectory()) continue
      const finishFolder = path.join(thicknessDir, sub.name)
      const finishFiles = await fs.readdir(finishFolder)

      let imageFile = null
      let pdfFile = null

      for (const f of finishFiles) {
        if (/\.pdf$/i.test(f)) {
          pdfFile = f
        } else if (/\.(?:png|jpe?g)$/i.test(f)) {
          imageFile = f
        }
      }

      let cleanFinishSlug = sanitizeName(sub.name).replace(new RegExp(`-${slug}$`, 'i'), '')
      if (cleanFinishSlug.endsWith('.5')) cleanFinishSlug = cleanFinishSlug.slice(0, -2)
      if (cleanFinishSlug.endsWith('.00')) cleanFinishSlug = cleanFinishSlug.slice(0, -3)

      let publicImagePath = null
      let publicPdfPath = null

      if (imageFile) {
        const srcImgPath = path.join(finishFolder, imageFile)
        const destImgName = `${cleanFinishSlug}.webp`
        const destImgPath = path.join(destCatDir, destImgName)

        await sharp(srcImgPath, { failOn: 'none' })
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(destImgPath)

        publicImagePath = `/vinil/catalogo/${slug}/${destImgName}`
      } else if (cleanFinishSlug === 'traditional-oak' && slug === '12mm') {
        const fallbackImg = path.join(publicVinil, 'catalogo', '9mm', 'traditional-oak.webp')
        const destImgPath = path.join(destCatDir, 'traditional-oak.webp')
        await fs.copyFile(fallbackImg, destImgPath)
        publicImagePath = `/vinil/catalogo/12mm/traditional-oak.webp`
      }

      if (pdfFile) {
        const srcPdfPath = path.join(finishFolder, pdfFile)
        const destPdfName = `ft-${cleanFinishSlug}.pdf`
        const destPdfPath = path.join(destPdfDir, destPdfName)
        await fs.copyFile(srcPdfPath, destPdfPath)
        publicPdfPath = `/vinil/fichas-tecnicas/${slug}/${destPdfName}`
      }

      const displayName = cleanDisplayName(sub.name)

      catalogProducts.push({
        id: `vinil-${slug}-${cleanFinishSlug}`,
        name: displayName,
        thickness,
        thicknessSlug: slug,
        image: publicImagePath,
        pdfUrl: publicPdfPath,
      })
    }
  }
  console.log(`Processed ${catalogProducts.length} catalog items across 5 thicknesses.`)

  // 3. Process Woods (trevo madeiras)
  const woodsDir = path.join(sourceRoot, 'trevo madeiras')
  const woodEntries = await fs.readdir(woodsDir)
  const woodProducts = []

  for (const f of woodEntries.sort()) {
    if (!/\.(?:png|jpe?g)$/i.test(f)) continue
    const cleanWoodSlug = sanitizeName(f.replace(/\.(?:png|jpe?g)$/i, ''))
      .replace(/-2048x[0-9]+/g, '')
      .replace(/-min$/g, '')

    const srcWoodPath = path.join(woodsDir, f)
    const destWoodName = `${cleanWoodSlug}.webp`
    const destWoodPath = path.join(publicVinil, 'madeiras', destWoodName)

    await sharp(srcWoodPath, { failOn: 'none' })
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(destWoodPath)

    const parts = cleanWoodSlug.split('-').filter(p => !p.match(/^trw/i))
    const title = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')

    woodProducts.push({
      id: `madeira-${cleanWoodSlug}`,
      name: title || cleanWoodSlug,
      slug: cleanWoodSlug,
      image: `/vinil/madeiras/${destWoodName}`,
    })
  }
  console.log(`Processed ${woodProducts.length} noble wood finishes.`)

  // 4. Write vinilData.js manifest
  const manifest = {
    completedWorks: processedWorks,
    catalogProducts,
    woodProducts,
  }

  const manifestPath = path.join(projectRoot, 'src', 'data', 'vinilData.js')
  const content = `// Generated by scripts/process-vinil-assets.mjs
export const vinilData = ${JSON.stringify(manifest, null, 2)};
`
  await fs.writeFile(manifestPath, content, 'utf8')
  console.log(`Generated data manifest at ${manifestPath}`)
  console.log('--- Finished Asset Ingestion ---')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
