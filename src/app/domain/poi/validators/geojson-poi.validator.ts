import {
  GeoJsonFeature,
  GeoJsonFeatureCollection,
  GeoJsonType,
  GeometryType,
} from '../models/geojson.model';
import { ImportSummary } from '../models/import-summary.model';

export interface ValidationResult<T> {
  valid: T[];
  summary: ImportSummary;
}

export enum ValidationError {
  INVALID_FEATURE_COLLECTION = 'invalid_feature_collection',
  INVALID_FEATURE = 'invalid_feature',
  MISSING_GEOMETRY = 'missing_geometry',
  INVALID_GEOMETRY = 'invalid_geometry',
  INVALID_COORDINATES = 'invalid_coordinates',
  MISSING_PROPERTIES = 'missing_properties',
  INVALID_PROPERTIES = 'invalid_properties',
}

export class GeoJsonPoiValidator {
  validate(featureCollection: unknown): ValidationResult<GeoJsonFeature> {
    const valid: GeoJsonFeature[] = [];

    const summary: ImportSummary = {
      imported: 0,
      discarded: 0,
      reasons: {},
    };

    if (!this.isFeatureCollection(featureCollection)) {
      return {
        valid: [],
        summary: {
          imported: 0,
          discarded: 0,
          reasons: { [ValidationError.INVALID_FEATURE_COLLECTION]: 1 },
        },
      };
    }

    for (const feature of featureCollection.features) {
      const reason = this.validateFeature(feature);

      if (reason) {
        summary.discarded++;
        summary.reasons[reason] = (summary.reasons[reason] || 0) + 1;
        continue;
      }

      valid.push(feature);
      summary.imported++;
    }

    return { valid, summary };
  }

  private validateFeature(feature: GeoJsonFeature): ValidationError | null {
    if (!feature || feature.type !== GeoJsonType.FEATURE) {
      return ValidationError.INVALID_FEATURE;
    }

    if (!feature.geometry) {
      return ValidationError.MISSING_GEOMETRY;
    }

    if (feature.geometry.type !== GeometryType.POINT) {
      return ValidationError.INVALID_GEOMETRY;
    }

    const coords = feature.geometry.coordinates;

    if (!coords || coords.length !== 2) {
      return ValidationError.INVALID_COORDINATES;
    }

    const [lon, lat] = coords;

    if (
      typeof lon !== 'number' ||
      typeof lat !== 'number' ||
      lon < -180 ||
      lon > 180 ||
      lat < -90 ||
      lat > 90
    ) {
      return ValidationError.INVALID_COORDINATES;
    }

    if (!feature.properties) {
      return ValidationError.MISSING_PROPERTIES;
    }

    const { name, category } = feature.properties;

    if (typeof name !== 'string' || typeof category !== 'string') {
      return ValidationError.INVALID_PROPERTIES;
    }

    return null;
  }

  private isFeatureCollection(value: unknown): value is GeoJsonFeatureCollection {
    return (
      typeof value === 'object' &&
      value !== null &&
      (value as GeoJsonFeatureCollection).type === GeoJsonType.FEATURE_COLLECTION &&
      Array.isArray((value as GeoJsonFeatureCollection).features)
    );
  }
}
