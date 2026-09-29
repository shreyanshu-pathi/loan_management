import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewDetails } from './view-details';

describe('ViewDetails', () => {
  let component: ViewDetails;
  let fixture: ComponentFixture<ViewDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
