import { NextRequest, NextResponse } from 'next/server';
import { analyzeCompetitorPair } from '@/lib/instagram-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandHandle, competitorHandle } = body;

    if (!brandHandle || !competitorHandle) {
      return NextResponse.json(
        {
          success: false,
          error: 'Both brandHandle and competitorHandle are required.',
        },
        { status: 400 }
      );
    }

    const benchmarkData = analyzeCompetitorPair(brandHandle, competitorHandle);

    return NextResponse.json({
      success: true,
      data: benchmarkData,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to analyze competitor profile.',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get('brand') || 'britannia';
  const competitor = searchParams.get('competitor') || 'parle';

  const benchmarkData = analyzeCompetitorPair(brand, competitor);

  return NextResponse.json({
    success: true,
    data: benchmarkData,
    analyzedAt: new Date().toISOString(),
  });
}
