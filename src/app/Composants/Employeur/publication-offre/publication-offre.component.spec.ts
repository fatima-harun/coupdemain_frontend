import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationOffreComponent } from './publication-offre.component';

describe('PublicationOffreComponent', () => {
  let component: PublicationOffreComponent;
  let fixture: ComponentFixture<PublicationOffreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicationOffreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicationOffreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
