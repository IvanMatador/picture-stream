import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureStreamComponent } from './picture-stream.component';

describe('PictureStreamComponent', () => {
  let component: PictureStreamComponent;
  let fixture: ComponentFixture<PictureStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PictureStreamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PictureStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
