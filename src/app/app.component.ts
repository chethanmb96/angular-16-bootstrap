import { Component } from '@angular/core';

import { Product, ProductPayload } from './models/product';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly products$ = this.productService.products$;
  selectedProduct: Product | null = null;

  constructor(private readonly productService: ProductService) {}

  saveProduct(payload: ProductPayload): void {
    if (this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.id, payload).subscribe(() => {
        this.selectedProduct = null;
      });
      return;
    }

    this.productService.addProduct(payload).subscribe();
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
  }

  deleteProduct(id: number): void {
    if (this.selectedProduct?.id === id) {
      this.selectedProduct = null;
    }

    this.productService.deleteProduct(id).subscribe();
  }

  cancelEdit(): void {
    this.selectedProduct = null;
  }

  resetProducts(): void {
    this.selectedProduct = null;
    this.productService.resetProducts().subscribe();
  }
}
