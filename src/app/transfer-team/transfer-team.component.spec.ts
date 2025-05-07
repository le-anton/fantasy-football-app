import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferTeamComponent } from './transfer-team.component';

describe('TransferTeamComponent', () => {
  let component: TransferTeamComponent;
  let fixture: ComponentFixture<TransferTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
