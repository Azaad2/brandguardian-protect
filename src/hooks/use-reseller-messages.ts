
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

export type Message = {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  type: string;
  status: string;
  unread: boolean;
};

export const useResellerMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const fetchMessages = async () => {
    if (!user) throw new Error('User not authenticated');
    
    // Fetch messages where user is either sender or recipient
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        is_read,
        created_at,
        sender:sender_id(id, full_name, company_name),
        recipient:recipient_id(id, full_name, company_name)
      `)
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform message data to match our component needs
    return data.map(message => {
      // Determine if user is sender or recipient
      const isSender = message.sender.id === user.id;
      const otherParty = isSender ? message.recipient : message.sender;
      
      // Extract first part of content as subject and the rest as preview
      const contentParts = message.content.split('\n');
      const subject = contentParts[0] || 'No Subject';
      const preview = contentParts.slice(1).join(' ').substring(0, 100) + '...';
      
      // Determine message type based on content keywords
      let type = 'standard';
      if (message.content.toLowerCase().includes('application')) type = 'application';
      else if (message.content.toLowerCase().includes('policy')) type = 'policy';
      else if (message.content.toLowerCase().includes('promotion')) type = 'promotion';
      else if (message.content.toLowerCase().includes('recommend')) type = 'recommendation';
      else if (message.content.toLowerCase().includes('compliance')) type = 'compliance';
      else if (message.content.toLowerCase().includes('inventory')) type = 'inventory';
      
      // Determine status based on content keywords
      let status = 'standard';
      if (message.content.toLowerCase().includes('approved')) status = 'approved';
      else if (message.content.toLowerCase().includes('important')) status = 'important';
      else if (message.content.toLowerCase().includes('action required') || 
               message.content.toLowerCase().includes('warning')) {
        status = 'warning';
      }
      
      return {
        id: message.id,
        sender: otherParty.company_name || otherParty.full_name || 'Unknown',
        subject: subject,
        preview: preview,
        timestamp: formatTimestamp(message.created_at),
        type: type,
        status: status,
        unread: !message.is_read
      };
    });
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const {
    data: messages,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['resellerMessages', user?.id],
    queryFn: fetchMessages,
    enabled: !!user,
    staleTime: 30000 // 30 seconds
  });
  
  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `or(sender_id.eq.${user.id},recipient_id.eq.${user.id})`
      }, () => {
        refetch();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);
  
  return {
    messages: messages || [],
    isLoading,
    isError,
    error,
    refetch
  };
};
