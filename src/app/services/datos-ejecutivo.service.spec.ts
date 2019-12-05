import { TestBed } from '@angular/core/testing';

import { DatosEjecutivoService } from './datos-ejecutivo.service';

describe('DatosEjecutivoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatosEjecutivoService = TestBed.get(DatosEjecutivoService);
    expect(service).toBeTruthy();
  });
});
