import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, Button, Input, Select, Tabs, Radio, Alert, Space, Badge, message, Tooltip } from 'antd'
import {
  FileTextOutlined,
  UserOutlined,
  MailOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  DragOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { getDocumentByIdApi, signDocumentApi } from '../api/documentApi'
import { useAuth } from '../context/AuthContext'

const SignDocument = () => {
  const { userEmail, token } = useAuth()
  const location = useLocation()
  
  // Coordinates and Document details states
  const [documentId, setDocumentId] = useState('')
  const [page, setPage] = useState('1')
  const [x, setX] = useState('120')
  const [y, setY] = useState('180')
  const [fullName, setFullName] = useState('')
  const [initials, setInitials] = useState('')
  const [signerEmail, setSignerEmail] = useState(userEmail || '')
  
  // Active signature configuration
  const [activeTab, setActiveTab] = useState('signature')
  const [selectedStyle, setSelectedStyle] = useState(0)
  const [selectedColor, setSelectedColor] = useState('#111111')

  const [document, setDocument] = useState(null)
  const [signature, setSignature] = useState(null)
  const [pdfBlobUrl, setPdfBlobUrl] = useState('')
  const [placedSignature, setPlacedSignature] = useState(null)
  const [isDropActive, setIsDropActive] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Auto-load document passed from other pages via state
  useEffect(() => {
    if (location.state?.documentId) {
      const id = String(location.state.documentId)
      setDocumentId(id)
      loadDocById(id)
    }
  }, [location.state])

  // PDF Preview loader
  useEffect(() => {
    let objectUrl = ''

    const loadPdf = async () => {
      if (!document?.fileUrl || !token) {
        setPdfBlobUrl('')
        return
      }

      try {
        const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim()
        const requestUrl = document.fileUrl.startsWith('http')
          ? document.fileUrl
          : baseUrl
            ? `${baseUrl}${document.fileUrl}`
            : document.fileUrl

        const response = await fetch(requestUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Could not load PDF preview')
        }

        const blob = await response.blob()
        objectUrl = URL.createObjectURL(blob)
        setPdfBlobUrl(objectUrl)
      } catch {
        setPdfBlobUrl('')
      }
    }

    loadPdf()

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [document?.fileUrl, token])

  const loadDocById = async (id) => {
    if (!id) return
    setLoading(true)
    setError('')
    setSignature(null)
    setPlacedSignature(null)
    try {
      const data = await getDocumentByIdApi(Number(id))
      setDocument(data)
      message.success(`Loaded document "${data.title}"`)
    } catch {
      setError('Failed to find document. Verify the Document ID is correct.')
      setDocument(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadClick = () => {
    loadDocById(documentId)
  }

  // Signature fonts setup
  const signatureStyles = [
    `${fullName || 'Signature'}`,
    `${fullName || 'Signature'}`,
    `${fullName || 'Signature'}`,
    `${fullName || 'Signature'}`,
  ]

  const styleClasses = ['sig-style-1', 'sig-style-2', 'sig-style-3', 'sig-style-4']
  const previewInitials = initials || 'IN'
  const dragText = activeTab === 'stamp' ? 'COMPANY STAMP' : (activeTab === 'initials' ? previewInitials : signatureStyles[selectedStyle])

  // Coordinate math placement
  const placeSignatureAtPoint = (clientX, clientY, targetElement) => {
    const rect = targetElement.getBoundingClientRect()
    const relativeX = Math.min(Math.max(clientX - rect.left, 0), rect.width)
    const relativeY = Math.min(Math.max(clientY - rect.top, 0), rect.height)
    const normalizedX = Number(relativeX.toFixed(1))
    const normalizedY = Number(relativeY.toFixed(1))

    setX(String(normalizedX))
    setY(String(normalizedY))

    setPlacedSignature({
      leftPercent: Number(((relativeX / rect.width) * 100).toFixed(2)),
      topPercent: Number(((relativeY / rect.height) * 100).toFixed(2)),
      text: dragText,
    })
  }

  const onPdfDrop = (event) => {
    event.preventDefault()
    setIsDropActive(false)
    placeSignatureAtPoint(event.clientX, event.clientY, event.currentTarget)
  }

  const onPdfClick = (event) => {
    placeSignatureAtPoint(event.clientX, event.clientY, event.currentTarget)
  }

  const onSignSubmit = async (event) => {
    if (event) event.preventDefault()
    setLoading(true)
    setError('')
    setSignature(null)
    try {
      const data = await signDocumentApi({
        documentId: Number(documentId),
        signerEmail,
        signerName: fullName || null,
        page: Number(page),
        x: Number(x),
        y: Number(y),
        status: 'SIGNED',
      })
      setSignature(data)
      
      // Reload latest doc details
      const updatedDocument = await getDocumentByIdApi(Number(documentId))
      setDocument(updatedDocument)

      // Sync status to local storage list
      const localDocs = JSON.parse(localStorage.getItem('docsign_documents') || '[]')
      const updatedDocs = localDocs.map((d) =>
        d.id === Number(documentId) ? { ...d, status: 'SIGNED', updatedAt: new Date().toISOString() } : d
      )
      localStorage.setItem('docsign_documents', JSON.stringify(updatedDocs))

      message.success('Signature successfully applied onto PDF!')
    } catch (err) {
      setError(err?.response?.data?.error || 'Signature execution failed. Verify values.')
    } finally {
      setLoading(false)
    }
  }

  const downloadSignedPdf = async () => {
    if (!document?.fileUrl || !token) {
      setError('No signed PDF available to download.')
      return
    }

    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim()
      const requestUrl = document.fileUrl.startsWith('http')
        ? document.fileUrl
        : baseUrl
          ? `${baseUrl}${document.fileUrl}`
          : document.fileUrl

      const response = await fetch(requestUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Download failed')
      }

      const blob = await response.blob()
      const downloadUrl = URL.createObjectURL(blob)
      const link = window.document.createElement('a')
      link.href = downloadUrl
      link.download = `${(document.title || 'document').replace(/\s+/g, '-')}-signed.pdf`
      link.click()
      URL.revokeObjectURL(downloadUrl)
      message.success('Signed PDF download initialized')
    } catch {
      setError('Could not download signed PDF.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white title-font m-0">
          Signature Canvas Workspace
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
          Input your document details, configure script fonts, and drag/click coordinates to apply signatures.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* PDF Viewer Canvas Panel (Takes 2 columns on large screens) */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <Card
            title={
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                  <FileTextOutlined className="text-blue-500" />
                  {document?.title || 'Load Document to View Preview'}
                </span>
                {document && (
                  <Badge
                    status={document.status === 'SIGNED' ? 'success' : 'warning'}
                    text={<span className="font-bold text-xs">{document.status}</span>}
                  />
                )}
              </div>
            }
            bodyStyle={{ padding: '16px' }}
            className="shadow-sm border-slate-200 dark:border-slate-800"
          >
            {/* Viewport Canvas wrapper */}
            <div className="pdf-canvas-container">
              {document ? (
                pdfBlobUrl ? (
                  <div
                    className={`pdf-drop-layer relative ${isDropActive ? 'ring-4 ring-blue-500 ring-offset-2' : ''}`}
                    onDragOver={(event) => {
                      event.preventDefault()
                      setIsDropActive(true)
                    }}
                    onDragLeave={() => setIsDropActive(false)}
                    onDrop={onPdfDrop}
                    onClick={onPdfClick}
                  >
                    <iframe title="PDF Preview" src={pdfBlobUrl} className="pdf-preview-frame" />
                    
                    <div className="absolute bottom-4 right-4 bg-slate-900/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 z-10 shadow-lg">
                      <DragOutlined /> Click anywhere on PDF to position coordinates
                    </div>

                    {placedSignature && (
                      <div
                        className="signature-marker"
                        style={{
                          left: `${placedSignature.leftPercent}%`,
                          top: `${placedSignature.topPercent}%`,
                          color: selectedColor,
                        }}
                      >
                        <span className={`${styleClasses[selectedStyle]}`}>
                          {placedSignature.text}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-24 text-center">
                    <CloseCircleOutlined className="text-slate-300 text-5xl mb-4" />
                    <h3 className="font-bold text-slate-700 dark:text-slate-300">PDF Preview Unavailable</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      The document URL might be external or insecure. Coordinate click placement remains active, but visual preview is blocked.
                    </p>
                  </div>
                )
              ) : (
                <div className="py-32 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
                  <FileTextOutlined className="text-5xl text-slate-300 mb-2" />
                  <span>No document loaded in canvas.</span>
                  <span className="text-xs text-slate-500">Enter a Document ID in the sidebar to load the workspace.</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar Configuration Panel */}
        <div className="flex flex-col gap-5">
          {/* Document Load Card */}
          <Card title={<span className="font-bold text-slate-800 dark:text-slate-100 text-sm">Load Document</span>} className="shadow-sm border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Document ID</span>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="e.g. 1"
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  className="h-10 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                />
                <Button
                  loading={loading}
                  onClick={handleLoadClick}
                  disabled={!documentId}
                  className="h-10 px-5 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                >
                  Load
                </Button>
              </div>
            </div>
          </Card>

          {/* Configuration Card */}
          <Card title={<span className="font-bold text-slate-800 dark:text-slate-100 text-sm">Signing Options</span>} className="shadow-sm border-slate-200 dark:border-slate-800">
            {error && <Alert message={error} type="error" showIcon className="mb-4 rounded-lg" />}
            
            <div className="flex flex-col gap-5">
              {/* Typeface configure tabs */}
              <div className="tabs mb-2 border-b border-slate-200 dark:border-slate-800 flex">
                {['signature', 'initials', 'stamp'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`flex-1 pb-2 text-xs font-semibold border-b-2 text-center transition-all uppercase tracking-wider ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'signature' && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Full Name</span>
                  <Input
                    prefix={<UserOutlined className="text-slate-400" />}
                    placeholder="Your Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-10 dark:bg-slate-900"
                  />
                </div>
              )}

              {activeTab === 'initials' && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Initials</span>
                  <Input
                    placeholder="e.g. IN"
                    value={initials}
                    onChange={(e) => setInitials(e.target.value)}
                    className="h-10 dark:bg-slate-900"
                    maxLength={3}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Signer Email</span>
                <Input
                  prefix={<MailOutlined className="text-slate-400" />}
                  placeholder="signer@company.com"
                  type="email"
                  value={signerEmail}
                  onChange={(e) => setSignerEmail(e.target.value)}
                  className="h-10 dark:bg-slate-900"
                />
              </div>

              {/* Position coordinates inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1"><ColumnWidthOutlined /> Position X</span>
                  <Input
                    type="number"
                    value={x}
                    onChange={(e) => setX(e.target.value)}
                    className="h-10 dark:bg-slate-900"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1"><ColumnHeightOutlined /> Position Y</span>
                  <Input
                    type="number"
                    value={y}
                    onChange={(e) => setY(e.target.value)}
                    className="h-10 dark:bg-slate-900"
                  />
                </div>
              </div>

              {activeTab !== 'stamp' && (
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Cursive Font Styles</span>
                  <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg p-1">
                    {signatureStyles.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedStyle(index)}
                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                          selectedStyle === index
                            ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-900/40 border border-transparent'
                        }`}
                      >
                        <Radio checked={selectedStyle === index} size="small" />
                        <span
                          className={`${styleClasses[index]} text-lg`}
                          style={{ color: selectedColor }}
                        >
                          {activeTab === 'initials' ? previewInitials : item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Dot Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pen Color:</span>
                <div className="flex gap-2">
                  {['#111111', '#EF233C', '#2563EB', '#16A34A'].map((color) => (
                    <div
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="w-5 h-5 rounded-full cursor-pointer border-2 transition-all flex items-center justify-center shadow-sm"
                      style={{
                        backgroundColor: color,
                        borderColor: selectedColor === color ? '#FFFFFF' : 'transparent',
                        outline: selectedColor === color ? `1.5px solid ${color}` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Main Submit & Action Buttons */}
              <div className="flex flex-col gap-2 mt-2">
                <Button
                  type="primary"
                  size="large"
                  onClick={onSignSubmit}
                  loading={loading}
                  disabled={!document || !signerEmail}
                  className="bg-blue-600 border-none font-semibold h-11"
                >
                  Apply Signature
                </Button>

                {signature && (
                  <Button
                    type="default"
                    size="large"
                    icon={<DownloadOutlined />}
                    onClick={downloadSignedPdf}
                    className="h-11 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                  >
                    Download Signed PDF
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SignDocument
