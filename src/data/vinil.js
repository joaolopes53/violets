import { vinilData } from './vinilData'

export const thicknesses = [
  { id: 'all', labelKey: 'vinil.allThicknesses', thickness: null },
  { id: '5-5mm', label: 'TREVO 5.5mm', thickness: '5.5mm' },
  { id: '6-5mm', label: 'TREVO 6.5mm', thickness: '6.5mm' },
  { id: '8mm', label: 'TREVO 8mm', thickness: '8mm' },
  { id: '9mm', label: 'TREVO 9mm', thickness: '9mm' },
  { id: '12mm', label: 'TREVO 12mm', thickness: '12mm' },
]

export const deckItems = [
  {
    id: 'deck-composite-natural',
    titleKey: 'vinil.deckItemTitle',
    descKey: 'vinil.deckItemDesc',
    featuresKey: 'vinil.deckFeatures',
  }
]

export const { completedWorks, catalogProducts, woodProducts } = vinilData
