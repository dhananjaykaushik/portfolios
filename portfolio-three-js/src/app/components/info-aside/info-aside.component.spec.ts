import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAsideComponent } from './info-aside.component';

describe('InfoAsideComponent', () => {
  let component: InfoAsideComponent;
  let fixture: ComponentFixture<InfoAsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoAsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
