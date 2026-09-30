import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TotalLoans } from './total-loans';

describe('TotalLoans', () => {
  let component: TotalLoans;
  let fixture: ComponentFixture<TotalLoans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalLoans],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalLoans);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
