import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  type ResObj = {
    sentOtp: string;
  };
  const body: ResObj = await req.json();

  return NextResponse.json({ sentOtp: body.sentOtp });
}

export async function GET(req: NextRequest) {
  const body = await req.json();

  return NextResponse.json(body);
}
