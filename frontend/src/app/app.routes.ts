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
  { path: "**", redirectTo: "products" },
];
