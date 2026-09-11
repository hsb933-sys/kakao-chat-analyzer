import type { ChatMessage, MessageType } from './types'

const FULL_DOT = /^(\d{4})\.\s?(\d{1,2})\.\s?(\d{1,2})\.\s?(오전|오후)\s?(\d{1,2}):(\d{2}),\s(.+?)\s:\s(.*)$/
const FULL_YEAR = /^(\d{4})년\s(\d{1,2})월\s(\d{1,2})일\s(오전|오후)\s(\d{1,2}):(\d{2}),\s(.+?)\s:\s(.*)$/
const SYSTEM_DOT = /^(\d{4})\.\s?(\d{1,2})\.\s?(\d{1,2})\.\s?(오전|오후)\s?(\d{1,2}):(\d{2}),\s(.*)$/
const SYSTEM_YEAR = /^(\d{4})년\s(\d{1,2})월\s(\d{1,2})일\s(오전|오후)\s(\d{1,2}):(\d{2}),\s(.*)$/
const BRACKET = /^\[(.+?)\]\s\[(오전|오후)\s(\d{1,2}):(\d{2})\]\s(.*)$/
const DATE_SEP = /^-+\s*(\d{4})년\s(\d{1,2})월\s(\d{1,2})일.*-+$/

const SYSTEM_HINTS = [
  '님이 들어왔습니다',
  '님이 나갔습니다',
  '채팅방 관리자',
  '봇이 초대되었습니다',
  '을(를) 초대했습니다',
  '를 초대했습니다',
]

function to24h(ampm: string, h: number) {
  let hour = h % 12
  if (ampm === '오후') hour += 12
  return hour
}

function buildDate(y: number, mo: number, d: number, ampm: string, h: number, mi: number) {
  return new Date(y, mo - 1, d, to24h(ampm, h), mi)
}

function classify(content: string): MessageType {
  const c = content.trim()
  if (c.includes('삭제된 메시지입니다')) return 'deleted'
  if (
    c === '사진' ||
    c === '동영상' ||
    c === '이모티콘' ||
    c === '음성메시지' ||
    /^사진\s*\d+장$/.test(c) ||
    c.startsWith('파일: ') ||
    c.startsWith('emoticon') ||
    c.startsWith('<사진')
  ) {
    return 'media'
  }
  return 'text'
}

function isSystemContent(content: string) {
  return SYSTEM_HINTS.some((hint) => content.includes(hint))
}

export function parseKakaoChat(raw: string): ChatMessage[] {
  const lines = raw.split(/\r\n|\r|\n/)
  const messages: ChatMessage[] = []
  let currentDate: { y: number; m: number; d: number } | null = null

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    let m: RegExpExecArray | null

    if ((m = FULL_DOT.exec(line)) || (m = FULL_YEAR.exec(line))) {
      const [, y, mo, d, ampm, h, mi, sender, content] = m
      const date = buildDate(+y, +mo, +d, ampm, +h, +mi)
      messages.push({ date, sender: sender.trim(), content, type: classify(content) })
      continue
    }

    if ((m = DATE_SEP.exec(line))) {
      currentDate = { y: +m[1], m: +m[2], d: +m[3] }
      continue
    }

    if ((m = SYSTEM_DOT.exec(line)) || (m = SYSTEM_YEAR.exec(line))) {
      const [, y, mo, d, ampm, h, mi, content] = m
      if (isSystemContent(content)) {
        const date = buildDate(+y, +mo, +d, ampm, +h, +mi)
        messages.push({ date, sender: '__system__', content, type: 'system' })
        continue
      }
    }

    if ((m = BRACKET.exec(line)) && currentDate) {
      const [, sender, ampm, h, mi, content] = m
      const date = buildDate(currentDate.y, currentDate.m, currentDate.d, ampm, +h, +mi)
      messages.push({ date, sender: sender.trim(), content, type: classify(content) })
      continue
    }

    if (isSystemContent(line) && currentDate) {
      messages.push({
        date: buildDate(currentDate.y, currentDate.m, currentDate.d, '오전', 0, 0),
        sender: '__system__',
        content: line,
        type: 'system',
      })
      continue
    }

    // Otherwise treat as a continuation of the previous message (multi-line text)
    if (messages.length > 0) {
      const last = messages[messages.length - 1]
      last.content += '\n' + line
    }
  }

  return messages
}
