import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncluirfornecedoresComponent } from './incluirfornecedores.component';

describe('IncluirfornecedoresComponent', () => {
  let component: IncluirfornecedoresComponent;
  let fixture: ComponentFixture<IncluirfornecedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncluirfornecedoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncluirfornecedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
