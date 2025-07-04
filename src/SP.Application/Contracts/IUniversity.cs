using SP.Application.Dtos.University;

namespace SP.Application.Contracts;

public interface IUniversity
{
    public Task<IEnumerable<UniversityResponse>> GetAllUniversitiesAsync(CancellationToken cancellationToken);
    public Task<UniversityResponse?> GetUniversityByIdAsync(Guid universityId, CancellationToken cancellationToken);

    public Task<bool> UpdateUniversityAsync(Guid universityId, UpdateUniversityRequest updateUniversityRequest,
        CancellationToken cancellationToken);

    public Task<bool> DeleteUniversityAsync(Guid universityId, CancellationToken cancellationToken);

    public Task<CreateUniversityResponse> CreateUniversityAsync(CreateUniversityRequest createUniversityRequest,
        CancellationToken cancellationToken);
}