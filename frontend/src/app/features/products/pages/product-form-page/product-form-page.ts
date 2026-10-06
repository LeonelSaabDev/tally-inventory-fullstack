import { HttpErrorResponse } from "@angular/common/http";
import { Component, computed, inject, input, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { ProductForm } from "../../components/product-form/product-form";
import { ProductRequest } from "../../data-access/product.model";
import { ProductsApi } from "../../data-access/products-api";

@Component({
  imports: [ProductForm],
  selector: "app-product-form-page",
  styleUrl: "./product-form-page.css",
  templateUrl: "./product-form-page.html",
})
export class ProductFormPage {
  private readonly api = inject(ProductsApi);
  private readonly router = inject(Router);

  /** Bound from the `:id` route parameter. Undefined when creating a product. */
  readonly id = input<string>();

  protected readonly isEditMode = computed(() => this.id() !== undefined);

  protected readonly product = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => this.api.getById(id),
  });

  protected readonly saving = signal(false);
  protected readonly serverError = signal<string | null>(null);

  protected save(request: ProductRequest): void {
    this.saving.set(true);
    this.serverError.set(null);

    const id = this.id();
    const request$ = id
      ? this.api.update(id, request)
      : this.api.create(request);

    request$.subscribe({
      next: () => this.router.navigate(["/products"]),
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        this.serverError.set(
          error.error?.detail ?? "The product could not be saved.",
        );
      },
    });
  }

  protected cancel(): void {
    this.router.navigate(["/products"]);
  }
}
