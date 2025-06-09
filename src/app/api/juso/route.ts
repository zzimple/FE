import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const page = searchParams.get('page') || '1';
  if (keyword) return  NextResponse.json({error: 'keyword is required'}, {state: 400});

  const confmkey = process.env.JUSO_API_KEY;
  const url = 
  `https://www.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${confmKey}` +
  `&currentPage=${page}&countPerPage=10&keyword=${encodeURIComponent(keyword)}` +
    `&resultType=json`;
  
  try {
    const response = await axios.get(url);
    const result = response.data.results;
    return NextResponse.json(results);
  }
}