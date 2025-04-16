
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Calendar, User, Package, FileText } from "lucide-react";
import { getAuditLogs, type AuditEntry } from "@/services/assetService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const AuditLog = () => {
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Load audit logs from localStorage
      const logs = getAuditLogs();
      setAuditLogs(logs);
      
      // For debugging
      console.log("Loaded audit logs:", logs);
    } catch (error) {
      console.error("Error loading audit logs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Created':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Updated':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Deleted':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
            <p className="text-muted-foreground">
              Track all changes made to assets across your organization
            </p>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <History className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Asset Activity History</CardTitle>
              <CardDescription>
                View all changes made to assets across your organization
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The audit log tracks all changes made to assets, including creation, updates, and deletions.
              Each action is recorded with the user who performed it, the date and time, and the specific changes made.
            </p>
            
            {loading ? (
              <div className="text-center py-8 border rounded-md bg-muted/10">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-2 animate-spin" />
                <p className="text-muted-foreground">Loading audit logs...</p>
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-8 border rounded-md bg-muted/10">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No activity has been recorded yet.</p>
                <p className="text-sm text-muted-foreground">Create, update, or delete assets to see entries here.</p>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <span 
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getActionColor(log.action)}`}
                          >
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{log.assetName}</span>
                            <span className="text-xs text-muted-foreground ml-2">({log.assetId})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{log.user}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{format(new Date(log.timestamp), 'MMM d, yyyy HH:mm')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{log.details}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AuditLog;
