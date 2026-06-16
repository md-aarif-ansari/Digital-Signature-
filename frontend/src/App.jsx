import { Navigate, Route, Routes } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import AppLayout from './components/AppLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Documents from './pages/Documents'
import SignRequests from './pages/SignRequests'
import SignDocument from './pages/SignDocument'
import AuditLogs from './pages/AuditLogs'
import Profile from './pages/Profile'

const App = () => {
  return (
    <Routes>
      {/* Public landing and authentication pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private workspace layout pages */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <PrivateRoute>
            <AppLayout>
              <Documents />
            </AppLayout>
          </PrivateRoute>
        }
      />
      {/* Retain support for old upload path */}
      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <AppLayout>
              <Documents />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/sign-requests"
        element={
          <PrivateRoute>
            <AppLayout>
              <SignRequests />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/sign"
        element={
          <PrivateRoute>
            <AppLayout>
              <SignDocument />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/audit-logs"
        element={
          <PrivateRoute>
            <AppLayout>
              <AuditLogs />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </PrivateRoute>
        }
      />

      {/* Fallback route redirection */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
