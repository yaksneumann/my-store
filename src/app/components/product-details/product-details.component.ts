import { Component, input, OnInit, SimpleChanges, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  
  selectedProductId = input<number | null>(null);

  productForm!: FormGroup;
  isEditMode = false;
  selectedProduct: Product | null = null;
  products = this.productService.products;

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedProductId']) {
      this.loadProduct();
    }
  }

  private initializeForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      description: ['', [Validators.maxLength(200)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
    });
  }

  private loadProduct() {
    if (this.selectedProductId()) {
      this.selectedProduct = this.products().find((p) => p.id === this.selectedProductId()) || null;

      if (this.selectedProduct) {
        this.isEditMode = true;
        this.productForm.patchValue({
          name: this.selectedProduct.name,
          description: this.selectedProduct.description,
          price: this.selectedProduct.price,
        });
      }
    } else {
      this.selectedProduct = null;
      this.isEditMode = false;
      this.productForm?.reset();
    }
  }

  saveProduct() {
    if (this.productForm.valid) {
      const formData = this.productForm.value;

      if (this.isEditMode && this.selectedProduct) {
        this.productService.updateProduct(this.selectedProduct.id, formData);
        this.productForm.markAsPristine();
        this.toastService.showSuccess('Product updated successfully');
      } else {
        const product = this.productService.addProduct(formData);
        if (product) {
          this.productForm?.reset();
          this.toastService.showSuccess('Product added successfully');
        }
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.productForm.controls).forEach((key) => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } cannot exceed ${maxLength} characters`;
      }
      if (field.errors['min']) {
        return 'Price must be greater than 0';
      }
    }
    return '';
  }
}
