import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, TrendingUp } from 'lucide-react'
import { Button, Input } from '../components/ui'

function Login() {
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [errors, setErrors]             = useState({})
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!email)             e.email    = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.'
    if (!password)          e.password = 'Password is required.'
    else if (password.length < 6) e.password = 'At least 6 characters.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    setTimeout(() => {
      sessionStorage.setItem('isAuthenticated', 'true')
      navigate('/dashboard')
    }, 800)
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-8 w-full max-w-md animate-fade-in">

        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 mb-3">
            <TrendingUp size={24} className="text-blue-700 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400 tracking-tight">Moody's</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Risk Analytics Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@moodys.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={15} />}
            error={errors.email}
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                <Lock size={15} />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                className={`w-full border rounded-md pl-9 pr-16 py-2 text-sm transition-colors
                  bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
                  ${errors.password
                    ? 'border-red-500'
                    : 'border-neutral-300 dark:border-neutral-600'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.password}</p>
            )}
          </div>

          <Button type="submit" variant="primary" loading={loading} className="mt-1">
            Sign In
          </Button>
        </form>

        <p className="text-xs text-center text-neutral-400 dark:text-neutral-500 mt-6">
          Demo: any email + 6+ char password
        </p>

      </div>
    </div>
  )
}

export default Login
