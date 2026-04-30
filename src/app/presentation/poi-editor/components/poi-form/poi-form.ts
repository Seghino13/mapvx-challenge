import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoiFacade } from '../../facade/poi.facade';

@Component({
  selector: 'app-poi-form',
  imports: [FormsModule],
  templateUrl: './poi-form.html',
  styleUrl: './poi-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiForm {
  private readonly facade = inject(PoiFacade);

  readonly selectedPoi = this.facade.selectedPoi;

  updateName(name: string) {
    const poi = this.selectedPoi();
    if (!poi) return;
    this.facade.updatePoiPartial(poi.id, { name });
  }

  updateCategory(category: string) {
    const poi = this.selectedPoi();
    if (!poi) return;
    this.facade.updatePoiPartial(poi.id, { category });
  }

  deleteSelected(): void {
    const poi = this.selectedPoi();
    if (!poi) return;
    const confirmDelete = confirm(`Delete "${poi.name}"?`);
    if (!confirmDelete) return;
    this.facade.deletePoi(poi.id);
    this.facade.selectPoi(null);
  }
}
