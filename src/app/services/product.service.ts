import { Injectable, signal, inject } from '@angular/core';
import { Product } from '../models/product.interface';
import { DUMMY_PRODUCTS } from '../shared/dummy-products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private static readonly STORAGE_KEY_PRODUCTS = 'productManager.products';
  private static readonly STORAGE_KEY_NEXT_ID = 'productManager.nextId';
  private productsList = signal<Product[]>([]);
  products = this.productsList.asReadonly();  

  constructor() {
    this.loadProductsFromStorage();
  }

  addProduct(productData: Omit<Product, 'id' | 'creationDate'>): Product {
    const newProduct: Product = {
      ...productData,
      id: this.getNextId(),
      creationDate: new Date()
    };

    const currentProducts = this.productsList();
    const updatedProducts = [...currentProducts, newProduct];
    
    this.productsList.set(updatedProducts);
    this.saveProductsToStorage();
    return newProduct;
  }

  updateProduct(id: number, productData: Partial<Omit<Product, 'id' | 'creationDate'>>): void {
    const currentProducts = this.productsList();
    const productIndex = currentProducts.findIndex(p => p.id === id);

    const updatedProduct: Product = {
      ...currentProducts[productIndex],
      ...productData
    };

    const updatedProducts = [...currentProducts];
    updatedProducts[productIndex] = updatedProduct;
    
    this.productsList.set(updatedProducts);
    this.saveProductsToStorage();
  }

  deleteProduct(id: number): boolean {
    const currentProducts = this.productsList();
    const filteredProducts = currentProducts.filter(p => p.id !== id);
    
    if (filteredProducts.length === currentProducts.length) {
      return false;
    }
    this.productsList.set(filteredProducts);
    this.saveProductsToStorage();
    
    return true;
  }

  private loadProductsFromStorage(): void {
    try {
      const storedProducts = localStorage.getItem(ProductService.STORAGE_KEY_PRODUCTS);
      if (storedProducts) {
        const products: Product[] = JSON.parse(storedProducts);
        const productsWithDates = products.map(product => ({
          ...product,
          creationDate: new Date(product.creationDate)
        }));
        this.productsList.set(productsWithDates);
      } else {
      this.initializeSampleData();
      }
    } catch (error) {
      console.error('Error loading products from localStorage:', error);
      this.initializeSampleData();
    }
  }

  private saveProductsToStorage(): void {
    try {
      localStorage.setItem(ProductService.STORAGE_KEY_PRODUCTS, JSON.stringify(this.productsList()));
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
  }

  private getNextId(): number {
    try {
      const storedNextId = localStorage.getItem(ProductService.STORAGE_KEY_NEXT_ID);
      let nextId = storedNextId ? parseInt(storedNextId, 10) : 1;
      const currentProducts = this.productsList();

      if (currentProducts.length > 0) {
        const maxExistingId = Math.max(...currentProducts.map(p => p.id));
        nextId = Math.max(nextId, maxExistingId + 1);
      }
      localStorage.setItem(ProductService.STORAGE_KEY_NEXT_ID, (nextId + 1).toString());
      return nextId;
    } catch (error) {
      console.error('Error getting next ID:', error);
      return Date.now(); 
    }
  }

  private initializeSampleData(): void {
    const products = DUMMY_PRODUCTS;
    this.productsList.set(products);
    this.saveProductsToStorage();
    localStorage.setItem(ProductService.STORAGE_KEY_NEXT_ID, '5');
  }
}