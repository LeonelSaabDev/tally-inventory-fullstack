import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Product } from "../../data-access/product.model";
import { ProductTable } from "./product-table";

describe("ProductTable", () => {
  let fixture: ComponentFixture<ProductTable>;

  const product: Product = {
    id: "1",
    name: "Coca Cola 1.5L",
    brand: "Coca Cola",
    price: 2500,
    stock: 10,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTable);
  });

  it("should show an empty message when there are no products", async () => {
    fixture.componentRef.setInput("products", []);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain("No products found.");
  });

  it("should render one row per product", async () => {
    fixture.componentRef.setInput("products", [product]);
    await fixture.whenStable();

    const rows = fixture.nativeElement.querySelectorAll("tbody tr");
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain("Coca Cola 1.5L");
  });

  it("should emit the product when Delete is clicked", async () => {
    fixture.componentRef.setInput("products", [product]);
    await fixture.whenStable();

    let deleted: Product | undefined;
    fixture.componentInstance.delete.subscribe((p) => (deleted = p));
    fixture.nativeElement.querySelector("button.danger").click();

    expect(deleted).toEqual(product);
  });

  it("should flag low and out of stock products", async () => {
    fixture.componentRef.setInput("products", [
      { ...product, id: "2", stock: 3 },
      { ...product, id: "3", stock: 0 },
    ]);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector(".stock--low").textContent).toContain("Low");
    expect(fixture.nativeElement.querySelector(".stock--out").textContent).toContain("Out of stock");
  });
});
