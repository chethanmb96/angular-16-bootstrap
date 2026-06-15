import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { supabase } from '../core/supabase.client';
import { Product, ProductPayload } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly productsSubject = new BehaviorSubject<Product[]>([]);

  readonly products$: Observable<Product[]> =
    this.productsSubject.asObservable();

  constructor() {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (!error) {
      this.productsSubject.next(data || []);
    }
  }

  async addProduct(payload: ProductPayload): Promise<void> {
    await supabase.from('products').insert(payload);
    await this.loadProducts();
  }

  async updateProduct(id: number, payload: ProductPayload): Promise<void> {
    await supabase
      .from('products')
      .update(payload)
      .eq('id', id);

    await this.loadProducts();
  }

  async deleteProduct(id: number): Promise<void> {
    await supabase
      .from('products')
      .delete()
      .eq('id', id);

    await this.loadProducts();
  }
}