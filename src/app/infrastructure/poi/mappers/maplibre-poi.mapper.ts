import { Feature, Point, Position } from "geojson";
import { Poi } from "../../../domain/poi/models/poi.model";

export class MapLibrePoiMapper {
  static fromFeature(feature?: Feature): Poi | null {
    if (!feature) return null;

    if (!feature.geometry || feature.geometry.type !== 'Point') return null;

    const geometry = feature.geometry as Point;

    const coordinates = this.toLngLatTuple(geometry.coordinates);
    if (!coordinates) return null;

    const properties = feature.properties as {
      name?: string;
      category?: string;
    } | null;

    if (!properties?.name || !properties?.category) return null;

    return {
      id: (feature.id as string) ?? crypto.randomUUID(),
      name: properties.name,
      category: properties.category,
      coordinates,
    };
  }

  private static toLngLatTuple(position: Position): [number, number] | null {
    if (
      !Array.isArray(position) ||
      position.length < 2 ||
      typeof position[0] !== 'number' ||
      typeof position[1] !== 'number'
    ) {
      return null;
    }

    return [position[0], position[1]];
  }
}
