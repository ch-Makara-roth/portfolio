'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
  description?: string
  duration?: number
}

type ToastListener = (toasts: Toast[]) => void

class ToastStore {
  private toasts: Toast[] = []
  private listeners: Set<ToastListener> = new Set()

  subscribe(listener: ToastListener) {
    this.listeners.add(listener)
    listener([...this.toasts])
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]))
  }

  show(type: ToastType, message: string, options?: { description?: string; duration?: number; id?: string }) {
    const id = options?.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: Toast = {
      id,
      type,
      message,
      description: options?.description,
      duration: options?.duration ?? 5000,
    }

    // Remove any existing toast with the same id
    this.toasts = this.toasts.filter((t) => t.id !== id)
    this.toasts.push(newToast)
    this.notify()

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.dismiss(id)
      }, newToast.duration)
    }

    return id
  }

  dismiss(id?: string) {
    if (id) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    } else {
      this.toasts = []
    }
    this.notify()
  }
}

export const toastStore = new ToastStore()

export const toast = {
  success: (message: string, options?: { description?: string; duration?: number; id?: string }) =>
    toastStore.show('success', message, options),
  error: (message: string, options?: { description?: string; duration?: number; id?: string }) =>
    toastStore.show('error', message, options),
  info: (message: string, options?: { description?: string; duration?: number; id?: string }) =>
    toastStore.show('info', message, options),
  warning: (message: string, options?: { description?: string; duration?: number; id?: string }) =>
    toastStore.show('warning', message, options),
  dismiss: (id?: string) => toastStore.dismiss(id),
}

const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const toastStyles: Record<ToastType, { border: string; bg: string; iconColor: string; text: string }> = {
  success: {
    border: 'border-emerald-500/30',
    bg: 'bg-gray-900/95 shadow-emerald-950/20',
    iconColor: 'text-emerald-400',
    text: 'text-emerald-200',
  },
  error: {
    border: 'border-red-500/30',
    bg: 'bg-gray-900/95 shadow-red-950/20',
    iconColor: 'text-red-400',
    text: 'text-red-200',
  },
  info: {
    border: 'border-blue-500/30',
    bg: 'bg-gray-900/95 shadow-blue-950/20',
    iconColor: 'text-blue-400',
    text: 'text-blue-200',
  },
  warning: {
    border: 'border-amber-500/30',
    bg: 'bg-gray-900/95 shadow-amber-950/20',
    iconColor: 'text-amber-400',
    text: 'text-amber-200',
  },
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    return toastStore.subscribe((updatedToasts) => {
      setToasts(updatedToasts)
    })
  }, [])

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-[99999] flex flex-col gap-2.5 pointer-events-none max-w-sm sm:max-w-md w-full px-4 sm:px-0"
    >
      <AnimatePresence mode="sync">
        {toasts.map((t) => {
          const Icon = toastIcons[t.type]
          const style = toastStyles[t.type]

          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${style.border} ${style.bg} backdrop-blur-md shadow-xl text-white font-sans`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.iconColor}`} />
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-sm font-medium text-white leading-snug break-words">
                  {t.message}
                </p>
                {t.description && (
                  <p className={`text-xs mt-1 leading-relaxed ${style.text} opacity-90 break-words`}>
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-gray-400 hover:text-white p-1 rounded-md transition-colors -mr-1 -mt-1 focus:outline-none"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
