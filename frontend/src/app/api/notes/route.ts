import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')
  const { searchParams } = request.nextUrl

  try {
    const { data } = await axios.get(`${API_URL}/notes/`, {
      headers: token ? { Authorization: token } : {},
      params: Object.fromEntries(searchParams),
    })
    return NextResponse.json(data)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status })
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')
  const body = await request.json()

  try {
    const { data } = await axios.post(`${API_URL}/notes/`, body, {
      headers: token ? { Authorization: token } : {},
    })
    return NextResponse.json(data)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status })
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
