"use client";
import { use } from "react";
import Link from 'next/link';
import { MOCK_BRANDS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function BrandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const brand = MOCK_BRANDS.find(b => b.slug === resolvedParams.slug);

  if (!brand) return <div className="p-20 text-center">Brand not found</div>;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="h-64 md:h-80 w-full relative">
        <img src={brand.coverImage} alt={brand.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="container mx-auto px-4 relative h-full">
          <Link href="/brands" className="absolute top-6 left-4 text-white hover:text-white/80 flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Brands
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-6">
            <img src={brand.logo} alt={brand.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" />
            <div>
              <h1 className="text-3xl font-bold mb-2">{brand.name}</h1>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">{brand.industry}</Badge>
                <Badge variant={brand.budgetTier === 'High' ? 'approved' : brand.budgetTier === 'Medium' ? 'under_review' : 'default'}>
                  {brand.budgetTier} Budget
                </Badge>
              </div>
            </div>
          </div>
          <Link href={`/apply/${brand.slug}`}>
            <Button variant="accent" size="lg" className="w-full md:w-auto">Apply for Collaboration</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">About the Campaign</h2>
              <p className="text-text-secondary leading-relaxed">{brand.description}</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Campaign Types</h2>
              <div className="flex gap-3 flex-wrap">
                {brand.campaignTypes.map(type => (
                  <div key={type} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-border text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    {type}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div>
            <div className="bg-gray-50 rounded-xl p-6 border border-border">
              <h3 className="font-bold mb-4">Requirements</h3>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <span>{brand.requirements}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <span>High quality content production</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <span>Exclusive rights for 3 months</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
