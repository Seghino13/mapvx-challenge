import { AddLayerObject } from 'maplibre-gl';

export const MAP_CONFIG = {
  DEFAULT_CENTER: [-70.65, -33.44] as [number, number],
  DEFAULT_ZOOM: 11,
  STYLE_URL: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',
} as const;

export const MAP_LAYER = {
  id: 'pois-layer',
  type: 'symbol',
  source: 'pois',
  layout: {
    'icon-image': 'custom-marker',
    'icon-size': 1,
    'text-field': ['get', 'name'],
    'text-size': 13,
    'text-offset': [0, 1.5],
    'text-anchor': 'top',
  },
  paint: {
    'text-color': '#111',
    'text-halo-color': '#fff',
    'text-halo-width': 1,
  },
} as AddLayerObject;
