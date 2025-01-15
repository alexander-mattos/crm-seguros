import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrodecustosComponent } from './centrodecustos.component';

describe('CentrodecustosComponent', () => {
  let component: CentrodecustosComponent;
  let fixture: ComponentFixture<CentrodecustosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentrodecustosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentrodecustosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
