
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, User, FileText, History } from "lucide-react";
import { Asset, AuditEntry } from "@/services/assetService";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface AssetDetailViewProps {
  asset: Asset;
  auditLog: AuditEntry[];
}

const AssetDetailView: React.FC<AssetDetailViewProps> = ({ asset, auditLog = [] }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{asset.name}</CardTitle>
              <CardDescription>ID: {asset.id}</CardDescription>
            </div>
            <Badge 
              variant={asset.status === "In Use" ? "default" : 
                      asset.status === "Under Repair" ? "destructive" : "secondary"}
            >
              {asset.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="docs">Documents</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Category:</span>
                    <span className="ml-2">{asset.category}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Purchase Date:</span>
                    <span className="ml-2">{asset.purchaseDate || "N/A"}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Purchase Price:</span>
                    <span className="ml-2">{asset.purchasePrice ? `$${asset.purchasePrice}` : "N/A"}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Assigned To:</span>
                    <span className="ml-2">{asset.assignedTo || "Unassigned"}</span>
                  </div>
                  
                  <div className="flex items-start">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <span className="font-medium">Notes:</span>
                      <p className="mt-1">{asset.notes || "No notes"}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {asset.customFields && Object.keys(asset.customFields).length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Custom Fields</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(asset.customFields).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <span className="font-medium">{key.replace(/_/g, ' ')}:</span>
                        <span className="ml-2">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Asset History</h3>
                
                {auditLog.length > 0 ? (
                  <div className="space-y-3">
                    {auditLog.map(entry => (
                      <div key={entry.id} className="flex items-start border-b pb-3">
                        <Avatar className="mr-3 mt-1">
                          <AvatarFallback>{entry.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{entry.user}</span>
                            <span className="mx-2 text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(entry.timestamp), 'MMM dd, yyyy h:mm a')}
                            </span>
                          </div>
                          <p className="mt-1">
                            <Badge variant="outline" className="mr-2">
                              {entry.action}
                            </Badge>
                            {entry.details}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No history available for this asset.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="docs" className="pt-4">
              <div className="text-center p-6">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">No documents attached</h3>
                <p className="text-muted-foreground">Upload documentation for this asset</p>
                <Button className="mt-4">Upload Document</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="maintenance" className="pt-4">
              <div className="text-center p-6">
                <History className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">Maintenance Records</h3>
                <p className="text-muted-foreground">No maintenance records found</p>
                <Button className="mt-4">Schedule Maintenance</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetDetailView;
