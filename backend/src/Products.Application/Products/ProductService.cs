using Products.Domain.Products;

namespace Products.Application.Products
{
    public sealed class ProductService(IProductRepository repository)
    {
        public async Task<IReadOnlyList<ProductResponse>> SearchAsync(string? searchTerm, CancellationToken cancellationToken)
        {
            var products = await repository.SearchAsync(searchTerm, cancellationToken);
            return products.Select(ProductResponse.FromEntity).ToList();
        }

        public async Task<ProductResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            var product = await repository.GetByIdAsync(id, cancellationToken);
            return product is null ? null : ProductResponse.FromEntity(product);
        }

        public async Task<ProductResponse> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken)
        {
            var product = Product.Create(request.Name, request.Brand, request.Price, request.Stock);

            repository.Add(product);
            await repository.SaveChangesAsync(cancellationToken);

            return ProductResponse.FromEntity(product);
        }

        public async Task<ProductResponse?> UpdateAsync(Guid id, UpdateProductRequest request, CancellationToken cancellationToken)
        {
            var product = await repository.GetByIdAsync(id, cancellationToken);
            if (product is null)
                return null;

            product.Update(request.Name, request.Brand, request.Price, request.Stock);
            await repository.SaveChangesAsync(cancellationToken);

            return ProductResponse.FromEntity(product);
        }

        public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var product = await repository.GetByIdAsync(id, cancellationToken);
            if (product is null)
                return false;

            repository.Remove(product);
            await repository.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
