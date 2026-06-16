import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Form, Input, Button, Checkbox, Alert, Modal, message } from 'antd'
import { MailOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Forgot password UI toggle
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  const onFinish = async (values) => {
    setError('')
    setLoading(true)
    try {
      await login(values.email, values.password)
      message.success('Successfully logged in')
      navigate('/dashboard')
    } catch {
      setError('Login failed. Please check credentials and ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotSubmit = (e) => {
    e.preventDefault()
    if (!forgotEmail) {
      message.error('Please enter your email')
      return
    }
    setForgotLoading(true)
    setTimeout(() => {
      setForgotLoading(false)
      setForgotOpen(false)
      Modal.success({
        title: 'Reset link sent',
        content: `A password reset link has been dispatched to ${forgotEmail}. Please check your inbox.`,
        okText: 'Done',
      })
      setForgotEmail('')
    }, 1500)
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
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              Enter your credentials to access your document signing workspace.
            </p>

            {error && <Alert message={error} type="error" showIcon className="mb-6 rounded-xl" />}

            <Form
              name="login_form"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              initialValues={{ remember: true }}
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
                label={
                  <div className="flex justify-between items-center w-full">
                    <span className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</span>
                    <button
                      type="button"
                      className="text-xs font-semibold text-blue-600 hover:underline"
                      onClick={() => setForgotOpen(true)}
                    >
                      Forgot password?
                    </button>
                  </div>
                }
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-slate-400" />}
                  placeholder="••••••••"
                  className="h-11 border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </Form.Item>

              <div className="flex items-center justify-between mb-6">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-xs text-slate-500 dark:text-slate-400">Remember me for 30 days</Checkbox>
                </Form.Item>
              </div>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full h-11 bg-blue-600 border-none font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700"
                >
                  Log in to account
                </Button>
              </Form.Item>
            </Form>

            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:underline">
                Create free account
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
              "The speed and legal traceability of DocSign is incredible."
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Place signature fields dynamically by tracking precise PDF coordinates. Sign, initials, and stamp documents securely.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                S
              </div>
              <div>
                <h4 className="text-sm font-bold text-white m-0">Sarah Jenkins</h4>
                <p className="text-xs text-slate-400 m-0">VP of Operations, FinTech Corp</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Forgot Password Modal UI */}
      <Modal
        title={null}
        open={forgotOpen}
        onCancel={() => setForgotOpen(false)}
        footer={null}
        width={400}
        centered
        bodyStyle={{ padding: '24px' }}
      >
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Forgot Password</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Provide your account email below. If a corresponding record exists, we will deliver a secure reset link.
          </p>
        </div>
        <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</span>
            <Input
              prefix={<MailOutlined className="text-slate-400" />}
              placeholder="name@company.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="h-11 border-slate-200 dark:border-slate-800 dark:bg-slate-900"
              required
            />
          </div>
          <Button
            type="primary"
            htmlType="submit"
            loading={forgotLoading}
            className="h-11 bg-blue-600 border-none font-semibold w-full"
          >
            Send recovery link
          </Button>
        </form>
      </Modal>
    </div>
  )
}

export default Login
