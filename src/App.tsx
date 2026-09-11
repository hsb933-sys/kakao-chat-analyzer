import { useState } from 'react'
import Dashboard from './components/Dashboard'
import UploadScreen from './components/UploadScreen'
import { parseKakaoChat } from './lib/parser'
import { computeStats } from './lib/stats'
import type { ChatStats } from './lib/types'

export default function App() {
  const [stats, setStats] = useState<ChatStats | null>(null)
  const [filename, setFilename] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleFile = (text: string, name: string) => {
    setError(null)
    const messages = parseKakaoChat(text)
    if (messages.length === 0) {
      setError(
        '대화 내용을 인식하지 못했어요. 카카오톡 앱(또는 PC)의 "대화 내용 내보내기"로 생성한 .txt 파일인지 확인해주세요.',
      )
      return
    }
    setStats(computeStats(messages))
    setFilename(name)
  }

  if (!stats) return <UploadScreen onFile={handleFile} error={error} />

  return <Dashboard stats={stats} filename={filename} onReset={() => setStats(null)} />
}
