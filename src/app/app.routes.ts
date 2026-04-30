import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./presentation/poi-editor/pages/poi-editor-page/poi-editor-page')
        .then(m => m.PoiEditorPage)
  }
];
