using Microsoft.AspNetCore.Diagnostics;
using Products.Domain.Common;

namespace Products.Api.ErrorHandling;

internal sealed class BadRequestExceptionHandler(IProblemDetailsService problemDetailsService) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var title = exception switch
        {
            DomainException => "Validation error",
            BadHttpRequestException => "Invalid request",
            _ => null
        };

        if (title is null)
            return false;

        httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;

        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails =
            {
                Title = title,
                Detail = exception.Message,
                Status = StatusCodes.Status400BadRequest
            }
        });
    }
}