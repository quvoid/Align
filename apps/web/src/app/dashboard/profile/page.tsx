"use client";
import { useToast } from '@/components/ui/toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function ProfilePage() {
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Profile Updated', type: 'success' });
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold text-primary mb-8">Edit Profile</h1>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">Basic Info</h3>
              <Textarea label="Bio" placeholder="Tell brands about yourself..." />
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">Instagram Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <input className="border p-2 rounded" placeholder="Followers" type="number" />
                <input className="border p-2 rounded" placeholder="Engagement Rate (%)" type="number" step="0.1" />
              </div>
            </div>
            <Button type="submit" variant="primary">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
