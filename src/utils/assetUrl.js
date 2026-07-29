const publicAssetMarkers = ['/assets/', '/src/']

function normalizeBasePath(basePath) {
  if (basePath === './') return './'

  const trimmedBasePath = basePath.replace(/^\/+|\/+$/g, '')
  return trimmedBasePath ? `/${trimmedBasePath}/` : '/'
}

export function getDeploymentBasePath(documentRoot = globalThis.document) {
  if (!documentRoot) return '/'

  const moduleScript = documentRoot.querySelector('script[type="module"][src]')
  if (!moduleScript) return '/'

  const scriptUrl = new URL(moduleScript.getAttribute('src'), documentRoot.baseURI)
  const marker = publicAssetMarkers.find(pathMarker => scriptUrl.pathname.includes(pathMarker))
  if (!marker) return '/'

  const basePath = scriptUrl.pathname.slice(0, scriptUrl.pathname.lastIndexOf(marker))
  return normalizeBasePath(basePath)
}

export function assetUrl(publicPath, basePath = getDeploymentBasePath()) {
  const normalizedPath = publicPath.replace(/^\/+/, '')
  const normalizedBasePath = normalizeBasePath(basePath)

  return normalizedBasePath === './'
    ? `./${normalizedPath}`
    : `${normalizedBasePath}${normalizedPath}`
}
