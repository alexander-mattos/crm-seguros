import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarbancosComponent } from './bancos.component';

describe('CadastrarbancosComponent', () => {
  let component: CadastrarbancosComponent;
  let fixture: ComponentFixture<CadastrarbancosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarbancosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarbancosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
