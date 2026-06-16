import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, Dropdown, Drawer, Badge, Breadcrumb, Avatar, Input, Tooltip } from 'antd'
import {
  DashboardOutlined,
  FileTextOutlined,
  FileProtectOutlined,
  EditOutlined,
  HistoryOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  BellOutlined,
  SearchOutlined,
  SunOutlined,
  MoonOutlined,
  LockOutlined,
} from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useAppTheme } from '../context/ThemeContext'
import CommandPalette from './CommandPalette'

const { Header, Sider, Content } = Layout

const AppLayout = ({ children }) => {
  const { userEmail, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useAppTheme()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [collapsed, setCollapsed] = useState(false)
  const [mobileVisible, setMobileVisible] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New signature request from client@partner.com', time: '10 mins ago', unread: true },
    { id: 2, text: 'Document "Contract_Final.pdf" has been signed by you', time: '1 hour ago', unread: true },
    { id: 3, text: 'System backup completed successfully', time: '1 day ago', unread: false },
  ])

  // Clear unread notifications helper
  const unreadCount = notifications.filter(n => n.unread).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  // Handle keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/documents', icon: <FileTextOutlined />, label: 'Documents' },
    { key: '/sign-requests', icon: <FileProtectOutlined />, label: 'Sign Requests' },
    { key: '/sign', icon: <EditOutlined />, label: 'Sign PDF' },
    { key: '/audit-logs', icon: <HistoryOutlined />, label: 'Audit Logs' },
    { key: '/profile', icon: <UserOutlined />, label: 'Profile' },
  ]

  // Breadcrumb computing
  const getBreadcrumbs = () => {
    const pathSnippets = location.pathname.split('/').filter((i) => i)
    return [
      <Breadcrumb.Item key="home">
        <Link to="/dashboard">DocSign</Link>
      </Breadcrumb.Item>,
      ...pathSnippets.map((snippet, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
        const label = snippet.charAt(0).toUpperCase() + snippet.slice(1).replace('-', ' ')
        return (
          <Breadcrumb.Item key={url}>
            <Link to={url}>{label}</Link>
          </Breadcrumb.Item>
        )
      })
    ]
  }

  const profileMenu = (
    <div className="w-56 p-2 rounded-xl glass-panel shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">Logged in as</div>
        <div className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">{userEmail}</div>
      </div>
      <Menu
        selectable={false}
        onClick={({ key }) => {
          if (key === 'logout') handleLogout()
          else navigate(key)
        }}
        items={[
          { key: '/profile', icon: <UserOutlined />, label: 'My Profile' },
          { key: '/profile#security', icon: <LockOutlined />, label: 'Security' },
          { type: 'divider' },
          { key: 'logout', icon: <LogoutOutlined className="text-rose-500" />, label: <span className="text-rose-500 font-medium">Log out</span> }
        ]}
      />
    </div>
  )

  const sideMenuNode = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30 title-font text-lg">
          D
        </div>
        {!collapsed && (
          <span className="font-extrabold tracking-wider text-white title-font text-lg">
            DOCSIGN
          </span>
        )}
      </div>
      <div className="flex-1 py-4 overflow-y-auto">
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => {
            navigate(key)
            setMobileVisible(false)
          }}
          items={menuItems}
        />
      </div>
      <div className="p-4 border-t border-slate-800 flex items-center justify-between">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <Avatar size="small" style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
            <div className="text-xs truncate max-w-[120px] text-slate-400 font-medium">
              {userEmail ? userEmail.split('@')[0] : 'User'}
            </div>
          </div>
        ) : (
          <Avatar size="small" style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
        )}
        {!collapsed && (
          <Button
            type="text"
            icon={<LogoutOutlined className="text-slate-400 hover:text-rose-500" />}
            onClick={handleLogout}
          />
        )}
      </div>
    </div>
  )

  return (
    <Layout className="min-h-screen">
      {/* Desktop Sider */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        collapsedWidth={80}
        className="desktop-sidebar border-r border-slate-200 dark:border-slate-800 shadow-xl relative z-30"
        style={{
          background: '#0f172a',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {sideMenuNode}
      </Sider>

      {/* Main Shell */}
      <Layout 
        className="transition-layout" 
        style={{ 
          marginLeft: collapsed ? 80 : 240, 
          minHeight: '100vh',
        }}
      >
        {/* Top Navbar */}
        <Header className="h-16 px-6 glass-panel border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20 bg-white/70 dark:bg-slate-950/70">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => {
                // Toggle collapsed on desktop, drawer on mobile
                if (window.innerWidth <= 768) {
                  setMobileVisible(true)
                } else {
                  setCollapsed(!collapsed)
                }
              }}
              className="text-slate-600 dark:text-slate-300"
            />
            
            {/* Search command trigger bar */}
            <div 
              className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900 cursor-pointer text-slate-400 text-xs w-64 transition-colors"
              onClick={() => setPaletteOpen(true)}
            >
              <SearchOutlined className="text-slate-400" />
              <span>Search or type a command...</span>
              <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 font-semibold border border-slate-300 dark:border-slate-700">
                Ctrl K
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Global Search Shortcut Tooltip */}
            <Tooltip title="Search & Actions (Ctrl+K)">
              <Button 
                type="text" 
                icon={<SearchOutlined />} 
                onClick={() => setPaletteOpen(true)}
                className="sm:hidden text-slate-600 dark:text-slate-300"
              />
            </Tooltip>

            {/* Dark/Light Toggle */}
            <Button
              type="text"
              icon={isDarkMode ? <SunOutlined className="text-amber-500" /> : <MoonOutlined className="text-indigo-600" />}
              onClick={toggleTheme}
            />

            {/* Notification Bell */}
            <Badge count={unreadCount} overflowCount={9} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => setNotificationOpen(true)}
                className="text-slate-600 dark:text-slate-300"
              />
            </Badge>

            {/* Profile Dropdown */}
            <Dropdown dropdownRender={() => profileMenu} placement="bottomRight" trigger={['click']}>
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity">
                <Avatar style={{ backgroundColor: '#1677FF' }} icon={<UserOutlined />} />
                <span className="hidden md:inline text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {userEmail ? userEmail.split('@')[0] : 'User'}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content Panel */}
        <Content className="p-6 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Breadcrumb separator=">">
              {getBreadcrumbs()}
            </Breadcrumb>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </Content>
      </Layout>

      {/* Mobile Menu Drawer */}
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setMobileVisible(false)}
        open={mobileVisible}
        bodyStyle={{ padding: 0 }}
        width={240}
      >
        {sideMenuNode}
      </Drawer>

      {/* Notifications Drawer */}
      <Drawer
        title={
          <div className="flex justify-between items-center w-full pr-4">
            <span className="font-semibold text-slate-800 dark:text-slate-100">Notifications</span>
            {unreadCount > 0 && (
              <Button type="link" size="small" onClick={markAllRead}>
                Mark all as read
              </Button>
            )}
          </div>
        }
        placement="right"
        onClose={() => setNotificationOpen(false)}
        open={notificationOpen}
        width={360}
      >
        <div className="flex flex-col gap-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-xl border transition-all ${
                  n.unread
                    ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="flex gap-2.5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-blue-500' : 'bg-transparent'}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug">{n.text}</p>
                    <span className="text-xs text-slate-400 mt-1 block">{n.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Drawer>

      {/* Command Palette */}
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
    </Layout>
  )
}

export default AppLayout
