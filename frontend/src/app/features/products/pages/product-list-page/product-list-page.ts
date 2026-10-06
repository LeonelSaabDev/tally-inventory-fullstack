import { Component, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { ProductTable } from "../../components/product-table/product-table";
import { Product } from "../../data-access/product.model";
import { ProductsApi } from "../../data-access/products-api";

@Component({
  imports: [ProductTable],
  selector: "app-product-list-page",
  styleUrl: "./product-list-page.css",
  templateUrl: "./product-list-page.html",
})
export class ProductListPage {
  private readonly api = inject(ProductsApi);

  protected readonly searchTerm = signal("");

  protected readonly products = rxResource({
    params: () => this.searchTerm(),
    stream: ({ params }) => this.api.search(params),
  });

  protected search(term: string): void {
    this.searchTerm.set(term.trim());
  }

  protected deleteProduct(product: Product): void {
    if (!confirm(`Delete "${product.name}"?`)) {
      return;
    }

    this.api.delete(product.id).subscribe({
      next: () => this.products.reload(),
      error: () => alert("The product could not be deleted. Please try again."),
    });
  }
}
