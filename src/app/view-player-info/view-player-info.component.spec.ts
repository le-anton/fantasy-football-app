import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPlayerInfoComponent } from './view-player-info.component';

describe('ViewPlayerInfoComponent', () => {
  let component: ViewPlayerInfoComponent;
  let fixture: ComponentFixture<ViewPlayerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPlayerInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPlayerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
