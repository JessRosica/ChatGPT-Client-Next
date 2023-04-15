import axios from 'axios'

import { useConfigStore } from '@/store/config'
import type { MessageModel } from '@/types/chat'

const TIME_OUT_MS = 30000

export function axiosChunk(
  data: MessageModel,
  options: {
    onMessage: (text: string, done: boolean) => void
    onError: (error: any) => void
  }
) {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()
  const { onMessage, onError } = options

  axios
    .post('/api/v1/chat/completions', data, {
      cancelToken: source.token,
      headers: {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
      },
      responseType: 'stream'
    })
    .then(response => {
      response.data.on('data', (chunk: any) => {
        onMessage && onMessage(chunk.toString(), false)
      })

      response.data.on('end', () => {
        onMessage && onMessage('', true)
      })
    })
    .catch(error => {
      if (axios.isCancel(error)) {
        onMessage && onMessage('', true)
      } else {
        onError && onError(error)
      }
    })

  return source.cancel
}

export async function requestChatStream(
  sendMessage: MessageModel,
  options?: {
    filterBot?: boolean
    onMessage: (message: string, done: boolean) => void
    onError: (error: Error, statusCode?: number) => void
    onController?: (controller: AbortController) => void
  }
) {
  // const req = makeRequestParam(sendMessage, {
  //   stream: true,
  //   filterBot: options?.filterBot
  // })

  console.log('[Request] ', sendMessage)

  const controller = new AbortController()
  const reqTimeoutId = setTimeout(() => controller.abort(), TIME_OUT_MS)

  try {
    const configStore = useConfigStore()
    const res = await fetch(
      `${configStore.bootstrap.api}/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          path: `${configStore.bootstrap.api}/v1/chat/completions`
        },
        body: JSON.stringify(sendMessage),
        signal: controller.signal
      }
    )
    clearTimeout(reqTimeoutId)

    let responseText = ''

    const finish = () => {
      options?.onMessage(responseText, true)
      controller.abort()
    }

    if (res.ok) {
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      options?.onController?.(controller)

      // eslint-disable-next-line no-constant-condition
      while (true) {
        // handle time out, will stop if no response in 10 secs
        const resTimeoutId = setTimeout(() => finish(), TIME_OUT_MS)
        const content = await reader?.read()
        clearTimeout(resTimeoutId)
        const text = decoder.decode(content?.value)
        responseText += text
        const done = !content || content.done
        options?.onMessage(responseText, false)
        if (done) {
          break
        }
      }
      finish()
    } else if (res.status === 401) {
      console.error('Anauthorized')
      options?.onError(new Error('Anauthorized'), res.status)
    } else if (res.status === 500) {
      const text = await res.text()
      options?.onError(new Error(text), res.status)
    } else {
      console.error('Stream Error', res.body)
      options?.onError(new Error('Stream Error'), res.status)
    }
  } catch (err) {
    console.error('NetWork Error', err)
    options?.onError(err as Error)
  }
}
