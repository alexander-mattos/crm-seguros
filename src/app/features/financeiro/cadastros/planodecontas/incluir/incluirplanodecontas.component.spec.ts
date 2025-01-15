import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncluirplanodecontasComponent } from './incluirplanodecontas.component';

describe('IncluirplanodecontasComponent', () => {
  let component: IncluirplanodecontasComponent;
  let fixture: ComponentFixture<IncluirplanodecontasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncluirplanodecontasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncluirplanodecontasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
