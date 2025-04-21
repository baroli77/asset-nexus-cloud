
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { AuditEntry } from "@/services/assetService";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { History } from "lucide-react";

interface AssetTimelineProps {
  assetId: string;
  auditEntries: AuditEntry[];
}

const AssetTimeline: React.FC<AssetTimelineProps> = ({ assetId, auditEntries }) => {
  // Filter entries for this asset and sort by timestamp (newest first)
  const filteredEntries = auditEntries
    .filter(entry => entry.assetId === assetId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  const getActionColor = (action: string) => {
    switch (action) {
      case 'Created':
        return 'bg-green-500';
      case 'Updated':
        return 'bg-blue-500';
      case 'Deleted':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <History className="mr-2 h-5 w-5" />
          Asset Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredEntries.length > 0 ? (
          <div className="space-y-8">
            {filteredEntries.map((entry, index) => (
              <div key={entry.id} className="relative pl-6">
                {/* Timeline connector */}
                {index < filteredEntries.length - 1 && (
                  <div className="absolute top-6 left-[11px] h-full w-0.5 bg-muted" />
                )}
                
                {/* Timeline dot */}
                <div 
                  className={`absolute top-1 left-0 h-5 w-5 rounded-full ${getActionColor(entry.action)}`}
                />
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">
                      {format(parseISO(entry.timestamp), 'MMM dd, yyyy')}
                    </span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {format(parseISO(entry.timestamp), 'h:mm a')}
                    </span>
                  </div>
                  
                  <div className="flex items-start">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarFallback>{entry.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <p className="font-medium">{entry.user}</p>
                      <div className="mt-1 flex items-center">
                        <Badge variant="outline" className={`${getActionColor(entry.action)} text-white`}>
                          {entry.action}
                        </Badge>
                        <span className="ml-2">{entry.details}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No history available for this asset.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetTimeline;
