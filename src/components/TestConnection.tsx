import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function TestConnection() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await api.get('/test');
      setMessage(response.message);
      toast({
        title: 'Success',
        description: 'Connected to backend successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect to backend',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Button onClick={testConnection} disabled={loading}>
        {loading ? 'Testing...' : 'Test Backend Connection'}
      </Button>
      {message && (
        <p className="mt-4 text-sm text-muted-foreground">
          Response: {message}
        </p>
      )}
    </div>
  );
} 