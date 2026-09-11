import { useCallback, useRef, useState } from 'react'

interface Props {
  onFile: (text: string, filename: string) => void
  error: string | null
}

export default function UploadScreen({ onFile, error }: Props) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return
      const file = files[0]
      const reader = new FileReader()
      reader.onload = () => {
        onFile(String(reader.result ?? ''), file.name)
      }
      reader.readAsText(file, 'utf-8')
    },
    [onFile],
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0f1a]">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-amber-500/10 blur-3xl animate-float-slow-delay" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 text-3xl shadow-lg shadow-amber-500/20">
          💬
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          우리의 대화, 숫자로 보면 어떨까?
        </h1>
        <p className="mt-4 max-w-xl text-balance text-base leading-relaxed text-slate-400">
          카카오톡 대화 내보내기(.txt) 파일을 올리면 누가 더 수다스러운지, 언제 가장 활발한지,
          자주 쓰는 단어와 이모지까지 한눈에 분석해드려요.
        </p>

        <label
          onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragActive(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={`mt-10 flex w-full max-w-md cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-8 py-12 transition-all ${
            dragActive
              ? 'border-amber-400 bg-amber-400/10 scale-[1.02]'
              : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/[0.07]'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".txt"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <span className="text-4xl">📁</span>
          <span className="font-medium text-white">파일을 여기로 드래그하거나 클릭해서 선택</span>
          <span className="text-sm text-slate-500">카카오톡 대화방 &gt; 설정 &gt; 대화 내용 내보내기</span>
        </label>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mt-10 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-400">
          <span className="text-emerald-400">🔒</span>
          업로드한 대화 내용은 서버로 전송되지 않으며, 모든 분석은 브라우저 안에서만 이루어집니다.
        </div>
      </div>
    </div>
  )
}
