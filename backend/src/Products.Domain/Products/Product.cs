using Products.Domain.Common;

namespace Products.Domain.Products
{
    public sealed class Product
    {
        public const int NameMaxLength = 100;
        public const int BrandMaxLength = 50;

        public Guid Id { get; private set; }
        public string Name { get; private set; } = string.Empty;
        public string Brand { get; private set; } = string.Empty;
        public decimal Price { get; private set; }
        public int Stock { get; private set; }

        private Product() { }

        public static Product Create(string name, string brand, decimal price, int stock)
        {
            var product = new Product { Id = Guid.CreateVersion7() };
            product.Update(name, brand, price, stock);
            return product;
        }

        public void Update(string name,string brand,decimal price, int stock)
        {
            Validate(name, brand, price, stock);

            Name = name.Trim();
            Brand = brand.Trim();
            Price = price;
            Stock = stock;
        }

        private static void Validate(string name,string brand,decimal price, int stock)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new DomainException("Product name is required.");

            if(name.Trim().Length > NameMaxLength)
                throw new DomainException($"Product name cannot exceed {NameMaxLength} characters.");
            
            if(string.IsNullOrWhiteSpace(brand))
                throw new DomainException("Product brand is required.");

            if(brand.Trim().Length > BrandMaxLength)
                throw new DomainException($"Product brand cannot exceed {BrandMaxLength} characters.");

            if(price <= 0)
                throw new DomainException("Product price must be greater than zero.");

            if(stock < 0)
                throw new DomainException("Product stock cannot be negative.");
        }
    }
}
