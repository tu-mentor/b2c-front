'use client'

import { useState, useCallback } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
}

const Toast = ({ message, type, onClose }: ToastProps & { onClose: () => void }) => (
  <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white flex items-center space-x-2 animate-fade-in-up`}>
    {type === 'success' ? <CheckCircle className="h-5 w-5 bg-green-500" /> : <XCircle className="h-5 w-5" />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
      <X className="h-4 w-4" />
    </button>
  </div>
)

export const useToast = () => {
  const [toast, setToast] = useState<ToastProps | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000) // Auto-hide after 5 seconds
  }, [])

  const ToastComponent = toast ? (
    <Toast {...toast} onClose={() => setToast(null)} />
  ) : null

  return { showToast, ToastComponent }
}