import { GeoJsonFeature } from '../models/geojson.model';
import { Poi } from '../models/poi.model';

export class PoiMapper {
  static fromFeature(feature: GeoJsonFeature): Poi {
    const coords = feature.geometry!.coordinates;
    const props = feature.properties!;

    return {
      id: typeof feature.id === 'string'
        ? feature.id
        : typeof props['id'] === 'string'
          ? props['id']
          : crypto.randomUUID(),
      name: props.name,
      category: props.category,
      coordinates: [coords[0], coords[1]],
      properties: props,
    };
  }
}
