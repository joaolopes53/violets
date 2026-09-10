import { assetUrl } from './assetUrl.js'

const responsiveWidths = [320, 640, 960]

function getVariantPath(publicPath, width) {
  const normalizedPath = publicPath.replace(/^\/+/, '')
  const pathParts = normalizedPath.split('/')
  const fileName = pathParts.pop()
  const baseName = fileName.replace(/\.[^.]+$/, '')
  const directory = pathParts.slice(1).join('/')

  return `/vinil/generated/${directory}/${baseName}-${width}.webp`
}

export function vinilImageSources(publicPath, basePath) {
  return {
    src: assetUrl(publicPath, basePath),
    srcSet: responsiveWidths
      .map(width => `${assetUrl(getVariantPath(publicPath, width), basePath)} ${width}w`)
      .join(', ')
  }
}
