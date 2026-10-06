import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Product, ProductRequest } from "../../data-access/product.model";
import { ProductForm } from "./product-form";

describe("ProductForm", () => {
  let fixture: ComponentFixture<ProductForm>;
  let element: HTMLElement;
  let saved: ProductRequest | undefined;

  function fill(id: string, value: string): void {
    const input = element.querySelector<HTMLInputElement>(`#${id}`)!;
    input.value = value;
    input.dispatchEvent(new Event("input"));
  }

  function submit(): void {
    element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductForm);
    element = fixture.nativeElement;
    saved = undefined;
    fixture.componentInstance.save.subscribe((request) => (saved = request));
  });

  it("should emit the product when the form is valid", async () => {
    await fixture.whenStable();

    fill("name", "Coca Cola 1.5L");
    fill("brand", "Coca Cola");
    fill("price", "2500");
    fill("stock", "10");
    submit();

    expect(saved).toEqual({
      name: "Coca Cola 1.5L",
      brand: "Coca Cola",
      price: 2500,
      stock: 10,
    });
  });

  it("should not emit and should show errors when the form is empty", async () => {
    await fixture.whenStable();

    submit();
    await fixture.whenStable();

    expect(saved).toBeUndefined();
    expect(element.textContent).toContain("Name is required.");
    expect(element.textContent).toContain("Price is required.");
  });

  it("should reject a price of zero", async () => {
    await fixture.whenStable();

    fill("name", "Coca Cola 1.5L");
    fill("brand", "Coca Cola");
    fill("price", "0");
    fill("stock", "10");
    submit();
    await fixture.whenStable();

    expect(saved).toBeUndefined();
    expect(element.textContent).toContain("Price must be greater than zero.");
  });

  it("should prefill the fields when editing a product", async () => {
    const product: Product = {
      id: "1",
      name: "Pepsi 2L",
      brand: "Pepsi",
      price: 2300,
      stock: 5,
    };
    fixture.componentRef.setInput("product", product);
    await fixture.whenStable();

    expect(element.querySelector<HTMLInputElement>("#name")!.value).toBe(
      "Pepsi 2L",
    );
    expect(element.querySelector<HTMLInputElement>("#price")!.value).toBe(
      "2300",
    );
  });
});
