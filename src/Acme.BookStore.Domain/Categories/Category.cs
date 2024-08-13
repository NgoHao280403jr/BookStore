using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities;

namespace Acme.BookStore.Books
{
    public class Category : Entity<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<Book> Books { get; set; }

    }
}
