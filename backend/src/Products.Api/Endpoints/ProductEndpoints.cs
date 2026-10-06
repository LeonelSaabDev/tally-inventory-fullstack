using Microsoft.AspNetCore.Http.HttpResults;
using Products.Application.Products;

namespace Products.Api.Endpoints
{
    public static class ProductEndpoints
    {
        public static IEndpointRouteBuilder MapProductEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/products").WithTags("Products");

            group.MapGet("/", SearchProducts);
            group.MapGet("/{id:guid}", GetProductById).WithName(nameof(GetProductById));
            group.MapPost("/", CreateProduct);
            group.MapPut("/{id:guid}", UpdateProduct);
            group.MapDelete("/{id:guid}", DeleteProduct);

            return app;
        }

        private static async Task<Ok<IReadOnlyList<ProductResponse>>> SearchProducts(string? search, ProductService service, CancellationToken cancellationToken)
        {
            var products = await service.SearchAsync(search, cancellationToken);
            return TypedResults.Ok(products);
        }

        private static async Task<Results<Ok<ProductResponse>, NotFound>> GetProductById(
        Guid id, ProductService service, CancellationToken cancellationToken)
        {
            var product = await service.GetByIdAsync(id, cancellationToken);
            return product is null ? TypedResults.NotFound() : TypedResults.Ok(product);
        }

        private static async Task<CreatedAtRoute<ProductResponse>> CreateProduct(
        CreateProductRequest request, ProductService service, CancellationToken cancellationToken)
        {
            var product = await service.CreateAsync(request, cancellationToken);
            return TypedResults.CreatedAtRoute(product, nameof(GetProductById), new { id = product.Id });
        }

        private static async Task<Results<Ok<ProductResponse>, NotFound>> UpdateProduct(
            Guid id, UpdateProductRequest request, ProductService service, CancellationToken cancellationToken)
        {
            var product = await service.UpdateAsync(id, request, cancellationToken);
            return product is null ? TypedResults.NotFound() : TypedResults.Ok(product);
        }

        private static async Task<Results<NoContent, NotFound>> DeleteProduct(
            Guid id, ProductService service, CancellationToken cancellationToken)
        {
            var deleted = await service.DeleteAsync(id, cancellationToken);
            return deleted ? TypedResults.NoContent() : TypedResults.NotFound();
        }
    }
}
