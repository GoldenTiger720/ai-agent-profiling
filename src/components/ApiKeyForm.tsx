
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { Key } from 'lucide-react';

const ApiKeyForm: React.FC = () => {
  const { apiKey, setApiKey, checkKeyValidity } = useApiKey();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await checkKeyValidity(inputKey);
    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Key className="h-6 w-6 text-primary" />
            <CardTitle>OpenAI API Key Required</CardTitle>
          </div>
          <CardDescription>
            To use FindMyStage.com, please enter your OpenAI API key. Your key will be stored
            locally in your browser and never sent to our servers.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="sk-..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                required
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                <p>You can get your API key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI dashboard</a>.</p>
                <p className="mt-1">Your API key is stored only in your browser's local storage.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Validating...' : 'Save API Key'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ApiKeyForm;
