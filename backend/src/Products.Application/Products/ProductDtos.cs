using Products.Domain.Products;

namespace Products.Application.Products;

public sealed record CreateProductRequest(string Name, string Brand, decimal Price, int Stock);

 public sealed record UpdateProductRequest(string Name, string Brand, decimal Price, int Stock);

public sealed record ProductResponse(Guid Id, string Name, string Brand, decimal Price, int Stock)
{
    public static ProductResponse FromEntity(Product product) =>
        new(product.Id, product.Name, product.Brand, product.Price, product.Stock);
}

