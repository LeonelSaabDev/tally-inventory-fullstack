using Microsoft.EntityFrameworkCore;
using Products.Application.Products;
using Products.Domain.Products;

namespace Products.Infrastructure.Persistence.Repositories
{
    internal sealed class ProductRepository(AppDbContext dbContext) : IProductRepository
    {
        public async Task<IReadOnlyList<Product>> SearchAsync(string? searchTerm, CancellationToken cancellationToken)
        {
            var query = dbContext.Products.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var term = searchTerm.Trim();
                query = query.Where(p => p.Name.Contains(term) || p.Brand.Contains(term));
            }

            return await query
                .OrderBy(p => p.Name)
                .ToListAsync(cancellationToken);
        }

        public Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken) => dbContext.Products.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        public void Add(Product product) => dbContext.Products.Add(product);

        public void Remove(Product product) => dbContext.Products.Remove(product);

        public Task SaveChangesAsync(CancellationToken cancellationToken) => dbContext.SaveChangesAsync(cancellationToken);
    }
}
