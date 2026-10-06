using Microsoft.Extensions.DependencyInjection;
using Products.Application.Products;

namespace Products.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<ProductService>();
            return services;
        }
    }
}
