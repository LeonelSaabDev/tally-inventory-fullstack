import { Component, inject, input, OnInit, output } from "@angular/core";
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  Product,
  PRODUCT_BRAND_MAX_LENGTH,
  PRODUCT_NAME_MAX_LENGTH,
  ProductRequest,
} from "../../data-access/product.model";

@Component({
  imports: [ReactiveFormsModule],
  selector: "app-product-form",
  styleUrl: "./product-form.css",
  templateUrl: "./product-form.html",
})
export class ProductForm implements OnInit {
  readonly product = input<Product>();
  readonly saving = input(false);

  readonly save = output<ProductRequest>();
  readonly cancel = output<void>();

  protected readonly nameMaxLength = PRODUCT_NAME_MAX_LENGTH;
  protected readonly brandMaxLength = PRODUCT_BRAND_MAX_LENGTH;

  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    name: [
      "",
      [Validators.required, Validators.maxLength(PRODUCT_NAME_MAX_LENGTH)],
    ],
    brand: [
      "",
      [Validators.required, Validators.maxLength(PRODUCT_BRAND_MAX_LENGTH)],
    ],
    price: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(0.01),
    ]),
    stock: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(0),
      Validators.pattern(/^\d+$/),
    ]),
  });

  ngOnInit(): void {
    const product = this.product();
    if (product) {
      this.form.patchValue(product);
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, brand, price, stock } = this.form.getRawValue();
    this.save.emit({ name, brand, price: price!, stock: stock! });
  }
}
