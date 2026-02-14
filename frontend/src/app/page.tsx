import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-24">
      <h1 className="text-4xl font-bold">Notes App</h1>
      <p className="text-lg text-gray-600">Organize your thoughts, one note at a time.</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="rounded-lg border border-gray-300 px-6 py-3 hover:bg-gray-50"
        >
          Register
        </Link>
      </div>
    </main>
  )
}
