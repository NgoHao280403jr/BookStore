using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Acme.BookStore.Books;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Acme.BookStore.Categories
{
    [RemoteService(IsEnabled =false)]
    public class CategoryAppService : ApplicationService
    {
        private readonly IRepository<Category, Guid> _categoryRepository;

        public CategoryAppService(IRepository<Category, Guid> categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<CategoryDto> GetAsync(Guid id)
        {
            var category = await _categoryRepository.GetAsync(id);
            return ObjectMapper.Map<Category, CategoryDto>(category);
        }

        public async Task<List<CategoryDto>> GetListAsync()
        {
            var categories = await _categoryRepository.GetListAsync();
            return ObjectMapper.Map<List<Category>, List<CategoryDto>>(categories);
        }

        public async Task CreateAsync(CreateCategoryDto input)
        {
            var category = ObjectMapper.Map<CreateCategoryDto, Category>(input);
            await _categoryRepository.InsertAsync(category);
        }

        public async Task UpdateAsync(Guid id, UpdateCategoryDto input)
        {
            var category = await _categoryRepository.GetAsync(id);
            ObjectMapper.Map(input, category);
            await _categoryRepository.UpdateAsync(category);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _categoryRepository.DeleteAsync(id);
        }
    }
}
