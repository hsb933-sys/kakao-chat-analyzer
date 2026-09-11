import { describe, expect, it } from 'vitest'
import { parseKakaoChat } from './parser'

describe('parseKakaoChat', () => {
  it('parses the dot-date format with sender and content', () => {
    const raw = '2024. 1. 5. 오전 9:12, 민지 : 다들 굿모닝!!'
    const messages = parseKakaoChat(raw)
    expect(messages).toHaveLength(1)
    expect(messages[0].sender).toBe('민지')
    expect(messages[0].content).toBe('다들 굿모닝!!')
    expect(messages[0].date.getHours()).toBe(9)
    expect(messages[0].date.getMinutes()).toBe(12)
  })

  it('converts 오후 12시 to noon and 오전 12시 to midnight', () => {
    const raw = [
      '2024. 1. 5. 오후 12:00, 민지 : 점심',
      '2024. 1. 5. 오전 12:00, 민지 : 자정',
    ].join('\n')
    const [noon, midnight] = parseKakaoChat(raw)
    expect(noon.date.getHours()).toBe(12)
    expect(midnight.date.getHours()).toBe(0)
  })

  it('parses the bracket format using the preceding date separator', () => {
    const raw = [
      '--------------- 2024년 1월 8일 월요일 ---------------',
      '[민지] [오전 7:30] 오늘부터 다이어트 시작',
    ].join('\n')
    const messages = parseKakaoChat(raw)
    expect(messages).toHaveLength(1)
    expect(messages[0].sender).toBe('민지')
    expect(messages[0].date.getFullYear()).toBe(2024)
    expect(messages[0].date.getMonth()).toBe(0)
    expect(messages[0].date.getDate()).toBe(8)
  })

  it('classifies system, media and deleted messages', () => {
    const raw = [
      '2024. 1. 7. 오전 8:00, 지훈님이 들어왔습니다.',
      '2024. 1. 7. 오후 9:00, 지훈 : 삭제된 메시지입니다.',
      '2024. 1. 7. 오후 9:05, 서연 : 사진 3장',
    ].join('\n')
    const messages = parseKakaoChat(raw)
    expect(messages.map((m) => m.type)).toEqual(['system', 'deleted', 'media'])
  })

  it('appends continuation lines to the previous message', () => {
    const raw = ['2024. 1. 5. 오전 9:12, 민지 : 첫줄', '둘째줄'].join('\n')
    const messages = parseKakaoChat(raw)
    expect(messages).toHaveLength(1)
    expect(messages[0].content).toBe('첫줄\n둘째줄')
  })
})
