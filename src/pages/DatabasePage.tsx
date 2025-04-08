
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar, Users, Filter, MapPin } from 'lucide-react';
import StageCard from '@/components/StageCard';
import { Badge } from '@/components/ui/badge';

// Mock data for stages/events
const mockStages = [
  {
    id: 1,
    name: "Tech Innovation Summit",
    organizer: "Global Tech Forum",
    date: "June 15-18, 2023",
    location: "San Francisco, CA",
    topics: ["AI", "Digital Transformation", "Future of Work"],
    attendees: 2500,
    description: "Annual conference focusing on the latest technological innovations and their impact on business."
  },
  {
    id: 2,
    name: "Leadership Conference",
    organizer: "Executive Council",
    date: "August 22-24, 2023",
    location: "Chicago, IL",
    topics: ["Leadership", "Management", "Organizational Change"],
    attendees: 1800,
    description: "Premier event for executives and leaders to share insights on effective leadership strategies."
  },
  {
    id: 3,
    name: "Sustainability Forum",
    organizer: "Green Future Initiative",
    date: "September 5-7, 2023",
    location: "Portland, OR",
    topics: ["Sustainability", "Climate Tech", "Corporate Responsibility"],
    attendees: 1200,
    description: "Conference dedicated to sustainable business practices and environmental innovation."
  },
  {
    id: 4,
    name: "Marketing Innovation Conference",
    organizer: "Digital Marketing Association",
    date: "October 12-14, 2023",
    location: "New York, NY",
    topics: ["Digital Marketing", "Customer Experience", "Brand Strategy"],
    attendees: 2200,
    description: "Exploring cutting-edge marketing strategies and technologies for the digital age."
  },
  {
    id: 5,
    name: "Health Tech Expo",
    organizer: "Healthcare Innovations Group",
    date: "November 8-10, 2023",
    location: "Boston, MA",
    topics: ["Health Tech", "Medical Innovation", "Patient Care"],
    attendees: 1600,
    description: "Showcase of technological advancements in healthcare and medical services."
  },
  {
    id: 6,
    name: "Financial Technology Summit",
    organizer: "FinTech Alliance",
    date: "January 18-20, 2024",
    location: "Miami, FL",
    topics: ["FinTech", "Banking", "Cryptocurrency"],
    attendees: 1900,
    description: "Exploring disruptions and innovations in financial services and banking."
  }
];

const DatabasePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStages, setFilteredStages] = useState(mockStages);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // All unique topics from the mock data
  const allTopics = [...new Set(mockStages.flatMap(stage => stage.topics))];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter stages based on search term and selected topics
    const filtered = mockStages.filter(stage => {
      const matchesSearch = searchTerm === '' || 
        stage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stage.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stage.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stage.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTopics = selectedTopics.length === 0 || 
        selectedTopics.some(topic => stage.topics.includes(topic));
      
      return matchesSearch && matchesTopics;
    });
    
    setFilteredStages(filtered);
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic) 
        : [...prev, topic]
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Stage Database</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore speaking opportunities and event organizers from our curated database of stages.
        </p>
      </div>

      <Card className="database-section">
        <CardHeader>
          <CardTitle className="text-xl">Search Speaking Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by event name, organizer, or location"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by topics:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTopics.map(topic => (
                  <Badge 
                    key={topic}
                    variant={selectedTopics.includes(topic) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTopic(topic)}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredStages.length > 0 ? (
          filteredStages.map(stage => (
            <StageCard key={stage.id} stage={stage} />
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-lg text-muted-foreground">No stages found matching your criteria.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchTerm("");
                setSelectedTopics([]);
                setFilteredStages(mockStages);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabasePage;
