import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteLoanDialog } from './delete-loan-dialog';

describe('DeleteLoanDialog', () => {
  let component: DeleteLoanDialog;
  let fixture: ComponentFixture<DeleteLoanDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteLoanDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteLoanDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
