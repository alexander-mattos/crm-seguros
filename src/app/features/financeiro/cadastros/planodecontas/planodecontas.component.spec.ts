import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanodecontasComponent } from './planodecontas.component';

describe('PlanodecontasComponent', () => {
  let component: PlanodecontasComponent;
  let fixture: ComponentFixture<PlanodecontasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanodecontasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanodecontasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
