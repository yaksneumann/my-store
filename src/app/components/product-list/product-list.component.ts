import { Component, input, output, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';

type SortOption = 'name' | 'date';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  selectedProductId = input<number | null>(null);
  addNewProduct = output<void>();
  productSelected = output<number>();

  private products = this.productService.products;
  private filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  sortBy: SortOption = 'name';
  searchText = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  constructor() {
    effect(() => {
      this.applyFiltersAndPagination();
    });
  }

  addProduct() {
    this.addNewProduct.emit();
  }

  selectProduct(product: Product) {
    this.productSelected.emit(product.id);
    this.router.navigate(['/products', product.id]);
  }

  deleteProduct(event: Event, productId: number) {
    event.stopPropagation();
    this.productService.deleteProduct(productId);
    this.toastService.showInfo('Product deleted successfully');
    this.products().filter((p) => p.id !== productId);
    this.addNewProduct.emit();
  }

  onSearchChange() {
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  onSortChange() {
    this.applyFiltersAndPagination();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.applyFiltersAndPagination();
  }

  private applyFiltersAndPagination() {
    this.filteredProducts = this.products().filter(product => product.name.toLowerCase().includes(this.searchText.toLowerCase()));

    this.filteredProducts.sort((a, b) => {
      if (this.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return b.creationDate.getTime() - a.creationDate.getTime();
      }
    });
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }
}