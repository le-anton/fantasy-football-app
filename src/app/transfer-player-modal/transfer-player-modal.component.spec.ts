import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferPlayerModalComponent } from './transfer-player-modal.component';

describe('TransferPlayerModalComponent', () => {
  let component: TransferPlayerModalComponent;
  let fixture: ComponentFixture<TransferPlayerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferPlayerModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferPlayerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
