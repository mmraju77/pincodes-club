import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { trackingId } = await request.json();
    const apiKey = process.env.TRACKINGMORE_API_KEY;

    // 1. Check if API Key exists
    if (!apiKey || apiKey === 'TRACKINGMORE_API_KEY=qxb9xubd-obye-p36t-r1bf-5aui5dxijbcg') {
      return NextResponse.json({ 
        error: 'API Key Missing', 
        message: 'Please add your TrackingMore API Key in the .env.local file.' 
      }, { status: 400 });
    }

    // 2. Call the Real TrackingMore API
    const response = await fetch('https://api.trackingmore.com/v4/trackings/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Tracking-Api-Key': apiKey,
      },
      body: JSON.stringify({ tracking_number: trackingId })
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Tracking API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}