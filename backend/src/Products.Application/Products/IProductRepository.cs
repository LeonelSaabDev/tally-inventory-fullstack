using Products.Domain.Products;

namespace Products.Application.Products
{
    public interface IProductRepository
    {
        Task<IReadOnlyList<Product>> SearchAsync(string? searchTerm, CancellationToken cancellationToken);
        Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
        void Add(Product product);
        void Remove(Product product);
        Task SaveChangesAsync(CancellationToken cancellationToken);
    }
}
