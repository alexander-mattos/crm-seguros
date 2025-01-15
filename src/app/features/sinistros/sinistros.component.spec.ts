import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinistrosComponent } from './sinistros.component';

describe('SinistrosComponent', () => {
  let component: SinistrosComponent;
  let fixture: ComponentFixture<SinistrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinistrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinistrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
