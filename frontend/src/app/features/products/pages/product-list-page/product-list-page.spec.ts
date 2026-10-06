import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Product } from "../../data-access/product.model";
import { ProductListPage } from "./product-list-page";
import { provideRouter } from "@angular/router";

describe("ProductListPage", () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it("should render the products returned by the API", async () => {
    const products: Product[] = [
      {
        id: "1",
        name: "Coca Cola 1.5L",
        brand: "Coca Cola",
        price: 2500,
        stock: 10,
      },
    ];
    const fixture = TestBed.createComponent(ProductListPage);
    TestBed.tick();

    httpTesting
      .expectOne((request) => request.url.endsWith("/products"))
      .flush(products);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain("Coca Cola 1.5L");
  });

  it("should show an error message when the API fails", async () => {
    const fixture = TestBed.createComponent(ProductListPage);
    TestBed.tick();

    httpTesting
      .expectOne((request) => request.url.endsWith("/products"))
      .flush(null, { status: 500, statusText: "Server Error" });
    await fixture.whenStable();

    expect(
      fixture.nativeElement.querySelector('[role="alert"]'),
    ).not.toBeNull();
  });
});
