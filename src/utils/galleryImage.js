import { galleryDimensions } from '../data/galleryDimensions.js'
import { assetUrl } from './assetUrl.js'

const responsiveWidths = [480, 960, 1440]

export function galleryImageSources(publicPath, basePath) {
  const pathParts = publicPath.replace(/^\/+/, '').split('/')
  const category = pathParts.at(-2)
  const basename = pathParts.at(-1).replace(/\.[^.]+$/, '')
  const dimensions = galleryDimensions[publicPath]

  if (!dimensions) {
    throw new Error(`Missing gallery dimensions for ${publicPath}`)
  }

  const variantPath = width => `/gallery/generated/${category}/${basename}-${width}.webp`

  return {
    src: assetUrl(publicPath, basePath),
    srcSet: responsiveWidths
      .map(width => `${assetUrl(variantPath(width), basePath)} ${width}w`)
      .join(', '),
    width: dimensions.width,
    height: dimensions.height,
  }
}
