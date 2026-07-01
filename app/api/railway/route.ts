import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

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
    return NextResponse.json([], { status: 500 });
  }
}