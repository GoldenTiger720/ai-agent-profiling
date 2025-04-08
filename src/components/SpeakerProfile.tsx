
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Download, UserCheck, MessageSquare, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface ProfileData {
  topics: string[];
  personality: string[];
  summary: string;
  isLoading?: boolean;
  error?: string;
}

interface SpeakerProfileProps {
  data: ProfileData;
}

const SpeakerProfile: React.FC<SpeakerProfileProps> = ({ data }) => {
  if (data.isLoading) {
    return (
      <div className="space-y-6">
        <Card className="output-section">
          <CardHeader>
            <CardTitle className="text-center text-xl">Generating Speaker Profile...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-muted-foreground">
              Our AI is analyzing your content and creating a comprehensive speaker profile.
              This may take a minute or two.
            </p>
            <Progress value={45} className="w-full max-w-md mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-center text-xl text-destructive">Analysis Failed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-muted-foreground">{data.error}</p>
            <Button variant="destructive">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="output-section">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl">Speaker Profile</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Share2 className="h-3.5 w-3.5 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Download className="h-3.5 w-3.5 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Speaker Summary</h3>
            <p>{data.summary}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-findmystage-purple" />
                Topic Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.topics.map((topic, index) => (
                  <Badge key={index} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-findmystage-purple" />
                Personality Traits
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.personality.map((trait, index) => (
                  <Badge key={index} variant="outline">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="agent-section">
        <CardHeader>
          <CardTitle className="text-xl">Speaking Opportunities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="matches">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="matches">Recommended Matches</TabsTrigger>
              <TabsTrigger value="outreach">Outreach Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="matches" className="space-y-4 pt-4">
              <p className="text-muted-foreground">
                Based on your profile, here are speaking opportunities that would be a good fit:
              </p>
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-medium">Tech Innovation Summit</h4>
                        <p className="text-sm text-muted-foreground">San Francisco, CA • June 15-18, 2023</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">AI Ethics</Badge>
                          <Badge variant="outline" className="text-xs">Technology Policy</Badge>
                        </div>
                      </div>
                      <Button size="sm" className="mt-2 md:mt-0">
                        <Mail className="h-3.5 w-3.5 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-medium">Digital Transformation Conference</h4>
                        <p className="text-sm text-muted-foreground">New York, NY • August 8-10, 2023</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">Future of Work</Badge>
                          <Badge variant="outline" className="text-xs">Digital Transformation</Badge>
                        </div>
                      </div>
                      <Button size="sm" className="mt-2 md:mt-0">
                        <Mail className="h-3.5 w-3.5 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="outreach" className="space-y-4 pt-4">
              <p className="text-muted-foreground">
                Customized email templates for reaching out to event organizers:
              </p>
              <Card className="border-dashed">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Event Outreach Template</h4>
                  <p className="text-sm whitespace-pre-line">
                    {`Subject: Speaking Opportunity Inquiry for [Event Name]

Dear [Organizer Name],

I hope this email finds you well. My name is [Your Name], and I am an expert in ${data.topics.slice(0, 3).join(', ')}.

I recently came across the [Event Name] and am very interested in the possibility of speaking at your event. My background includes extensive experience in ${data.topics[0]} and ${data.topics[1]}, which I believe would resonate well with your audience.

I would love to discuss how I can contribute to your event with a presentation on [Specific Topic]. I've attached my speaker profile for your review.

Would you be available for a brief call to discuss this opportunity further?

Looking forward to your response.

Best regards,
[Your Name]`}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <Button size="sm" variant="outline">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Copy Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeakerProfile;
