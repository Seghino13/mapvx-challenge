import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoiFacade } from '../../facade/poi.facade';

@Component({
  selector: 'app-poi-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './poi-filter.html',
  styleUrl: './poi-filter.scss',
})
export class PoiFilter {
  private readonly facade = inject(PoiFacade);

  onChange(value: string) {
    this.facade.setFilter(value);
  }
}
