import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Poi } from '../../../domain/poi/models/poi.model';

const STORAGE_KEY = 'pois';

@Injectable({ providedIn: 'root' })
export class PoiStore {
  private readonly _pois: WritableSignal<Poi[]> = signal<Poi[]>([]);
  private readonly _selectedPoi: WritableSignal<Poi | null> = signal<Poi | null>(null);

  readonly pois: Signal<Poi[]> = this._pois.asReadonly();
  readonly selectedPoi: Signal<Poi | null> = this._selectedPoi.asReadonly();

  constructor() {
    const stored = this.load();
    this._pois.set(stored);
  }

  private load(): Poi[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private save(pois: Poi[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pois));
  }

  setPois(pois: Poi[]) {
    this._pois.set(pois);
  }

  addPoi(poi: Poi) {
    this._pois.update((pois) => {
      const updated = [...pois, poi];
      this.save(updated);
      return updated;
    });
  }

  updatePoi(updated: Poi) {
    this._pois.update((pois) => {
      const result = pois.map((p) => (p.id === updated.id ? updated : p));
      this.save(result);
      return result;
    });
  }

  deletePoi(id: string) {
    this._pois.update((pois) => {
      const result = pois.filter((p) => p.id !== id);
      this.save(result);
      return result;
    });
  }

  selectPoi(poi: Poi | null) {
    this._selectedPoi.set(poi);
  }

  updatePoiPartial(id: string, changes: Partial<Poi>) {
    this._pois.update((pois) => {
      const updated = pois.map((p) => (p.id === id ? { ...p, ...changes } : p));
      this.save(updated);
      return updated;
    });
    this._selectedPoi.update((poi) => (poi?.id === id ? { ...poi, ...changes } : poi));
  }
}
