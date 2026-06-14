import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Product } from '../../models/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  @Input() products: Product[] | null = [];
  @Input() selectedProductId: number | null = null;
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<number>();

  trackByProductId(_: number, product: Product): number {
    return product.id;
  }
}
