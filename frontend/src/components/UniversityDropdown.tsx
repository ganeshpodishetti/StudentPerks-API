import { useUniversityOptions } from '@/pages/AdminUniversitiesPage';

interface UniversityDropdownProps {
  value?: string;
  onChange: (universityId: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export default function UniversityDropdown({
  value,
  onChange,
  placeholder = "Select a university",
  required = false,
  disabled = false,
  error
}: UniversityDropdownProps) {
  const { universityOptions, isLoading } = useUniversityOptions();

  if (isLoading) {
    return (
      <div className="relative">
        <select 
          disabled 
          className="w-full px-4 py-3 pr-10 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed appearance-none focus:outline-none"
        >
          <option>Loading universities...</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-3 pr-10 bg-gray-800 border border-gray-600 rounded-lg appearance-none transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500
          hover:border-gray-500 text-white placeholder-gray-400
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          ${disabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : ''}
          ${!value ? 'text-gray-400' : 'text-white'}
        `}
      >
        <option value="" className="text-gray-400 bg-gray-800">{placeholder}</option>
        {universityOptions.map((option) => (
          <option key={option.value} value={option.value} className="text-white bg-gray-800">
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg 
          className={`w-5 h-5 transition-colors duration-200 ${
            error ? 'text-red-500' : 'text-gray-400'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
