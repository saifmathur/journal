import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJournalPageComponent } from './view-journal-page.component';

describe('ViewJournalPageComponent', () => {
  let component: ViewJournalPageComponent;
  let fixture: ComponentFixture<ViewJournalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewJournalPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewJournalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
