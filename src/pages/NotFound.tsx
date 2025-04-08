
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-6 max-w-md">
        <h1 className="text-9xl font-bold text-findmystage-blue">404</h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link to="/">
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
