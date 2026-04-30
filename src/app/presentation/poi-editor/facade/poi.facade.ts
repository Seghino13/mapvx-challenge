import { Injectable, Signal, inject } from '@angular/core';
import { Poi } from '../../../domain/poi/models/poi.model';
import { PoiStore } from '../store/poi.store';

@Injectable({ providedIn: 'root' })
export class PoiFacade {
  private readonly store: PoiStore = inject(PoiStore);

  readonly pois: Signal<Poi[]> = this.store.pois;
  readonly selectedPoi: Signal<Poi | null> = this.store.selectedPoi;

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
}
