import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostuleOffreComponent } from './postule-offre.component';

describe('PostuleOffreComponent', () => {
  let component: PostuleOffreComponent;
  let fixture: ComponentFixture<PostuleOffreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostuleOffreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostuleOffreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
