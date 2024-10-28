import { TestBed } from '@angular/core/testing';

import { NgxIndexedDbService } from './ngx-indexed-db.service';

describe('NgxIndexedDbService', () => {
  let service: NgxIndexedDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxIndexedDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
