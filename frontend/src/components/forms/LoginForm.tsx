'use client'

import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { login } from '@/lib/api/auth'
import { useAuth } from '@/lib/hooks/useAuth'
import { isValidEmail } from '@/lib/utils/validation'

interface LoginValues {
  email: string
  password: string
}

function validate(values: LoginValues) {
  const errors: Partial<LoginValues> = {}
  if (!values.email) errors.email = 'Email is required'
  else if (!isValidEmail(values.email)) errors.email = 'Invalid email address'
  if (!values.password) errors.password = 'Password is required'
  return errors
}

export function LoginForm() {
  const router = useRouter()
  const { loginUser } = useAuth()

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      loginUser(data.user, data.tokens.access, data.tokens.refresh)
      router.push('/notes')
    },
    onError: () => {
      toast.error('Invalid email or password')
    },
  })

  const formik = useFormik<LoginValues>({
    initialValues: { email: '', password: '' },
    validate,
    onSubmit: (values) => {
      mutation.mutate(values)
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <Input
        id="email"
        type="email"
        placeholder="Email address"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email ? formik.errors.email : undefined}
      />
      <Input
        id="password"
        type="password"
        placeholder="Password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password ? formik.errors.password : undefined}
      />

      {mutation.isError && (
        <p className="text-center text-sm text-red-600">
          {mutation.error instanceof Error
            ? mutation.error.message
            : 'Invalid email or password'}
        </p>
      )}

      <div className="pt-4">
        <Button type="submit" color="honey" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </form>
  )
}
