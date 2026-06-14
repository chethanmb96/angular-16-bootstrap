import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Product, ProductPayload } from '../../models/product';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnChanges {
  @Input() product: Product | null = null;
  @Output() save = new EventEmitter<ProductPayload>();
  @Output() cancelEdit = new EventEmitter<void>();

  readonly productForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    category: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    description: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(private readonly formBuilder: FormBuilder) {}

  get isEditing(): boolean {
    return Boolean(this.product);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['product']) {
      return;
    }

    if (this.product) {
      this.productForm.setValue({
        name: this.product.name,
        category: this.product.category,
        price: this.product.price,
        stock: this.product.stock,
        description: this.product.description
      });
      return;
    }

    this.productForm.reset(this.emptyFormValue());
  }

  submit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.save.emit(this.productForm.getRawValue());
    this.productForm.reset(this.emptyFormValue());
  }

  cancel(): void {
    this.cancelEdit.emit();
    this.productForm.reset(this.emptyFormValue());
  }

  private emptyFormValue(): ProductPayload {
    return {
      name: '',
      category: '',
      price: 0,
      stock: 0,
      description: ''
    };
  }
}
