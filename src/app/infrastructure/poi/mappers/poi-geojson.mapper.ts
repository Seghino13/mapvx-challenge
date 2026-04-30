import { GeoJsonType, GeometryType } from '../../../domain/poi/models/geojson.model';
import { Poi } from '../../../domain/poi/models/poi.model';

export class PoiGeoJsonMapper {
  static toDomain(feature: any): Poi {
    return {
      id: feature.id ?? crypto.randomUUID(),
      name: feature.properties.name,
      category: feature.properties.category,
      coordinates: feature.geometry.coordinates,
      properties: feature.properties,
    };
  }

  static toGeoJson(poi: Poi): any {
    return {
      type: GeoJsonType.FEATURE,
      id: poi.id,
      geometry: {
        type: GeometryType.POINT,
        coordinates: poi.coordinates,
      },
      properties: {
        name: poi.name,
        category: poi.category,
        ...poi.properties,
      },
    };
  }
}
