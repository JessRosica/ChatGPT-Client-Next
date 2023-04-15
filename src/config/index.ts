import type { ChatModel } from '@/types/chat'

export const ALL_MODELS: ChatModel[] = [
  'gpt-4-32k-0314',
  'gpt-4-32k',
  'gpt-4-0314',
  'gpt-4',
  'gpt-3.5-turbo-0301',
  'gpt-3.5-turbo',
  'text-davinci-003',
  'text-davinci-002',
  'text-curie-001',
  'text-babbage-001',
  'text-ada-001',
  'text-davinci-001',
  'davinci-instruct-beta',
  'davinci',
  'curie-instruct-beta',
  'curie',
  'ada',
  'babbage'
]

export const genTitleTemplate =
  '使用四到五个字直接返回这句话的简要主题，不要解释、不要标点、不要语气词、不要多余文本，如果没有主题，请直接返回“闲聊”'
