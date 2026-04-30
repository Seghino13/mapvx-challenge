import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Poi } from '../../../domain/poi/models/poi.model';

@Injectable({ providedIn: 'root' })
export class PoiStore {
  private readonly _pois: WritableSignal<Poi[]> = signal<Poi[]>([]);
  private readonly _selectedPoi: WritableSignal<Poi | null> = signal<Poi | null>(null);

  readonly pois: Signal<Poi[]> = this._pois.asReadonly();
  readonly selectedPoi: Signal<Poi | null> = this._selectedPoi.asReadonly();

  setPois(pois: Poi[]) {
    this._pois.set(pois);
  }

  addPoi(poi: Poi) {
    this._pois.update((pois: Poi[]) => [...pois, poi]);
  }

  updatePoi(updated: Poi) {
    this._pois.update((pois: Poi[]) => pois.map((p) => (p.id === updated.id ? updated : p)));
  }

  deletePoi(id: string) {
    this._pois.update((pois: Poi[]) => pois.filter((p) => p.id !== id));
  }

  selectPoi(poi: Poi | null) {
    this._selectedPoi.set(poi);
  }
}
