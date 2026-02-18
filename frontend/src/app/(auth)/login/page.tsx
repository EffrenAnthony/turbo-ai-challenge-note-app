import Image from 'next/image'
import Link from 'next/link'
import { LoginForm } from '@/components/forms/LoginForm'

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <Image src="/assets/plant.png" alt="Welcome plant" width={180} height={180} priority />
        <h1 className="mt-4 font-serif text-4xl font-bold text-honey-800">
          Yay, You&apos;re Back!
        </h1>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-honey-800">
        <Link href="/register" className="underline hover:text-honey-800">
          Oops! I&apos;ve never been here before
        </Link>
      </p>
    </div>
  )
}
