using Products.Domain.Common;
using Products.Domain.Products;

namespace Products.Domain.Tests
{
    public class ProductTests
    {
        private const string ValidName = "Coca Cola 1.5L";
        private const string ValidBrand = "Coca Cola";
        private const decimal ValidPrice = 2500m;
        private const int ValidStock = 10;


        [Fact]
        public void Create_WithValidData_ReturnsProductWithTrimmedValues()
        {
            //Arrange
            var name = "  Coca Cola 1.5L  ";
            var brand = " Coca Cola ";

            //Act
            var product = Product.Create(name,brand,ValidPrice,ValidStock);

            //Assert
            Assert.NotEqual(Guid.Empty, product.Id);
            Assert.Equal("Coca Cola 1.5L", product.Name);
            Assert.Equal("Coca Cola", product.Brand);
            Assert.Equal(ValidPrice, product.Price);
            Assert.Equal(ValidStock, product.Stock);

        }

        [Fact]
        public void Create_CalledTwice_GeneratesDifferentIds()
        {
            var first = Product.Create(ValidName, ValidBrand, ValidPrice, ValidStock);
            var second = Product.Create(ValidName, ValidBrand, ValidPrice, ValidStock);

            Assert.NotEqual(first.Id, second.Id);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("   ")]
        public void Create_WithEmptyName_ThrowsDomainException(string? name)
        {
            var act = () => Product.Create(name!, ValidBrand, ValidPrice, ValidStock);

            Assert.Throws<DomainException>(act);
        }

        [Fact]
        public void Create_WithNameExceedingMaxLength_ThrowsDomainException()
        {
            var name = new string('a', Product.NameMaxLength + 1);

            var act = () => Product.Create(name, ValidBrand, ValidPrice, ValidStock);

            Assert.Throws<DomainException>(act);
        }

        [Fact]
        public void Create_WithNameAtMaxLength_Succeeds()
        {
            var name = new string('a', Product.NameMaxLength);

            var product = Product.Create(name, ValidBrand, ValidPrice, ValidStock);

            Assert.Equal(name, product.Name);
        }

        // ---------- Create: Brand ----------

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("   ")]
        public void Create_WithEmptyBrand_ThrowsDomainException(string? brand)
        {
            var act = () => Product.Create(ValidName, brand!, ValidPrice, ValidStock);

            Assert.Throws<DomainException>(act);
        }

        [Fact]
        public void Create_WithBrandExceedingMaxLength_ThrowsDomainException()
        {
            var brand = new string('a', Product.BrandMaxLength + 1);

            var act = () => Product.Create(ValidName, brand, ValidPrice, ValidStock);

            Assert.Throws<DomainException>(act);
        }

        [Fact]
        public void Create_WithBrandAtMaxLength_Succeeds()
        {
            var brand = new string('a', Product.BrandMaxLength);

            var product = Product.Create(ValidName, brand, ValidPrice, ValidStock);

            Assert.Equal(brand, product.Brand);
        }

        // ---------- Create: Price ----------

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        [InlineData(-999.99)]
        public void Create_WithNonPositivePrice_ThrowsDomainException(double price)
        {
            var act = () => Product.Create(ValidName, ValidBrand, (decimal)price, ValidStock);

            Assert.Throws<DomainException>(act);
        }

        [Fact]
        public void Create_WithSmallestPositivePrice_Succeeds()
        {
            var product = Product.Create(ValidName, ValidBrand, 0.01m, ValidStock);

            Assert.Equal(0.01m, product.Price);
        }

        // ---------- Create: Stock ----------

        [Theory]
        [InlineData(-1)]
        [InlineData(-100)]
        public void Create_WithNegativeStock_ThrowsDomainException(int stock)
        {
            var act = () => Product.Create(ValidName, ValidBrand, ValidPrice, stock);

            Assert.Throws<DomainException>(act);
        }

        [Fact]
        public void Create_WithZeroStock_Succeeds()
        {
            var product = Product.Create(ValidName, ValidBrand, ValidPrice, 0);

            Assert.Equal(0, product.Stock);
        }

        // ---------- Update ----------

        [Fact]
        public void Update_WithValidData_ChangesValuesAndKeepsSameId()
        {
            // Arrange
            var product = Product.Create(ValidName, ValidBrand, ValidPrice, ValidStock);
            var originalId = product.Id;

            // Act
            product.Update(" Pepsi 2L ", " Pepsi ", 3000m, 5);

            // Assert
            Assert.Equal(originalId, product.Id);
            Assert.Equal("Pepsi 2L", product.Name);
            Assert.Equal("Pepsi", product.Brand);
            Assert.Equal(3000m, product.Price);
            Assert.Equal(5, product.Stock);
        }

        [Fact]
        public void Update_WithInvalidData_ThrowsAndKeepsOriginalValues()
        {
            // Arrange
            var product = Product.Create(ValidName, ValidBrand, ValidPrice, ValidStock);

            // Act
            var act = () => product.Update("Pepsi 2L", "Pepsi", -1m, 5);

            // Assert
            Assert.Throws<DomainException>(act);
            Assert.Equal(ValidName, product.Name);
            Assert.Equal(ValidBrand, product.Brand);
            Assert.Equal(ValidPrice, product.Price);
            Assert.Equal(ValidStock, product.Stock);
        }
    }
}

