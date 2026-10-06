import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "products" },
  {
    path: "products",
    loadComponent: () =>
      import("./features/products/pages/product-list-page/product-list-page").then(
        (m) => m.ProductListPage,
      ),
  },
  {
    path: "products/new",
    loadComponent: () =>
      import("./features/products/pages/product-form-page/product-form-page").then(
        (m) => m.ProductFormPage,
      ),
  },
  {
    path: "products/:id/edit",
    loadComponent: () =>
      import("./features/products/pages/product-form-page/product-form-page").then(
        (m) => m.ProductFormPage,
      ),
  },
  { path: "**", redirectTo: "products" },
];
