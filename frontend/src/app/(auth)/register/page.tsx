import Link from 'next/link'
import { RegisterForm } from '@/components/forms/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="mt-2 text-gray-600">Get started with Notes App</p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  )
}
