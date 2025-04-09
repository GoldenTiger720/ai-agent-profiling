import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CaseStudyCardProps {
  imageSrc: string;
  quote: string;
  name: string;
  title: string;
}

const CaseStudyCard = ({
  imageSrc,
  quote,
  name,
  title,
}: CaseStudyCardProps) => {
  return (
    <Card className="h-full bg-card rounded-xl border overflow-hidden flex flex-col">
      <div className="h-60 overflow-hidden bg-muted">
        <img
          src={imageSrc}
          alt={`Portrait of ${name}`}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="flex-1 p-6 flex flex-col">
        <p className="text-base mb-4 flex-1">"{quote}"</p>

        <div className="mt-auto">
          <Separator className="my-4 w-20 h-0.5 bg-findmystage-green" />
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm text-findmystage-green">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseStudyCard;
