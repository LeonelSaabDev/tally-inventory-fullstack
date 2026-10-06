import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { ProductFormPage } from "./product-form-page";

describe("ProductFormPage", () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it("should show the create title when there is no id", async () => {
    const fixture = TestBed.createComponent(ProductFormPage);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector("h1").textContent).toContain(
      "New product",
    );
  });

  it("should load the product when editing", async () => {
    const fixture = TestBed.createComponent(ProductFormPage);
    fixture.componentRef.setInput("id", "42");
    TestBed.tick();

    httpTesting
      .expectOne((request) => request.url.endsWith("/products/42"))
      .flush({
        id: "42",
        name: "Pepsi 2L",
        brand: "Pepsi",
        price: 2300,
        stock: 5,
      });
    await fixture.whenStable();

    const nameInput = fixture.nativeElement.querySelector(
      "#name",
    ) as HTMLInputElement;
    expect(nameInput.value).toBe("Pepsi 2L");
  });

  it("should show the API validation message when saving fails", async () => {
    const fixture = TestBed.createComponent(ProductFormPage);
    const navigate = vi.spyOn(TestBed.inject(Router), "navigate");
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;
    for (const [id, value] of [
      ["name", "X"],
      ["brand", "Y"],
      ["price", "10"],
      ["stock", "1"],
    ]) {
      const input = element.querySelector<HTMLInputElement>(`#${id}`)!;
      input.value = value;
      input.dispatchEvent(new Event("input"));
    }
    element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();

    httpTesting
      .expectOne((request) => request.method === "POST")
      .flush(
        { title: "Validation error", detail: "Product name is required." },
        { status: 400, statusText: "Bad Request" },
      );
    await fixture.whenStable();

    expect(element.querySelector('[role="alert"]')!.textContent).toContain(
      "Product name is required.",
    );
    expect(navigate).not.toHaveBeenCalled();
  });
});
