import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')

  try {
    const { data } = await axios.get(`${API_URL}/categories/`, {
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
