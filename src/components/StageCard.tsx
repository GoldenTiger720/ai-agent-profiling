
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Stage {
  id: number;
  name: string;
  organizer: string;
  date: string;
  location: string;
  topics: string[];
  attendees: number;
  description: string;
}

interface StageCardProps {
  stage: Stage;
}

const StageCard: React.FC<StageCardProps> = ({ stage }) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{stage.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{stage.organizer}</p>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-findmystage-blue" />
            <span>{stage.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-findmystage-pink" />
            <span>{stage.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-findmystage-purple" />
            <span>{stage.attendees.toLocaleString()} attendees</span>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="text-sm font-medium mb-2">Topics:</h4>
          <div className="flex flex-wrap gap-1">
            {stage.topics.map((topic, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">{stage.description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full gap-1">
          <ExternalLink className="h-3.5 w-3.5" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StageCard;
