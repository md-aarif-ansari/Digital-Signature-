import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Form, Input, Button, Alert, message, Progress } from 'antd'
import { MailOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [strengthColor, setStrengthColor] = useState('#ff4d4f')
  const [strengthText, setStrengthText] = useState('Weak')

  const evaluatePasswordStrength = (pass) => {
    if (!pass) {
      setPasswordStrength(0)
      return
    }
    let score = 0
    if (pass.length >= 6) score += 25
    if (pass.length >= 10) score += 25
    if (/[A-Z]/.test(pass)) score += 25
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 25

    setPasswordStrength(score)
    if (score <= 25) {
      setStrengthColor('#ff4d4f')
      setStrengthText('Weak')
    } else if (score <= 75) {
      setStrengthColor('#faad14')
      setStrengthText('Moderate')
    } else {
      setStrengthColor('#52c41a')
      setStrengthText('Strong')
    }
  }

  const onFinish = async (values) => {
    setError('')
    setLoading(true)
    try {
      await register(values.email, values.password)
      message.success('Account created successfully')
      navigate('/dashboard')
    } catch {
      setError('Registration failed. The email address may already be in use or the backend is offline.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Left Column: Form Section */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 relative z-10 bg-white dark:bg-slate-950 border-r border-slate-200/50 dark:border-slate-800/40">
        <div className="absolute top-6 left-6">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-semibold">
            <ArrowLeftOutlined /> Back to home
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 title-font text-base">
                D
              </div>
              <span className="font-extrabold tracking-wider text-slate-800 dark:text-white title-font text-base">
                DOCSIGN
              </span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white title-font mb-2">
              Create an account
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              Sign up today and start streamlining your signature workflows.
            </p>

            {error && <Alert message={error} type="error" showIcon className="mb-6 rounded-xl" />}

            <Form
              name="register_form"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              size="large"
            >
              <Form.Item
                name="email"
                label={<span className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</span>}
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email address!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-slate-400" />}
                  placeholder="name@company.com"
                  className="h-11 border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</span>}
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-slate-400" />}
                  placeholder="••••••••"
                  className="h-11 border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  onChange={(e) => evaluatePasswordStrength(e.target.value)}
                />
              </Form.Item>

              {/* Password strength indicator UI */}
              {passwordStrength > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Password Strength</span>
                    <span className="text-xs font-bold" style={{ color: strengthColor }}>{strengthText}</span>
                  </div>
                  <Progress
                    percent={passwordStrength}
                    showInfo={false}
                    strokeColor={strengthColor}
                    size="small"
                    className="m-0"
                  />
                </div>
              )}

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full h-11 bg-blue-600 border-none font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700"
                >
                  Create account
                </Button>
              </Form.Item>
            </Form>

            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Premium Visual Section */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-premium relative items-center justify-center p-12 overflow-hidden">
        {/* Subtle grid patterns */}
        <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] -top-32 -right-32" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] -bottom-32 -left-32" />

        <div className="max-w-md w-full relative z-10 text-white flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 rounded-2xl glass-panel shadow-2xl border border-white/5"
          >
            <h3 className="text-2xl font-bold text-white title-font mb-4">
              "We slashed signature request turnaround times by 90%."
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Track the entire lifecycle from draft to signature requests and final execution. Perfect for high-growth operations.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
                M
              </div>
              <div>
                <h4 className="text-sm font-bold text-white m-0">Marcus Vance</h4>
                <p className="text-xs text-slate-400 m-0">Managing Partner, Lex Legal LLC</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Register
