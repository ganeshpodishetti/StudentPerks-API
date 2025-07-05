namespace SP.Application.ErrorHandler;

public class Result<T>
{
    private Result(bool isSuccess, T? value, string? error, List<string>? errors = null, object? additionalData = null)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
        Errors = errors ?? [];
        AdditionalData = additionalData;
    }

    public bool IsSuccess { get; private set; }
    public T? Value { get; private set; }
    public string? Error { get; private set; }
    public List<string> Errors { get; private set; }
    public object? AdditionalData { get; private set; }

    public static Result<T> Success(T value)
    {
        return new Result<T>(true, value, null);
    }

    public static Result<T> Success(T value, object? additionalData)
    {
        return new Result<T> (true,  value, null, null, additionalData);
    }

    public static Result<T> Failure(string error)
    {
        return new Result<T>(false, default, error);
    }

    public static Result<T> Failure(List<string> errors)
    {
        return new Result<T>(false, default, null, errors);
    }
}

// For operations that don't return data
public class Result
{
    private Result(bool isSuccess, string? error, List<string>? errors = null)
    {
        IsSuccess = isSuccess;
        Error = error;
        Errors = errors ?? new List<string>();
    }

    public bool IsSuccess { get; private set; }
    public string? Error { get; private set; }
    public List<string> Errors { get; private set; }

    public static Result Success()
    {
        return new Result(true, null);
    }

    public static Result Failure(string error)
    {
        return new Result(false, error);
    }

    public static Result Failure(List<string> errors)
    {
        return new Result(false, null, errors);
    }
}