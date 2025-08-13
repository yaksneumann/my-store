import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private snackBar = inject(MatSnackBar);

  showSuccess(message: string): void {
    this.show(message, 'success-toast');
  }

  showInfo(message: string): void {
    this.show(message, 'info-toast');
  }

  private show(message: string, cssClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [cssClass]
    });
  }
}