import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FeatureCollection, Point } from 'geojson';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PoiApiService {
  private readonly http = inject(HttpClient);

  async loadValid(): Promise<FeatureCollection<Point>> {
    return firstValueFrom(
      this.http.get<FeatureCollection<Point>>('valid.geojson')
    );
  }

 async loadInvalid(): Promise<FeatureCollection<Point>> {
    return firstValueFrom(
      this.http.get<FeatureCollection<Point>>('invalid.geojson')
    );
  }
}
