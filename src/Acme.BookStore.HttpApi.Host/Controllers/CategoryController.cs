using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Acme.BookStore.Categories
{
    [ApiController]
    [Route("api/Categories")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryAppService _categoryAppService;

        public CategoryController(CategoryAppService categoryAppService)
        {
            _categoryAppService = categoryAppService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetAsync(Guid id)
        {
            var category = await _categoryAppService.GetAsync(id);
            return Ok(category);
        }

        [HttpGet]
        public async Task<ActionResult<List<CategoryDto>>> GetListAsync()
        {
            var categories = await _categoryAppService.GetListAsync();
            return Ok(categories);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateCategoryDto input)
        {
            await _categoryAppService.CreateAsync(input);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(Guid id, UpdateCategoryDto input)
        {
            await _categoryAppService.UpdateAsync(id, input);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(Guid id)
        {
            await _categoryAppService.DeleteAsync(id);
            return Ok();
        }
    }
}
