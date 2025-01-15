import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserircentrodecustosComponent } from './inserircentrodecustos.component';

describe('InserirComponent', () => {
  let component: InserircentrodecustosComponent;
  let fixture: ComponentFixture<InserircentrodecustosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InserircentrodecustosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InserircentrodecustosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
