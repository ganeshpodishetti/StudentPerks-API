using SP.Application.Contracts;
using SP.Application.Dtos.Category;
using SP.Domain.Entities;

namespace SP.Application.Mapping;

public static class CategoryExtension
{
    public static CategoryResponse ToDto(this Category category)
    {
        return new CategoryResponse(
            category.Id,
            category.Name,
            category.Description,
            category.ImageUrl);
    }

    public static CreateCategoryResponse ToCreateDto(this Category category)
    {
        return new CreateCategoryResponse(
            category.Id,
            category.ImageUrl);
    }

    public static async Task<Category> ToEntity(this CreateCategoryRequest request,
        IFileService fileService)
    {
        if (request.Image == null)
            return new Category
            {
                Name = request.Name,
                Description = request.Description
            };

        var imageUrl = await fileService.UploadImageAsync(request.Image, "categories");
        var imageKitFileId = fileService.ExtractFileIdFromUrl(imageUrl);

        return new Category
        {
            Name = request.Name,
            Description = request.Description,
            ImageUrl = imageUrl,
            ImageKitFileId = imageKitFileId
        };
    }

    public static async Task ToEntity(this UpdateCategoryRequest request, Category category, IFileService fileService)
    {
        if (request.Image != null)
        {
            if (!string.IsNullOrEmpty(category.ImageKitFileId))
                // Delete the old image if it exists
                fileService.DeleteImageAsync(category.ImageKitFileId).Wait();

            // Handle image upload and update
            var imageUrl = await fileService.UploadImageAsync(request.Image, "categories");
            category.ImageUrl = imageUrl;
            category.ImageKitFileId = fileService.ExtractFileIdFromUrl(imageUrl);
        }

        category.Name = request.Name;
        category.Description = request.Description;
        category.UpdatedAt = DateTime.UtcNow;
    }
}