import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  imports: [MatDialogModule, MatButtonModule],
  selector: 'app-delete-loan-dialog',
  styleUrl: './delete-loan-dialog.scss',
  templateUrl: './delete-loan-dialog.html',
})
export class DeleteLoanDialog {
  
  constructor(private dialogRef: MatDialogRef<DeleteLoanDialog>){}
  // delete
  delete(): void{
    this.dialogRef.close(true);
  }

  // cancel
  cancel(): void{
    this.dialogRef.close(false);
  }
}
