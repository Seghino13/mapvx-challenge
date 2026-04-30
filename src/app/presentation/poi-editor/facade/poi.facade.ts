import { Injectable, Signal, inject } from '@angular/core';
import { PoiMapper } from '../../../domain/poi/mappers/poi.mapper';
import { Poi } from '../../../domain/poi/models/poi.model';
import { GeoJsonPoiValidator } from '../../../domain/poi/validators/geojson-poi.validator';
import { PoiApiService } from '../../../infrastructure/services/poi-api.service';
import { PoiStore } from '../store/poi.store';

@Injectable({ providedIn: 'root' })
export class PoiFacade {
  private readonly store: PoiStore = inject(PoiStore);
  private readonly api = inject(PoiApiService);
  private readonly validator = new GeoJsonPoiValidator();



  readonly pois: Signal<Poi[]> = this.store.pois;
  readonly selectedPoi: Signal<Poi | null> = this.store.selectedPoi;

  async loadInitialData(): Promise<void> {
    try {
      const validJson = await this.api.loadValid();
      const invalidJson = await this.api.loadInvalid();

      const validResult = this.validator.validate(validJson);
      const invalidResult = this.validator.validate(invalidJson);

      console.log('VALID SUMMARY', validResult.summary);
      console.log('INVALID SUMMARY', invalidResult.summary);

      const features = [
        ...validResult.valid,
        ...invalidResult.valid,
      ];

      // 🔥 mapper (manteniendo tu tipado actual)
      const apiPois: Poi[] = features.map((f) =>
        PoiMapper.fromFeature(f as any)
      );

      // 🔥 FIX CLAVE: merge con lo que ya existe (localStorage)
      const current = this.store.pois();

      const merged: Poi[] = [
        ...current,
        ...apiPois.filter(
          (apiPoi) => !current.some((p) => p.id === apiPoi.id)
        ),
      ];

      console.log('MERGED POIS', merged);

      this.store.setPois(merged);
    } catch (error) {
      console.error('Error loading POIs', error);
    }
  }

  setPois(pois: Poi[]) {
    this.store.setPois(pois);
  }

  addPoi(poi: Poi) {
    this.store.addPoi(poi);
  }

  updatePoi(poi: Poi) {
    this.store.updatePoi(poi);
  }

  deletePoi(id: string) {
    this.store.deletePoi(id);
  }

  selectPoi(poi: Poi | null) {
    this.store.selectPoi(poi);
  }

  updatePoiPartial(id: string, changes: Partial<Poi>) {
    this.store.updatePoiPartial(id, changes);
  }
}
