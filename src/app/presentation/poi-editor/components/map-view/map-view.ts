import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  Signal,
  ViewChild,
} from '@angular/core';
import { FeatureCollection, Point } from 'geojson';
import maplibregl, { GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl';
import { MAP_CONFIG } from '../../../../core/config/map.config';
import { Poi } from '../../../../domain/poi/models/poi.model';
import { PoiFacade } from '../../facade/poi.facade';

@Component({
  selector: 'app-map-view',
  standalone: true,
  templateUrl: './map-view.html',
  styleUrl: './map-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapView implements AfterViewInit {
  private readonly facade = inject(PoiFacade);
  readonly pois: Signal<Poi[]> = this.facade.pois;

  @ViewChild('map', { static: false })
  private mapContainer?: ElementRef<HTMLDivElement>;
  private map!: MapLibreMap;

  //Effect reactivo
  private readonly _poisEffect = effect(() => {
    const pois = this.pois();
    if (!this.map) return;
    const source = this.map.getSource('pois') as GeoJSONSource | undefined;
    if (!source) return;
    const geojson: FeatureCollection<Point> = {
      type: 'FeatureCollection',
      features: pois.map((poi) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: poi.coordinates,
        },
        properties: {
          id: poi.id,
          name: poi.name,
          category: poi.category,
        },
      })),
    };
    source.setData(geojson);
  });

  ngAfterViewInit(): void {
    if (!this.mapContainer) {
      console.warn('Map container not ready');
      return;
    }
    this.initMap();
  }

  private initMap(): void {
    this.map = new maplibregl.Map({
      container: this.mapContainer!.nativeElement,
      style: MAP_CONFIG.STYLE_URL,
      center: MAP_CONFIG.DEFAULT_CENTER,
      zoom: MAP_CONFIG.DEFAULT_ZOOM,
    });
    this.map.on('load', () => {
      console.log('Map loaded');
      this.map.resize();
      this.initPoiLayer();
    });
  }

  private initPoiLayer(): void {
    if (this.map.getSource('pois')) return;
    this.initPoiSource();
    this.initPoiCircleLayer();
    this.bindPoiEvents();
  }
  private initPoiSource(): void {
    this.map.addSource('pois', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
  }
  private initPoiCircleLayer(): void {
    this.map.addLayer({
      id: 'pois-layer',
      type: 'circle',
      source: 'pois',
      paint: {
        'circle-radius': 6,
        'circle-color': '#2563eb',
      },
    });
  }

  private bindPoiEvents(): void {
    this.map.on('click', (event) => {
      const features = this.map.queryRenderedFeatures(event.point, {
        layers: ['pois-layer'],
      });
      if (features.length) {
        const feature = features[0];
        const id = feature.properties?.['id'] as string;
        if (!id) return;
        const poi = this.facade.pois().find((p) => p.id === id);
        if (!poi) return;
        this.facade.selectPoi(poi);
        return;
      }
      const coordinates: [number, number] = [event.lngLat.lng, event.lngLat.lat];
      const poi: Poi = {
        id: crypto.randomUUID(),
        name: 'Nuevo punto',
        category: 'Defecto',
        coordinates,
      };
      this.facade.addPoi(poi);
      this.facade.selectPoi(poi);
    });
  }
}
