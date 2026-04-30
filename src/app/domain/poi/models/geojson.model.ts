export enum GeoJsonType {
  FEATURE_COLLECTION = 'FeatureCollection',
  FEATURE = 'Feature',
}

export enum GeometryType {
  POINT = 'Point',
}

export interface GeoJsonPointGeometry {
  type: GeometryType.POINT;
  coordinates: [number, number];
}

export interface GeoJsonProperties {
  name: string;
  id: string;
  category: string;
  [key: string]: unknown;
}

export interface GeoJsonFeature {
  type: GeoJsonType.FEATURE;
  id?: string;
  geometry: GeoJsonPointGeometry | null;
  properties: GeoJsonProperties | null;
}

export interface GeoJsonFeatureCollection {
  type: GeoJsonType.FEATURE_COLLECTION;
  features: GeoJsonFeature[];
}
