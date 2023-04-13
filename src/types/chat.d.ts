/** 用户为user 机器人回答为assistant 系统预设为system */
export type Role = 'user' | 'system' | 'assistant'

export interface MessageItem {
  id: number
  date: number
  role: Role
  content: string
  streaming?: boolean
  isError?: boolean
}

export interface ChatItem {
  id: string
  topic: string
  sendMemory: boolean
  messages: MessageItem[]
  lastUpdate: number
  lastSummarizeIndex: number
}
