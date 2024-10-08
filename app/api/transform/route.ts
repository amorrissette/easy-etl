// /api/transform.ts
export const maxDuration = 30; // This function can run for a maximum of 30 seconds

import { NextRequest, NextResponse } from 'next/server';
import { transformData } from '../../../components/dataTransformer';

export async function POST(req: NextRequest) {
  try {
    const { csvData, headers } = await req.json();
    
    if (!csvData) {
      return NextResponse.json({ error: 'CSV data is required' }, { status: 400 });
    }

    const result = await transformData(csvData, headers);

    if (result.type === 'success') {
      return NextResponse.json(result.data, { status: 200 });
    } else if (result.type === 'validation-error') {
      return NextResponse.json({ error: 'Validation Error', details: result.value }, { status: 400 });
    } else if (result.type === 'parse-error') {
      return NextResponse.json({ error: 'Parse Error', details: result.text }, { status: 400 });
    } else {
      return NextResponse.json({ error: 'Unknown Error', details: result.error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server Error', details: error }, { status: 500 });
  }
}
