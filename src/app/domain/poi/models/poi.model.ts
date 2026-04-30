export interface Poi {
  id: string;
  name: string;
  category: string;
  coordinates: [number, number];
  properties?: Record<string, unknown>;
}
