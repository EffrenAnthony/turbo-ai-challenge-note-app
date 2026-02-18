'use client'

import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { register } from '@/lib/api/auth'
import { useAuth } from '@/lib/hooks/useAuth'
import { isValidEmail, getPasswordErrors } from '@/lib/utils/validation'

interface RegisterValues {
  email: string
  password: string
}

function validate(values: RegisterValues) {
  const errors: Partial<RegisterValues> = {}
  if (!values.email) errors.email = 'Email is required'
  else if (!isValidEmail(values.email)) errors.email = 'Invalid email address'
  if (!values.password) {
    errors.password = 'Password is required'
  } else {
    const passwordErrors = getPasswordErrors(values.password)
    if (passwordErrors.length > 0) errors.password = passwordErrors[0]
  }
  return errors
}

export function RegisterForm() {
  const router = useRouter()
  const { loginUser } = useAuth()

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      loginUser(data.user, data.tokens.access, data.tokens.refresh)
      router.push('/notes')
    },
    onError: () => {
      toast.error('Registration failed. Please try again.')
    },
  })

  const formik = useFormik<RegisterValues>({
    initialValues: { email: '', password: '' },
    validate,
    onSubmit: (values) => {
      mutation.mutate({ ...values, password_confirm: values.password })
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
            : 'Something went wrong. Please try again.'}
        </p>
      )}

      <div className="pt-4">
        <Button type="submit" color="honey" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating account...' : 'Sign Up'}
        </Button>
      </div>
    </form>
  )
}
