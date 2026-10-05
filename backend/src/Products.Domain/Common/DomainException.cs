using System;
using System.Collections.Generic;
using System.Text;

namespace Products.Domain.Common
{
    public sealed class DomainException(string message) : Exception(message)
    {
    }
}
