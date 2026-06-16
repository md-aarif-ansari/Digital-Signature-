import { useState, useEffect } from 'react'
import { Modal, Input, List } from 'antd'
import {
  SearchOutlined,
  DashboardOutlined,
  FileTextOutlined,
  HistoryOutlined,
  EditOutlined,
  UserOutlined,
  BulbOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAppTheme } from '../context/ThemeContext'

const CommandPalette = ({ open, setOpen }) => {
  const navigate = useNavigate()
  const { toggleTheme } = useAppTheme()
  const [search, setSearch] = useState('')

  const commands = [
    {
      title: 'Go to Dashboard',
      description: 'Navigate to executive analytics and overview',
      icon: <DashboardOutlined />,
      action: () => {
        navigate('/dashboard')
        setOpen(false)
      },
    },
    {
      title: 'Go to Documents',
      description: 'View and upload files, drafts, and signed PDFs',
      icon: <FileTextOutlined />,
      action: () => {
        navigate('/documents')
        setOpen(false)
      },
    },
    {
      title: 'Go to Sign Requests',
      description: 'View outstanding signatures and workflow status',
      icon: <EditOutlined />,
      action: () => {
        navigate('/sign-requests')
        setOpen(false)
      },
    },
    {
      title: 'Go to Sign PDF',
      description: 'Load documents and place signature fields',
      icon: <EditOutlined />,
      action: () => {
        navigate('/sign')
        setOpen(false)
      },
    },
    {
      title: 'Go to Audit Logs',
      description: 'Check document tracking history and system operations',
      icon: <HistoryOutlined />,
      action: () => {
        navigate('/audit-logs')
        setOpen(false)
      },
    },
    {
      title: 'Go to Profile',
      description: 'Modify user avatar, details, and security passwords',
      icon: <UserOutlined />,
      action: () => {
        navigate('/profile')
        setOpen(false)
      },
    },
    {
      title: 'Toggle Dark / Light Theme',
      description: 'Switch between light and dark interface styles',
      icon: <BulbOutlined />,
      action: () => {
        toggleTheme()
        setOpen(false)
      },
    },
  ]

  // Filter commands by search string
  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase())
  )

  // Reset search on open change
  useEffect(() => {
    if (!open) {
      setSearch('')
    }
  }, [open])

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      closable={false}
      bodyStyle={{ padding: 0 }}
      width={550}
      centered
      className="command-palette-modal"
    >
      <div className="flex flex-col bg-white dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Search input field */}
        <div className="flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-800">
          <SearchOutlined className="text-slate-400 text-lg" />
          <Input
            placeholder="Type a command or search page..."
            variant="none"
            className="h-12 w-full bg-transparent border-none focus:outline-none dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase">
            ESC
          </span>
        </div>

        {/* Commands list */}
        <div className="max-h-[350px] overflow-y-auto p-2">
          <List
            dataSource={filteredCommands}
            renderItem={(item) => (
              <List.Item
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/60 cursor-pointer border-none transition-colors group"
                onClick={item.action}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 m-0">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 m-0">
                    {item.description}
                  </p>
                </div>
              </List.Item>
            )}
            locale={{
              emptyText: (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No commands matching "{search}"
                </div>
              ),
            }}
          />
        </div>

        {/* Command palette status footer */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span>Tip: Use ↑↓ arrows to navigate, Enter to select</span>
          <span>DocSign Command Palette</span>
        </div>
      </div>
    </Modal>
  )
}

export default CommandPalette
