using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SP.Application.Contracts;
using SP.Application.Dtos.University;
using SP.Application.Mapping;
using SP.Infrastructure.Context;

namespace SP.Application.Services;

public class UniversityService(
    SpDbContext spDbContext,
    ILogger<UniversityService> logger,
    IFileService fileService)
    : IUniversity
{
    public async Task<IEnumerable<UniversityResponse>> GetAllUniversitiesAsync(CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all universities from the database");
        var universities = await spDbContext.Universities
                                            .AsNoTracking()
                                            .ToListAsync(cancellationToken);
        logger.LogInformation("Retrieved {Count} universities from the database", universities.Count);
        return universities.Select(u => u.ToDto());
    }

    public async Task<UniversityResponse?> GetUniversityByIdAsync(Guid universityId,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving a university with ID {UniversityId}", universityId);
        var university = await spDbContext.Universities
                                          .AsNoTracking()
                                          .SingleOrDefaultAsync(u => u.Id == universityId, cancellationToken);
        if (university is not null)
        {
            logger.LogInformation("University with ID {UniversityId} found", universityId);
            return university.ToDto();
        }

        logger.LogWarning("University with ID {UniversityId} not found", universityId);
        return null;
    }

    public async Task<bool> UpdateUniversityAsync(Guid universityId, UpdateUniversityRequest updateUniversityRequest,
        CancellationToken cancellationToken)
    {
        var university = await spDbContext.Universities
                                          .SingleOrDefaultAsync(u => u.Id == universityId, cancellationToken);
        if (university is null)
        {
            logger.LogWarning("Attempted to update a non-existing university with ID {UniversityId}", universityId);
            return false;
        }

        logger.LogInformation("Updating university with ID {UniversityId}", universityId);
        await updateUniversityRequest.ToEntity(university, fileService);
        spDbContext.Universities.Update(university);
        await spDbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("University with ID {UniversityId} updated successfully", universityId);
        return true;
    }

    public async Task<bool> DeleteUniversityAsync(Guid universityId, CancellationToken cancellationToken)
    {
        var university = await spDbContext.Universities
                                          .SingleOrDefaultAsync(u => u.Id == universityId, cancellationToken);
        if (university is null)
        {
            logger.LogWarning("Attempted to delete a non-existing university with ID {UniversityId}", universityId);
            return false;
        }

        logger.LogInformation("Deleting university with ID {UniversityId}", universityId);
        spDbContext.Universities.Remove(university);
        await spDbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("University with ID {UniversityId} deleted successfully", universityId);
        return true;
    }

    public async Task<CreateUniversityResponse> CreateUniversityAsync(CreateUniversityRequest createUniversityRequest,
        CancellationToken cancellationToken)
    {
        var existingUniversity = await spDbContext.Universities
                                                  .FirstOrDefaultAsync(u => u.Name == createUniversityRequest.Name,
                                                      cancellationToken);
        if (existingUniversity is not null)
        {
            logger.LogWarning("University with name {Name} already exists", createUniversityRequest.Name);
            return existingUniversity.ToCreateResponse();
        }

        logger.LogInformation("Creating a new university with name {Name}", createUniversityRequest.Name);
        var university = await createUniversityRequest.ToEntity(fileService);
        spDbContext.Universities.Add(university);
        await spDbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("University with ID {Id} created successfully", university.Id);
        return university.ToCreateResponse();
    }
}