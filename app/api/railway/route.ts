import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '../../../lib/supabase';

// 🚀 Idi chala important! Idi Vercel 500 error ni aaputhundi
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q')?.trim();

    if (!query) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from('station_codes')
      .select('*')
      .or(`station_name.ilike.%${query}%,station_code.ilike.%${query}%`)
      .order('station_name', { ascending: true })
      .limit(50);

    if (error) {
      console.error("Supabase API Error:", error);
      return NextResponse.json([], { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json([], { status: 500 });
  }
}