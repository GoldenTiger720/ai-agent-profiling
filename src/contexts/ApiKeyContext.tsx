
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  isKeyValid: boolean;
  checkKeyValidity: (key?: string) => Promise<boolean>;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isKeyValid, setIsKeyValid] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      checkKeyValidity(storedKey);
    }
  }, []);

  const checkKeyValidity = async (key: string = apiKey || ''): Promise<boolean> => {
    if (!key) return false;
    
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });
      
      const valid = response.status === 200;
      setIsKeyValid(valid);
      
      if (valid && key !== apiKey) {
        localStorage.setItem('openai_api_key', key);
        setApiKey(key);
        toast({
          title: "API Key Validated",
          description: "Your OpenAI API key has been successfully validated.",
          variant: "default"
        });
      } else if (!valid) {
        toast({
          title: "Invalid API Key",
          description: "The provided OpenAI API key is invalid.",
          variant: "destructive"
        });
      }
      
      return valid;
    } catch (error) {
      console.error('Error checking API key validity:', error);
      setIsKeyValid(false);
      toast({
        title: "API Key Check Failed",
        description: "Failed to verify your OpenAI API key.",
        variant: "destructive"
      });
      return false;
    }
  };

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
  };

  return (
    <ApiKeyContext.Provider value={{ 
      apiKey, 
      setApiKey: saveApiKey, 
      isKeyValid, 
      checkKeyValidity 
    }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};
