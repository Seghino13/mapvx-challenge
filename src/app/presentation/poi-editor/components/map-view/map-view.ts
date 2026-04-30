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
import { MAP_CONFIG, MAP_LAYER } from '../../../../core/config/map.config';
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
  readonly selectedPoi = this.facade.selectedPoi;

  @ViewChild('map', { static: false })
  private mapContainer?: ElementRef<HTMLDivElement>;
  private map!: MapLibreMap;

  private readonly _poisEffect = effect(() => {
    const pois = this.pois();
    const selected = this.selectedPoi();
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
          selected: selected?.id === poi.id,
        },
      })),
    };
    source.setData(geojson);
  });

  ngAfterViewInit(): void {
    if (!this.mapContainer) return;
    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      style: MAP_CONFIG.STYLE_URL,
      center: MAP_CONFIG.DEFAULT_CENTER,
      zoom: MAP_CONFIG.DEFAULT_ZOOM,
    });

    this.map.on('load', async () => {
      try {
        const response = await this.map.loadImage('marker.png');
        const image = response.data;
        if (!this.map.hasImage('custom-marker')) {
          this.map.addImage('custom-marker', image);
        }
        this.initPoiLayer();
      } catch (error) {
        console.error('Error loading marker image', error);
      }
    });
  }

  private initPoiLayer(): void {
    if (this.map.getSource('pois')) return;
    this.map.addSource('pois', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    this.map.addLayer(MAP_LAYER);
    this.bindPoiEvents();
  }

  private bindPoiEvents(): void {
    this.map.on('click', (event) => {
      const features = this.map.queryRenderedFeatures(event.point, {
        layers: ['pois-layer'],
      });
      if (features.length) {
        const id = features[0].properties?.['id'] as string;
        const poi = this.facade.pois().find((p) => p.id === id);
        if (poi) this.facade.selectPoi(poi);
        return;
      }
      const poi: Poi = {
        id: crypto.randomUUID(),
        name: 'Nuevo punto',
        category: 'Defecto',
        coordinates: [event.lngLat.lng, event.lngLat.lat],
      };
      this.facade.addPoi(poi);
      this.facade.selectPoi(poi);
    });
  }
}
