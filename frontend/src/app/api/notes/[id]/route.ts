import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = request.headers.get('Authorization')

  try {
    const { data } = await axios.get(`${API_URL}/notes/${id}/`, {
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const token = request.headers.get('Authorization')
  const body = await request.json()

  try {
    const { data } = await axios.patch(`${API_URL}/notes/${id}/`, body, {
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const token = request.headers.get('Authorization')

  try {
    await axios.delete(`${API_URL}/notes/${id}/`, {
      headers: token ? { Authorization: token } : {},
    })
    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status })
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
