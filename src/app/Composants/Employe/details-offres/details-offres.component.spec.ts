import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsOffresComponent } from './details-offres.component';

describe('DetailsOffresComponent', () => {
  let component: DetailsOffresComponent;
  let fixture: ComponentFixture<DetailsOffresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsOffresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsOffresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
