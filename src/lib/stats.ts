import { STOPWORDS } from './stopwords'
import type { Badge, ChatMessage, ChatStats, ParticipantStats } from './types'

const EMOJI_RE = /\p{Extended_Pictographic}/gu
const WORD_SPLIT_RE = /[\s.,!?~^*"'()[\]{}<>|/\\:;…\-_=+@#$%&]+/

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function extractWords(text: string): string[] {
  return text
    .split(WORD_SPLIT_RE)
    .map((w) => w.replace(EMOJI_RE, '').trim())
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w))
}

export function computeStats(messages: ChatMessage[]): ChatStats {
  const real = messages.filter((m) => m.type !== 'system')

  const participantSet = new Set<string>()
  real.forEach((m) => participantSet.add(m.sender))
  const participants = Array.from(participantSet)

  const perParticipantMap = new Map<
    string,
    { count: number; lengthSum: number; mediaCount: number; emojiCount: number; hourCounts: number[] }
  >()
  participants.forEach((p) =>
    perParticipantMap.set(p, { count: 0, lengthSum: 0, mediaCount: 0, emojiCount: 0, hourCounts: new Array(24).fill(0) }),
  )

  const hourlyActivity = new Array(24).fill(0)
  const heatmap: number[][] = Array.from({ length: 7 }, () => new Array(24).fill(0))
  const dailyCountsMap = new Map<string, number>()
  const wordCounts = new Map<string, number>()
  const emojiCounts = new Map<string, number>()

  let mediaCount = 0
  let deletedCount = 0
  let nightOwlCount = 0

  for (const msg of real) {
    const p = perParticipantMap.get(msg.sender)!
    p.count += 1

    const hour = msg.date.getHours()
    const weekday = msg.date.getDay()
    hourlyActivity[hour] += 1
    heatmap[weekday][hour] += 1
    p.hourCounts[hour] += 1

    const key = dateKey(msg.date)
    dailyCountsMap.set(key, (dailyCountsMap.get(key) ?? 0) + 1)

    if (hour >= 0 && hour < 6) nightOwlCount += 1

    if (msg.type === 'media') {
      mediaCount += 1
      p.mediaCount += 1
    } else if (msg.type === 'deleted') {
      deletedCount += 1
    } else {
      p.lengthSum += msg.content.length
      const emojis = msg.content.match(EMOJI_RE)
      if (emojis) {
        p.emojiCount += emojis.length
        for (const e of emojis) emojiCounts.set(e, (emojiCounts.get(e) ?? 0) + 1)
      }
      for (const w of extractWords(msg.content)) {
        wordCounts.set(w, (wordCounts.get(w) ?? 0) + 1)
      }
    }
  }

  const perParticipant: ParticipantStats[] = participants.map((name) => {
    const p = perParticipantMap.get(name)!
    const textCount = p.count - p.mediaCount
    const mostActiveHour = p.hourCounts.reduce(
      (best, v, h) => (v > p.hourCounts[best] ? h : best),
      0,
    )
    return {
      name,
      count: p.count,
      pct: real.length > 0 ? (p.count / real.length) * 100 : 0,
      avgLength: textCount > 0 ? p.lengthSum / textCount : 0,
      mediaCount: p.mediaCount,
      emojiCount: p.emojiCount,
      mostActiveHour,
    }
  })
  perParticipant.sort((a, b) => b.count - a.count)

  const dailyCounts = Array.from(dailyCountsMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const topWords = Array.from(wordCounts.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 40)

  const topEmojis = Array.from(emojiCounts.entries())
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 16)

  const dates = real.map((m) => m.date.getTime())
  const start = dates.length ? new Date(Math.min(...dates)) : new Date()
  const end = dates.length ? new Date(Math.max(...dates)) : new Date()
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1)

  const busiestDay = dailyCounts.length
    ? dailyCounts.reduce((best, d) => (d.count > best.count ? d : best), dailyCounts[0])
    : null

  const badges = computeBadges(perParticipant, real.length)

  return {
    participants,
    totalMessages: real.length,
    dateRange: { start, end, days },
    perParticipant,
    hourlyActivity,
    heatmap,
    dailyCounts,
    topWords,
    topEmojis,
    mediaCount,
    deletedCount,
    nightOwlPct: real.length > 0 ? (nightOwlCount / real.length) * 100 : 0,
    busiestDay,
    badges,
  }
}

function computeBadges(perParticipant: ParticipantStats[], totalMessages: number): Badge[] {
  if (perParticipant.length < 2 || totalMessages < 10) return []
  const badges: Badge[] = []

  const chattiest = [...perParticipant].sort((a, b) => b.count - a.count)[0]
  badges.push({
    emoji: '🗣️',
    title: '수다쟁이',
    name: chattiest.name,
    description: `전체 메시지의 ${chattiest.pct.toFixed(0)}%를 차지했어요`,
  })

  const emojiKing = [...perParticipant].sort((a, b) => b.emojiCount - a.emojiCount)[0]
  if (emojiKing.emojiCount > 0) {
    badges.push({
      emoji: '😍',
      title: '이모지 부자',
      name: emojiKing.name,
      description: `이모지를 ${emojiKing.emojiCount}번 사용했어요`,
    })
  }

  const shortest = [...perParticipant]
    .filter((p) => p.avgLength > 0)
    .sort((a, b) => a.avgLength - b.avgLength)[0]
  if (shortest) {
    badges.push({
      emoji: '💬',
      title: '단답벌레',
      name: shortest.name,
      description: `평균 메시지 길이 ${shortest.avgLength.toFixed(1)}자`,
    })
  }

  const longest = [...perParticipant]
    .filter((p) => p.avgLength > 0)
    .sort((a, b) => b.avgLength - a.avgLength)[0]
  if (longest && longest.name !== shortest?.name) {
    badges.push({
      emoji: '📝',
      title: '장문러',
      name: longest.name,
      description: `평균 메시지 길이 ${longest.avgLength.toFixed(1)}자`,
    })
  }

  const nightOwl = [...perParticipant].sort((a, b) => {
    const aNight = a.mostActiveHour < 6 || a.mostActiveHour >= 23 ? 1 : 0
    const bNight = b.mostActiveHour < 6 || b.mostActiveHour >= 23 ? 1 : 0
    return bNight - aNight
  })[0]
  if (nightOwl && (nightOwl.mostActiveHour < 6 || nightOwl.mostActiveHour >= 23)) {
    badges.push({
      emoji: '🦉',
      title: '올빼미',
      name: nightOwl.name,
      description: `가장 활발한 시간대가 ${nightOwl.mostActiveHour}시예요`,
    })
  }

  const mediaKing = [...perParticipant].sort((a, b) => b.mediaCount - a.mediaCount)[0]
  if (mediaKing.mediaCount > 0) {
    badges.push({
      emoji: '📸',
      title: '사진첩 공유왕',
      name: mediaKing.name,
      description: `사진·동영상을 ${mediaKing.mediaCount}번 보냈어요`,
    })
  }

  return badges
}
