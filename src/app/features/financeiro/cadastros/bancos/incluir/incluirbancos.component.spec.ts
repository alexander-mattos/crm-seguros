import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncluirComponent } from './incluirbancos.component';

describe('IncluirComponent', () => {
  let component: IncluirComponent;
  let fixture: ComponentFixture<IncluirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncluirComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncluirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
