import { WebSocketEventHandler } from '@/types/blog'

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting'

function getDefaultWsUrl(): string {
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:5050/api/v1'
  try {
    const parsed = new URL(backendUrl)
    const protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${parsed.host}/ws`
  } catch {
    return 'ws://localhost:5050/ws'
  }
}

const WS_CONNECTING = 0
const WS_OPEN = 1
const WS_CLOSING = 2
const WS_CLOSED = 3

export class WebSocketGateway {
  private url: string
  private socket: WebSocket | null = null
  private connectionState: ConnectionState = 'disconnected'
  private subscribedTopics = new Set<string>()
  private eventListeners = new Map<string, Set<WebSocketEventHandler>>()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private clientId: string | null = null

  constructor(url: string = getDefaultWsUrl()) {
    this.url = url
  }

  public getConnectionState(): ConnectionState {
    return this.connectionState
  }

  public getClientId(): string | null {
    return this.clientId
  }

  public connect(): void {
    if (typeof window === 'undefined' && typeof global.WebSocket === 'undefined') return
    if (this.socket && (this.socket.readyState === WS_OPEN || this.socket.readyState === WS_CONNECTING)) {
      return
    }

    this.connectionState = this.reconnectAttempts > 0 ? 'reconnecting' : 'connecting'

    try {
      this.socket = new WebSocket(this.url)

      this.socket.onopen = () => {
        this.connectionState = 'connected'
        this.reconnectAttempts = 0
        this.startHeartbeat()

        // Re-subscribe to all active topics
        this.subscribedTopics.forEach((topic) => {
          this.send({ type: 'subscribe', payload: { topic } })
        })
      }

      this.socket.onmessage = (event) => {
        this.handleMessage(event.data)
      }

      this.socket.onclose = () => {
        this.cleanup()
        this.connectionState = 'disconnected'
        this.scheduleReconnect()
      }

      this.socket.onerror = (error) => {
        console.warn('WebSocket encountered an issue:', error)
      }
    } catch (err) {
      console.warn('WebSocket connection error:', err)
      this.scheduleReconnect()
    }
  }

  private handleMessage(data: any): void {
    try {
      const message = typeof data === 'string' ? JSON.parse(data) : data
      const eventName = message.event || message.type
      let payload = message.payload !== undefined ? message.payload : message

      if (eventName === 'connected') {
        this.clientId = payload?.clientId || null
      } else if (eventName === 'pong') {
        // Heartbeat ACK
        return
      }

      if (eventName && this.eventListeners.has(eventName)) {
        if (message.topic && typeof payload === 'object' && payload !== null && !payload.blogId) {
          const extractedBlogId = message.topic.replace(/^blog:/, '')
          if (extractedBlogId) {
            payload = { ...payload, blogId: extractedBlogId }
          }
        }

        const listeners = this.eventListeners.get(eventName)
        listeners?.forEach((listener) => {
          try {
            listener(payload)
          } catch (err) {
            console.error(`Error in WebSocket listener for ${eventName}:`, err)
          }
        })
      }
    } catch (e) {
      console.warn('Failed to parse WebSocket message:', e)
    }
  }

  public subscribe(topic: string): void {
    this.subscribedTopics.add(topic)
    if (this.socket && this.socket.readyState === WS_OPEN) {
      this.send({ type: 'subscribe', payload: { topic } })
    } else {
      this.connect()
    }
  }

  public unsubscribe(topic: string): void {
    this.subscribedTopics.delete(topic)
    if (this.socket && this.socket.readyState === WS_OPEN) {
      this.send({ type: 'unsubscribe', payload: { topic } })
    }
  }

  public on<T = any>(event: string, handler: WebSocketEventHandler<T>): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(handler)

    // Return unbind function
    return () => this.off(event, handler)
  }

  public off<T = any>(event: string, handler: WebSocketEventHandler<T>): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.delete(handler)
      if (listeners.size === 0) {
        this.eventListeners.delete(event)
      }
    }
  }

  public send(data: any): void {
    if (this.socket && this.socket.readyState === WS_OPEN) {
      this.socket.send(JSON.stringify(data))
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      if (this.socket && this.socket.readyState === WS_OPEN) {
        this.send({ type: 'ping' })
      }
    }, 30000) // 30s interval
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 15000)
    this.reconnectAttempts++

    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
  }

  private cleanup(): void {
    this.stopHeartbeat()
    if (this.socket) {
      this.socket.onopen = null
      this.socket.onmessage = null
      this.socket.onclose = null
      this.socket.onerror = null
      this.socket = null
    }
  }

  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.cleanup()
    this.connectionState = 'disconnected'
    this.subscribedTopics.clear()
  }
}

export const wsGateway = new WebSocketGateway()
export default wsGateway
