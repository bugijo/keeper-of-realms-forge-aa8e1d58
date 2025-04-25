
import React from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  X,
  MessageCircle,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NotificationsDropdown: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle size={16} className="text-blue-400" />;
      case 'session_update':
        return <Calendar size={16} className="text-green-400" />;
      case 'table_request':
        return <AlertCircle size={16} className="text-yellow-400" />;
      default:
        return <Bell size={16} className="text-fantasy-stone" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM, HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-2">
          <Bell size={20} className="text-fantasy-stone" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-fantasy-dark border-fantasy-purple/30">
        <DropdownMenuLabel className="font-medievalsharp text-fantasy-gold flex justify-between items-center">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="h-7 text-xs hover:text-fantasy-gold"
            >
              <Check size={14} className="mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-fantasy-stone text-sm">
              <Bell size={24} className="mx-auto mb-2 opacity-50" />
              <p>Nenhuma notificação</p>
            </div>
          ) : (
            <DropdownMenuGroup>
              {notifications.map(notification => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className={`p-3 flex flex-col items-start gap-1 hover:bg-fantasy-purple/10 ${
                    !notification.read ? 'bg-fantasy-purple/5' : ''
                  }`}
                >
                  <div className="w-full flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type)}
                      <span className="font-semibold text-sm">
                        {notification.title}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Check size={14} />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  {notification.content && (
                    <p className="text-xs text-fantasy-stone pl-6">
                      {notification.content}
                    </p>
                  )}
                  <div className="w-full flex justify-between items-center pl-6">
                    <span className="text-xs text-fantasy-stone/70">
                      {formatDate(notification.created_at)}
                    </span>
                    {notification.reference_id && notification.reference_type === 'table' && (
                      <Link 
                        to={`/tables/${notification.reference_id}`}
                        className="text-xs text-fantasy-purple hover:text-fantasy-gold"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!notification.read) {
                            markAsRead(notification.id);
                          }
                        }}
                      >
                        Ver detalhes
                      </Link>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
