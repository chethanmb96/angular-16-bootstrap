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

  async saveProduct(payload: ProductPayload): Promise<void> {
    if (this.selectedProduct) {
      await this.productService.updateProduct(
        this.selectedProduct.id,
        payload
      );

      this.selectedProduct = null;
      return;
    }

    await this.productService.addProduct(payload);
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
  }

  async deleteProduct(id: number): Promise<void> {
    if (this.selectedProduct?.id === id) {
      this.selectedProduct = null;
    }

    await this.productService.deleteProduct(id);
  }

  cancelEdit(): void {
    this.selectedProduct = null;
  }
}