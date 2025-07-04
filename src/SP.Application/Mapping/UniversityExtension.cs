using SP.Application.Contracts;
using SP.Application.Dtos.University;
using SP.Domain.Entities;

namespace SP.Application.Mapping;

public static class UniversityExtension
{
    public static UniversityResponse ToDto(
        this University university)
    {
        return new UniversityResponse(
            university.Id,
            university.Name,
            university.Code,
            university.Country,
            university.State,
            university.City,
            university.ImageUrl,
            university.IsActive);
    }

    public static CreateUniversityResponse ToCreateResponse(
        this University university)
    {
        return new CreateUniversityResponse(
            university.Id,
            university.ImageUrl);
    }

    public static async Task<University> ToEntity(
        this CreateUniversityRequest request, IFileService fileService)
    {
        if (request.Image == null)
            return new University
            {
                Name = request.Name,
                Code = request.Code,
                Country = request.Country,
                State = request.State,
                City = request.City
            };

        var imageUrl = await fileService.UploadImageAsync(request.Image, "universities");
        var imageKitFileId = fileService.ExtractFileIdFromUrl(imageUrl);

        return new University
        {
            Name = request.Name,
            Code = request.Code,
            Country = request.Country,
            State = request.State,
            City = request.City,
            ImageUrl = imageUrl,
            ImageKitFileId = imageKitFileId
        };
    }

    public static async Task ToEntity(
        this UpdateUniversityRequest request, University university, IFileService fileService)
    {
        if (request.Image != null)
        {
            if (!string.IsNullOrEmpty(university.ImageKitFileId))
                // Delete the old image if it exists
                await fileService.DeleteImageAsync(university.ImageKitFileId);

            // Handle image upload and update
            var imageUrl = await fileService.UploadImageAsync(request.Image, "universities");
            university.ImageUrl = imageUrl;
            university.ImageKitFileId = fileService.ExtractFileIdFromUrl(imageUrl);
        }

        university.Name = request.Name;
        university.Code = request.Code;
        university.Country = request.Country;
        university.State = request.State;
        university.City = request.City;
        university.IsActive = request.IsActive;
    }
}