import Image from 'next/image'
import Link from 'next/link'
import { RegisterForm } from '@/components/forms/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <Image src="/assets/cat.png" alt="Welcome cat" width={180} height={180} priority />
        <h1 className="mt-4 font-serif text-4xl font-bold text-honey-800">Yay, New Friend!</h1>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-honey-800">
        <Link href="/login" className="underline hover:text-honey-800">
          We&apos;re already friends!
        </Link>
      </p>
    </div>
  )
}
