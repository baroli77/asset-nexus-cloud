import React, { useState, useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
  link?: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      const demoNotifications: Notification[] = [
        {
          id: '1',
          title: 'Maintenance Alert',
          message: 'Office Printer needs maintenance',
          type: 'warning',
          timestamp: new Date().toISOString(),
          read: false,
          link: '/assets/3'
        },
        {
          id: '2',
          title: 'New Asset Added',
          message: 'Dell XPS 15 Laptop has been added to inventory',
          type: 'info',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: true,
          link: '/assets/1'
        },
        {
          id: '3',
          title: 'Asset Checkout',
          message: 'John Doe has checked out Office Desk',
          type: 'info',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          read: false,
          link: '/assets/2'
        }
      ];
      
      setNotifications(demoNotifications);
      localStorage.setItem('notifications', JSON.stringify(demoNotifications));
    }
  }, []);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };
  
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };
  
  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem('notifications', JSON.stringify([]));
  };
  
  window.addNotification = (
    title: string, 
    message: string, 
    type: 'info' | 'warning' | 'error' | 'success', 
    link?: string
  ) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      link
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    return newNotification.id;
  };
  
  const getNotificationTypeStyles = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[380px] sm:w-[540px] pr-0">
        <SheetHeader className="pr-6">
          <SheetTitle className="flex justify-between items-center">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        
        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="all" className="flex-1">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              Unread ({unreadCount})
            </TabsTrigger>
          </TabsList>
          
          <div className="pr-6">
            <TabsContent value="all">
              <ScrollArea className="h-[500px]">
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border rounded-md cursor-pointer transition-colors ${
                          notification.read 
                            ? 'bg-background border-border' 
                            : getNotificationTypeStyles(notification.type)
                        }`}
                        onClick={() => {
                          markAsRead(notification.id);
                          if (notification.link) {
                            window.location.href = notification.link;
                          }
                          setOpen(false);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{notification.title}</h4>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <Badge variant="outline" className="text-xs">New</Badge>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <span className="sr-only">Delete</span>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(notification.timestamp), 'MMM dd, h:mm a')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No notifications
                  </div>
                )}
              </ScrollArea>
              
              {notifications.length > 0 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm" onClick={clearAllNotifications}>
                    Clear All
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="unread">
              <ScrollArea className="h-[500px]">
                {unreadCount > 0 ? (
                  <div className="space-y-4">
                    {notifications
                      .filter(notification => !notification.read)
                      .map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-4 border rounded-md cursor-pointer ${
                            getNotificationTypeStyles(notification.type)
                          }`}
                          onClick={() => {
                            markAsRead(notification.id);
                            if (notification.link) {
                              window.location.href = notification.link;
                            }
                            setOpen(false);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{notification.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">New</Badge>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <span className="sr-only">Delete</span>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {format(new Date(notification.timestamp), 'MMM dd, h:mm a')}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No unread notifications
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

declare global {
  interface Window {
    addNotification: (
      title: string, 
      message: string, 
      type: 'info' | 'warning' | 'error' | 'success', 
      link?: string
    ) => string;
  }
}

export default NotificationCenter;
