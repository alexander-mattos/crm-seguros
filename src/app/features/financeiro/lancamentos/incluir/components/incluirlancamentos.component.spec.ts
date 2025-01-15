import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncluirlancamentosComponent } from './incluirlancamentos.component';

describe('IncluirlancamentosComponent', () => {
  let component: IncluirlancamentosComponent;
  let fixture: ComponentFixture<IncluirlancamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncluirlancamentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncluirlancamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
