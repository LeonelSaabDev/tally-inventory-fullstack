import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { getStockStatus, Product } from '../../data-access/product.model';

@Component({
  imports: [DecimalPipe],
  selector: 'app-product-stats',
  styleUrl: './product-stats.css',
  templateUrl: './product-stats.html',
})
export class ProductStats {
  readonly products = input.required<Product[]>();

  protected readonly totalProducts = computed(() => this.products().length);

  protected readonly totalUnits = computed(() =>
    this.products().reduce((sum, product) => sum + product.stock, 0),
  );

  protected readonly inventoryValue = computed(() =>
    this.products().reduce((sum, product) => sum + product.price * product.stock, 0),
  );

  protected readonly needsAttention = computed(
    () => this.products().filter((product) => getStockStatus(product.stock) !== 'ok').length,
  );
}
