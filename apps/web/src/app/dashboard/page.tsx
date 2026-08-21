"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_APPLICATIONS } from '@/lib/mock-data';
import Link from 'next/link';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('applications');

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Creator Dashboard</h1>
          <p className="text-text-secondary">Manage your profile and applications.</p>
        </div>
        <Link href="/dashboard/profile">
          <Button variant="outline">Edit Profile</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Applications', value: 12, color: 'text-primary' },
          { label: 'Approved', value: 5, color: 'text-success' },
          { label: 'Pending', value: 4, color: 'text-warning' },
          { label: 'Rejected', value: 3, color: 'text-error' }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-text-secondary mb-2">{stat.label}</p>
              <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="border-b">
          <h2 className="font-bold text-lg">My Applications</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-text-secondary">
                <tr>
                  <th className="px-6 py-4 font-medium">Brand</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Applied On</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MOCK_APPLICATIONS.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-primary">{app.brandName}</td>
                    <td className="px-6 py-4">
                      <Badge variant={app.status as any}>{app.status.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{app.date}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
