import { DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { getStockStatus, Product } from '../../data-access/product.model';

@Component({
  imports: [DecimalPipe],
  selector: 'app-product-table',
  styleUrl: './product-table.css',
  templateUrl: './product-table.html',
})
export class ProductTable {
  readonly products = input.required<Product[]>();
  readonly edit = output<Product>();
  readonly delete = output<Product>();

  protected readonly stockStatus = getStockStatus;
}
