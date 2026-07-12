import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { trackingId } = await request.json();
    const apiKey = process.env.TRACKINGMORE_API_KEY;

    if (!apiKey) return NextResponse.json({ error: 'API Key Missing' }, { status: 400 });

    // Step 1: Create/Register tracking number in TrackingMore
    const createRes = await fetch('https://api.trackingmore.com/v4/trackings/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Tracking-Api-Key': apiKey,
      },
      body: JSON.stringify({ tracking_number: trackingId })
    });
    
    let trackData = await createRes.json();

    // Step 2: If the number is already registered (code 4006), fetch its live data directly
    if (trackData.meta?.code === 4006 || trackData.meta?.code === 200) {
      const getRes = await fetch(`https://api.trackingmore.com/v4/trackings/get?tracking_numbers=${trackingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Tracking-Api-Key': apiKey,
        }
      });
      trackData = await getRes.json();
    }

    return NextResponse.json(trackData);
  } catch (error) {
    console.error('Tracking API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}