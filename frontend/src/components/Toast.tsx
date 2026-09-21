import { useCallback, useEffect, useState } from 'react'

interface Toast {
  id: number
  message: string
}

let nextId = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string) => {
    const id = nextId++
    setToasts((current) => [...current, { id, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 2800)
  }, [])

  return { toasts, showToast }
}

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-20 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} message={toast.message} />
      ))}
    </div>
  )
}

function ToastItem({ message }: { message: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div
      role="status"
      className={`rounded-lg bg-[#183e3b] px-4 py-3 font-sans text-[13px] text-white shadow-panel transition duration-200 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      {message}
    </div>
  )
}
