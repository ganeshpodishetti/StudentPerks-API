import { useToast } from '@/components/ui/use-toast';
import { createContext, ReactNode, useContext } from 'react';

interface ErrorContextType {
  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  handleApiError: (error: any) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useErrorHandler = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useErrorHandler must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const { toast } = useToast();

  const showError = (message: string, title: string = "Error") => {
    toast({
      title,
      description: message,
      variant: "destructive",
    });
  };

  const showSuccess = (message: string, title: string = "Success") => {
    toast({
      title,
      description: message,
    });
  };

  const showWarning = (message: string, title: string = "Warning") => {
    toast({
      title,
      description: message,
      variant: "destructive", // Adjust if you have a warning variant
    });
  };

  const handleApiError = (error: any) => {
    console.error('API Error:', error);
    
    // Handle different types of errors
    if (error.response?.status === 401) {
      showError("Please log in again to continue", "Authentication Error");
      // Could trigger a redirect to login page here
    } else if (error.response?.status === 403) {
      showError("You don't have permission to perform this action", "Access Denied");
    } else if (error.response?.status === 404) {
      showError("The requested resource was not found", "Not Found");
    } else if (error.response?.status >= 500) {
      showError("Server error occurred. Please try again later", "Server Error");
    } else if (error.response?.data?.message) {
      showError(error.response.data.message);
    } else if (error.message) {
      showError(error.message);
    } else {
      showError("An unexpected error occurred");
    }
  };

  const value: ErrorContextType = {
    showError,
    showSuccess,
    showWarning,
    handleApiError,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};
