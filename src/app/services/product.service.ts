import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { forkJoin, map, of, switchMap, tap } from 'rxjs';

import { Product, ProductPayload } from '../models/product';

const API_URL = 'http://localhost:3000/products';

const STARTER_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Wireless Keyboard',
    category: 'Accessories',
    price: 49.99,
    stock: 24,
    description: 'Compact keyboard with quiet keys and USB-C charging.'
  },
  {
    id: 2,
    name: 'Desk Lamp',
    category: 'Office',
    price: 32.5,
    stock: 12,
    description: 'LED desk lamp with dimmer and adjustable arm.'
  },
  {
    id: 3,
    name: 'Notebook Stand',
    category: 'Workspace',
    price: 27,
    stock: 18,
    description: 'Foldable stand for a more comfortable laptop setup.'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);

  readonly products$: Observable<Product[]> = this.productsSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.loadProducts().subscribe();
  }

  loadProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(API_URL).pipe(
      map((products) => [...products].reverse()),
      tap((products) => this.productsSubject.next(products))
    );
  }

  addProduct(payload: ProductPayload): Observable<Product> {
    return this.http.post<Product>(API_URL, payload).pipe(
      tap((product) => this.productsSubject.next([product, ...this.productsSubject.value]))
    );
  }

  updateProduct(id: number, payload: ProductPayload): Observable<Product> {
    return this.http.put<Product>(`${API_URL}/${id}`, { ...payload, id }).pipe(
      tap((updatedProduct) => {
        const products = this.productsSubject.value.map((product) =>
          product.id === id ? updatedProduct : product
        );
        this.productsSubject.next(products);
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`).pipe(
      tap(() => {
        const products = this.productsSubject.value.filter((product) => product.id !== id);
        this.productsSubject.next(products);
      })
    );
  }

  resetProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(API_URL).pipe(
      switchMap((products) => {
        const clearProducts$ = products.length
          ? forkJoin(products.map((product) => this.http.delete<void>(`${API_URL}/${product.id}`))).pipe(
              map(() => undefined)
            )
          : of(undefined);

        return clearProducts$.pipe(
          switchMap(() => forkJoin(STARTER_PRODUCTS.map((product) => this.http.post<Product>(API_URL, product)))),
          map((products) => [...products].reverse()),
          tap((products) => this.productsSubject.next(products))
        );
      })
    );
  }
}
