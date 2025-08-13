import { Component } from '@angular/core';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ProductDetailsComponent } from '../../components/product-details/product-details.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductListComponent, ProductDetailsComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  selectedProductId: number | null = null;

  onProductSelected(productId: number) {
    this.selectedProductId = productId;
  }

  onAddNewProduct() {
    this.selectedProductId = null;
  }
}