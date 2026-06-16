import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Button, Card, Space, Avatar, Rate } from 'antd'
import {
  FilePdfOutlined,
  CheckCircleOutlined,
  SecurityScanOutlined,
  ArrowRightOutlined,
  HistoryOutlined,
} from '@ant-design/icons'

const Home = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: <FilePdfOutlined className="text-2xl text-blue-500" />,
      title: 'PDF Document Upload',
      description:
        'Upload contracts, NDAs, and agreements from your local PC or import them directly via custom URL links.',
    },
    {
      icon: <CheckCircleOutlined className="text-2xl text-emerald-500" />,
      title: 'Interactive Coordinate Placing',
      description:
        'Drag and drop signature indicators anywhere on the PDF workspace page, automatically capturing precise X and Y coordinates.',
    },
    {
      icon: <SecurityScanOutlined className="text-2xl text-indigo-500" />,
      title: 'Cryptographic Signing',
      description:
        'Electronically stamp documents with styled cursive signatures, initials, or company stamps matching your branding.',
    },
    {
      icon: <HistoryOutlined className="text-2xl text-amber-500" />,
      title: 'Enterprise Audit Trail',
      description:
        'Track every single sign event, actor email, file state change, and coordinate update with absolute chronological security.',
    },
  ]

  const stats = [
    { value: '10M+', label: 'Documents Signed' },
    { value: '99.99%', label: 'Platform Uptime' },
    { value: '250k+', label: 'Global Active Signers' },
    { value: '< 2s', label: 'PDF Generation Speed' },
  ]

  const testimonials = [
    {
      quote: 'DocSign has completely transformed our contract workflows. What used to take days now takes minutes, and the audit logs are incredibly thorough.',
      author: 'Sarah Jenkins',
      role: 'Operations VP, FinTech Inc.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
      rating: 5,
    },
    {
      quote: 'The visual PDF workspace is highly intuitive. Dragging signature pins onto precise page fields makes signing painless for our clients.',
      author: 'Marcus Vance',
      role: 'Managing Partner, Lex Legal LLC',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
      rating: 5,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Dynamic Navigation Bar for Landing Page */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 title-font text-lg">
            D
          </div>
          <span className="font-extrabold tracking-wider text-slate-800 dark:text-white title-font text-lg">
            DOCSIGN
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button type="primary">Open Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button type="text" className="font-semibold text-slate-600 dark:text-slate-300">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button type="primary">Get Started Free</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 flex flex-col items-center justify-center text-center max-w-5xl mx-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
            Digital Document Workflow
          </span>
          <h1 className="mt-6 font-extrabold text-4xl md:text-6xl tracking-tight text-slate-900 dark:text-white title-font leading-[1.1]">
            Every tool you need to <span className="text-blue-600">sign PDFs</span> faster
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Upload, sign, and track enterprise documents using your secure Spring Boot backend. Built for legal approvals, complete auditability, and fast signatures.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to={isAuthenticated ? '/upload' : '/register'}>
              <Button type="primary" size="large" className="h-12 px-8 font-semibold text-sm shadow-xl shadow-blue-500/20">
                {isAuthenticated ? 'Start Signing Now' : 'Get Started Free'} <ArrowRightOutlined />
              </Button>
            </Link>
            <Link to={isAuthenticated ? '/dashboard' : '/login'}>
              <Button size="large" className="h-12 px-8 font-semibold text-sm dark:bg-slate-900 dark:border-slate-800">
                {isAuthenticated ? 'Open Dashboard' : 'I already have an account'}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-white dark:bg-slate-900 border-y border-slate-200/60 dark:border-slate-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white title-font tracking-tight">
              Enterprise features, developer simplicity
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg">
              Manage the complete document lifecycle with secure encryption, coordinate placements, and real-time logs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 h-full">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="text-center p-6 bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/40"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-blue-600 dark:text-blue-400 title-font">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 bg-slate-100 dark:bg-slate-900/40 border-t border-slate-200/60 dark:border-slate-800/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white title-font tracking-tight">
              Loved by operations teams
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg">
              Hear from administrative directors, legal leaders, and engineering teams.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <Card key={t.author} className="shadow-lg border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <Rate disabled defaultValue={t.rating} className="text-amber-500 text-sm mb-4" />
                    <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed mb-6">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-auto">
                    <Avatar src={t.avatar} size="large" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 m-0">
                        {t.author}
                      </h4>
                      <p className="text-xs text-slate-400 m-0">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-premium p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold title-font tracking-tight text-white">
              Ready to secure your PDF workflows?
            </h2>
            <p className="mt-4 text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Experience the premium, developer-first signature engine today. Integrates seamlessly with Spring Boot security.
            </p>
            <div className="mt-8 flex justify-center">
              <Link to={isAuthenticated ? '/dashboard' : '/register'}>
                <Button type="primary" size="large" className="h-12 px-8 font-semibold bg-blue-600 border-none shadow-lg">
                  {isAuthenticated ? 'Open Dashboard' : 'Get Started Free Now'}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-slate-950 text-slate-400 border-t border-slate-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4 text-white">
              <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center font-bold text-xs">
                D
              </div>
              <span className="font-extrabold tracking-wider title-font text-sm">
                DOCSIGN
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Secure digital signature systems. Redesigned frontend with Tailwind and Ant Design, backed by robust Spring Boot APIs.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Product</h4>
            <ul className="flex flex-col gap-2.5 text-xs list-none p-0">
              <li><Link to="/sign" className="hover:text-white transition-colors">Sign PDFs</Link></li>
              <li><Link to="/upload" className="hover:text-white transition-colors">Upload Documents</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Audit Trails</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Security</h4>
            <ul className="flex flex-col gap-2.5 text-xs list-none p-0">
              <li><span className="hover:text-white cursor-pointer transition-colors">JWT Encryption</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">MySQL Datastores</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Secure Signatures</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Newsletter</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Subscribe to get updates on new workflow modules and signature options.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="bg-slate-900 border border-slate-800 text-xs px-3 py-1.5 rounded-lg text-slate-300 w-full focus:outline-none focus:border-blue-500"
              />
              <Button type="primary" size="small" className="h-8">Join</Button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 border-t border-slate-900 flex flex-wrap justify-between items-center text-xs text-slate-600">
          <span>&copy; {new Date().getFullYear()} DocSign Systems. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
