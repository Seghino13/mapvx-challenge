import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { Poi } from '../../../../domain/poi/models/poi.model';
import { MapView } from '../../components/map-view/map-view';
import { PoiFilter } from "../../components/poi-filter/poi-filter";
import { PoiForm } from '../../components/poi-form/poi-form';
import { PoiFacade } from '../../facade/poi.facade';

@Component({
  selector: 'app-poi-editor-page',
  imports: [MapView, PoiForm, PoiFilter],
  templateUrl: './poi-editor-page.html',
  styleUrl: './poi-editor-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiEditorPage {
  ngOnInit(): void {
    this.facade.loadInitialData();
  }
  private readonly facade: PoiFacade = inject(PoiFacade);
  readonly pois: Signal<Poi[]> = this.facade.pois;
}
