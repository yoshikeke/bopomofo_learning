import { pinyin } from 'pinyin-pro'

// Tone mark symbols appended after bopomofo characters
// 1st tone: no mark (omitted in traditional bopomofo)
// 2nd tone: ˊ, 3rd: ˇ, 4th: ˋ, neutral: ˙
export const TONE_MARKS = { 1: '', 2: 'ˊ', 3: 'ˇ', 4: 'ˋ', 5: '˙', 0: '˙' }

export const TONE_COLORS = {
  1: '#2563eb', // blue
  2: '#16a34a', // green
  3: '#ea580c', // orange
  4: '#dc2626', // red
  5: '#6b7280', // gray (neutral)
  0: '#6b7280',
}

// Complete pinyin syllable → bopomofo mapping (tone-free)
export const SYLLABLE_MAP = {
  // no initial
  a: 'ㄚ', ai: 'ㄞ', an: 'ㄢ', ang: 'ㄤ', ao: 'ㄠ',
  e: 'ㄜ', ei: 'ㄟ', en: 'ㄣ', eng: 'ㄥ', er: 'ㄦ',
  o: 'ㄛ', ou: 'ㄡ',
  // y- (i medial, no bopomofo initial)
  yi: 'ㄧ', ya: 'ㄧㄚ', ye: 'ㄧㄝ', yao: 'ㄧㄠ', you: 'ㄧㄡ',
  yan: 'ㄧㄢ', yin: 'ㄧㄣ', yang: 'ㄧㄤ', ying: 'ㄧㄥ',
  yu: 'ㄩ', yue: 'ㄩㄝ', yuan: 'ㄩㄢ', yun: 'ㄩㄣ', yong: 'ㄩㄥ',
  // w- (u medial, no bopomofo initial)
  wu: 'ㄨ', wa: 'ㄨㄚ', wo: 'ㄨㄛ', wai: 'ㄨㄞ', wei: 'ㄨㄟ',
  wan: 'ㄨㄢ', wen: 'ㄨㄣ', wang: 'ㄨㄤ', weng: 'ㄨㄥ',
  // b
  ba: 'ㄅㄚ', bo: 'ㄅㄛ', bai: 'ㄅㄞ', bei: 'ㄅㄟ', bao: 'ㄅㄠ',
  ban: 'ㄅㄢ', ben: 'ㄅㄣ', bang: 'ㄅㄤ', beng: 'ㄅㄥ',
  bi: 'ㄅㄧ', bie: 'ㄅㄧㄝ', biao: 'ㄅㄧㄠ', bian: 'ㄅㄧㄢ',
  bin: 'ㄅㄧㄣ', bing: 'ㄅㄧㄥ', bu: 'ㄅㄨ',
  // p
  pa: 'ㄆㄚ', po: 'ㄆㄛ', pai: 'ㄆㄞ', pei: 'ㄆㄟ', pao: 'ㄆㄠ',
  pou: 'ㄆㄡ', pan: 'ㄆㄢ', pen: 'ㄆㄣ', pang: 'ㄆㄤ', peng: 'ㄆㄥ',
  pi: 'ㄆㄧ', pie: 'ㄆㄧㄝ', piao: 'ㄆㄧㄠ', pian: 'ㄆㄧㄢ',
  pin: 'ㄆㄧㄣ', ping: 'ㄆㄧㄥ', pu: 'ㄆㄨ',
  // m
  ma: 'ㄇㄚ', mo: 'ㄇㄛ', me: 'ㄇㄜ', mai: 'ㄇㄞ', mei: 'ㄇㄟ',
  mao: 'ㄇㄠ', mou: 'ㄇㄡ', man: 'ㄇㄢ', men: 'ㄇㄣ',
  mang: 'ㄇㄤ', meng: 'ㄇㄥ', mi: 'ㄇㄧ', mie: 'ㄇㄧㄝ',
  miao: 'ㄇㄧㄠ', miu: 'ㄇㄧㄡ', mian: 'ㄇㄧㄢ', min: 'ㄇㄧㄣ',
  ming: 'ㄇㄧㄥ', mu: 'ㄇㄨ',
  // f
  fa: 'ㄈㄚ', fo: 'ㄈㄛ', fei: 'ㄈㄟ', fou: 'ㄈㄡ',
  fan: 'ㄈㄢ', fen: 'ㄈㄣ', fang: 'ㄈㄤ', feng: 'ㄈㄥ', fu: 'ㄈㄨ',
  // d
  da: 'ㄉㄚ', de: 'ㄉㄜ', dai: 'ㄉㄞ', dei: 'ㄉㄟ', dao: 'ㄉㄠ',
  dou: 'ㄉㄡ', dan: 'ㄉㄢ', den: 'ㄉㄣ', dang: 'ㄉㄤ', deng: 'ㄉㄥ',
  di: 'ㄉㄧ', die: 'ㄉㄧㄝ', diao: 'ㄉㄧㄠ', diu: 'ㄉㄧㄡ',
  dian: 'ㄉㄧㄢ', ding: 'ㄉㄧㄥ', du: 'ㄉㄨ', duo: 'ㄉㄨㄛ',
  dui: 'ㄉㄨㄟ', duan: 'ㄉㄨㄢ', dun: 'ㄉㄨㄣ', dong: 'ㄉㄨㄥ',
  // t
  ta: 'ㄊㄚ', te: 'ㄊㄜ', tai: 'ㄊㄞ', tao: 'ㄊㄠ', tou: 'ㄊㄡ',
  tan: 'ㄊㄢ', tang: 'ㄊㄤ', teng: 'ㄊㄥ', ti: 'ㄊㄧ', tie: 'ㄊㄧㄝ',
  tiao: 'ㄊㄧㄠ', tian: 'ㄊㄧㄢ', ting: 'ㄊㄧㄥ', tu: 'ㄊㄨ',
  tuo: 'ㄊㄨㄛ', tui: 'ㄊㄨㄟ', tuan: 'ㄊㄨㄢ', tun: 'ㄊㄨㄣ', tong: 'ㄊㄨㄥ',
  // n
  na: 'ㄋㄚ', ne: 'ㄋㄜ', nai: 'ㄋㄞ', nei: 'ㄋㄟ', nao: 'ㄋㄠ',
  nou: 'ㄋㄡ', nan: 'ㄋㄢ', nen: 'ㄋㄣ', nang: 'ㄋㄤ', neng: 'ㄋㄥ',
  ni: 'ㄋㄧ', nie: 'ㄋㄧㄝ', niao: 'ㄋㄧㄠ', niu: 'ㄋㄧㄡ',
  nian: 'ㄋㄧㄢ', nin: 'ㄋㄧㄣ', niang: 'ㄋㄧㄤ', ning: 'ㄋㄧㄥ',
  nu: 'ㄋㄨ', nuo: 'ㄋㄨㄛ', nuan: 'ㄋㄨㄢ', nong: 'ㄋㄨㄥ',
  nü: 'ㄋㄩ', nüe: 'ㄋㄩㄝ', nve: 'ㄋㄩㄝ', nue: 'ㄋㄩㄝ',
  // l
  la: 'ㄌㄚ', le: 'ㄌㄜ', lai: 'ㄌㄞ', lei: 'ㄌㄟ', lao: 'ㄌㄠ',
  lou: 'ㄌㄡ', lan: 'ㄌㄢ', lang: 'ㄌㄤ', leng: 'ㄌㄥ',
  li: 'ㄌㄧ', lia: 'ㄌㄧㄚ', lie: 'ㄌㄧㄝ', liao: 'ㄌㄧㄠ',
  liu: 'ㄌㄧㄡ', lian: 'ㄌㄧㄢ', lin: 'ㄌㄧㄣ', liang: 'ㄌㄧㄤ',
  ling: 'ㄌㄧㄥ', lu: 'ㄌㄨ', luo: 'ㄌㄨㄛ', luan: 'ㄌㄨㄢ',
  lun: 'ㄌㄨㄣ', long: 'ㄌㄨㄥ', lü: 'ㄌㄩ', lüe: 'ㄌㄩㄝ',
  lve: 'ㄌㄩㄝ', lue: 'ㄌㄩㄝ',
  // g
  ga: 'ㄍㄚ', ge: 'ㄍㄜ', gai: 'ㄍㄞ', gei: 'ㄍㄟ', gao: 'ㄍㄠ',
  gou: 'ㄍㄡ', gan: 'ㄍㄢ', gen: 'ㄍㄣ', gang: 'ㄍㄤ', geng: 'ㄍㄥ',
  gu: 'ㄍㄨ', gua: 'ㄍㄨㄚ', guo: 'ㄍㄨㄛ', guai: 'ㄍㄨㄞ',
  gui: 'ㄍㄨㄟ', guan: 'ㄍㄨㄢ', gun: 'ㄍㄨㄣ', guang: 'ㄍㄨㄤ', gong: 'ㄍㄨㄥ',
  // k
  ka: 'ㄎㄚ', ke: 'ㄎㄜ', kai: 'ㄎㄞ', kei: 'ㄎㄟ', kao: 'ㄎㄠ',
  kou: 'ㄎㄡ', kan: 'ㄎㄢ', ken: 'ㄎㄣ', kang: 'ㄎㄤ', keng: 'ㄎㄥ',
  ku: 'ㄎㄨ', kua: 'ㄎㄨㄚ', kuo: 'ㄎㄨㄛ', kuai: 'ㄎㄨㄞ',
  kui: 'ㄎㄨㄟ', kuan: 'ㄎㄨㄢ', kun: 'ㄎㄨㄣ', kuang: 'ㄎㄨㄤ', kong: 'ㄎㄨㄥ',
  // h
  ha: 'ㄏㄚ', he: 'ㄏㄜ', hai: 'ㄏㄞ', hei: 'ㄏㄟ', hao: 'ㄏㄠ',
  hou: 'ㄏㄡ', han: 'ㄏㄢ', hen: 'ㄏㄣ', hang: 'ㄏㄤ', heng: 'ㄏㄥ',
  hu: 'ㄏㄨ', hua: 'ㄏㄨㄚ', huo: 'ㄏㄨㄛ', huai: 'ㄏㄨㄞ',
  hui: 'ㄏㄨㄟ', huan: 'ㄏㄨㄢ', hun: 'ㄏㄨㄣ', huang: 'ㄏㄨㄤ', hong: 'ㄏㄨㄥ',
  // j
  ji: 'ㄐㄧ', jia: 'ㄐㄧㄚ', jie: 'ㄐㄧㄝ', jiao: 'ㄐㄧㄠ',
  jiu: 'ㄐㄧㄡ', jian: 'ㄐㄧㄢ', jin: 'ㄐㄧㄣ', jiang: 'ㄐㄧㄤ',
  jing: 'ㄐㄧㄥ', jiong: 'ㄐㄩㄥ', ju: 'ㄐㄩ', jue: 'ㄐㄩㄝ',
  juan: 'ㄐㄩㄢ', jun: 'ㄐㄩㄣ',
  // q
  qi: 'ㄑㄧ', qia: 'ㄑㄧㄚ', qie: 'ㄑㄧㄝ', qiao: 'ㄑㄧㄠ',
  qiu: 'ㄑㄧㄡ', qian: 'ㄑㄧㄢ', qin: 'ㄑㄧㄣ', qiang: 'ㄑㄧㄤ',
  qing: 'ㄑㄧㄥ', qiong: 'ㄑㄩㄥ', qu: 'ㄑㄩ', que: 'ㄑㄩㄝ',
  quan: 'ㄑㄩㄢ', qun: 'ㄑㄩㄣ',
  // x
  xi: 'ㄒㄧ', xia: 'ㄒㄧㄚ', xie: 'ㄒㄧㄝ', xiao: 'ㄒㄧㄠ',
  xiu: 'ㄒㄧㄡ', xian: 'ㄒㄧㄢ', xin: 'ㄒㄧㄣ', xiang: 'ㄒㄧㄤ',
  xing: 'ㄒㄧㄥ', xiong: 'ㄒㄩㄥ', xu: 'ㄒㄩ', xue: 'ㄒㄩㄝ',
  xuan: 'ㄒㄩㄢ', xun: 'ㄒㄩㄣ',
  // zh
  zha: 'ㄓㄚ', zhe: 'ㄓㄜ', zhi: 'ㄓ', zhai: 'ㄓㄞ', zhei: 'ㄓㄟ',
  zhao: 'ㄓㄠ', zhou: 'ㄓㄡ', zhan: 'ㄓㄢ', zhen: 'ㄓㄣ',
  zhang: 'ㄓㄤ', zheng: 'ㄓㄥ', zhu: 'ㄓㄨ', zhua: 'ㄓㄨㄚ',
  zhuo: 'ㄓㄨㄛ', zhuai: 'ㄓㄨㄞ', zhui: 'ㄓㄨㄟ', zhuan: 'ㄓㄨㄢ',
  zhun: 'ㄓㄨㄣ', zhuang: 'ㄓㄨㄤ', zhong: 'ㄓㄨㄥ',
  // ch
  cha: 'ㄔㄚ', che: 'ㄔㄜ', chi: 'ㄔ', chai: 'ㄔㄞ', chao: 'ㄔㄠ',
  chou: 'ㄔㄡ', chan: 'ㄔㄢ', chen: 'ㄔㄣ', chang: 'ㄔㄤ', cheng: 'ㄔㄥ',
  chu: 'ㄔㄨ', chua: 'ㄔㄨㄚ', chuo: 'ㄔㄨㄛ', chuai: 'ㄔㄨㄞ',
  chui: 'ㄔㄨㄟ', chuan: 'ㄔㄨㄢ', chun: 'ㄔㄨㄣ', chuang: 'ㄔㄨㄤ', chong: 'ㄔㄨㄥ',
  // sh
  sha: 'ㄕㄚ', she: 'ㄕㄜ', shi: 'ㄕ', shai: 'ㄕㄞ', shei: 'ㄕㄟ',
  shao: 'ㄕㄠ', shou: 'ㄕㄡ', shan: 'ㄕㄢ', shen: 'ㄕㄣ',
  shang: 'ㄕㄤ', sheng: 'ㄕㄥ', shu: 'ㄕㄨ', shua: 'ㄕㄨㄚ',
  shuo: 'ㄕㄨㄛ', shuai: 'ㄕㄨㄞ', shui: 'ㄕㄨㄟ', shuan: 'ㄕㄨㄢ',
  shun: 'ㄕㄨㄣ', shuang: 'ㄕㄨㄤ',
  // r
  re: 'ㄖㄜ', ri: 'ㄖ', rao: 'ㄖㄠ', rou: 'ㄖㄡ', ran: 'ㄖㄢ',
  ren: 'ㄖㄣ', rang: 'ㄖㄤ', reng: 'ㄖㄥ', ru: 'ㄖㄨ', ruo: 'ㄖㄨㄛ',
  rui: 'ㄖㄨㄟ', ruan: 'ㄖㄨㄢ', run: 'ㄖㄨㄣ', rong: 'ㄖㄨㄥ',
  // z
  za: 'ㄗㄚ', ze: 'ㄗㄜ', zi: 'ㄗ', zai: 'ㄗㄞ', zei: 'ㄗㄟ',
  zao: 'ㄗㄠ', zou: 'ㄗㄡ', zan: 'ㄗㄢ', zen: 'ㄗㄣ', zang: 'ㄗㄤ',
  zeng: 'ㄗㄥ', zu: 'ㄗㄨ', zuo: 'ㄗㄨㄛ', zui: 'ㄗㄨㄟ',
  zuan: 'ㄗㄨㄢ', zun: 'ㄗㄨㄣ', zong: 'ㄗㄨㄥ',
  // c
  ca: 'ㄘㄚ', ce: 'ㄘㄜ', ci: 'ㄘ', cai: 'ㄘㄞ', cao: 'ㄘㄠ',
  cou: 'ㄘㄡ', can: 'ㄘㄢ', cen: 'ㄘㄣ', cang: 'ㄘㄤ', ceng: 'ㄘㄥ',
  cu: 'ㄘㄨ', cuo: 'ㄘㄨㄛ', cui: 'ㄘㄨㄟ', cuan: 'ㄘㄨㄢ',
  cun: 'ㄘㄨㄣ', cong: 'ㄘㄨㄥ',
  // s
  sa: 'ㄙㄚ', se: 'ㄙㄜ', si: 'ㄙ', sai: 'ㄙㄞ', sao: 'ㄙㄠ',
  sou: 'ㄙㄡ', san: 'ㄙㄢ', sen: 'ㄙㄣ', sang: 'ㄙㄤ', seng: 'ㄙㄥ',
  su: 'ㄙㄨ', suo: 'ㄙㄨㄛ', sui: 'ㄙㄨㄟ', suan: 'ㄙㄨㄢ',
  sun: 'ㄙㄨㄣ', song: 'ㄙㄨㄥ',
}

function isChinese(char) {
  const code = char.codePointAt(0)
  return (code >= 0x4e00 && code <= 0x9fff)
    || (code >= 0x3400 && code <= 0x4dbf)
    || (code >= 0x20000 && code <= 0x2a6df)
    || (code >= 0xf900 && code <= 0xfaff)
}

function pinyinToBopomofo(syllableWithTone) {
  // syllableWithTone: e.g. 'ni3', 'hao3', 'ma5'
  const toneNum = parseInt(syllableWithTone.slice(-1))
  const tone = isNaN(toneNum) ? 5 : toneNum
  const syllable = isNaN(toneNum) ? syllableWithTone : syllableWithTone.slice(0, -1)

  const bopomofo = SYLLABLE_MAP[syllable]
  if (!bopomofo) return { bopomofo: syllableWithTone, tone: 5, color: TONE_COLORS[5] }

  return {
    bopomofo: bopomofo + (TONE_MARKS[tone] ?? ''),
    tone,
    color: TONE_COLORS[tone] ?? TONE_COLORS[5],
  }
}

// Returns array of { char, bopomofo, tone, color }
// Non-Chinese chars get bopomofo: null
export function convertToBopomofo(text) {
  if (!text) return []
  const chars = Array.from(text)
  return chars.map(char => {
    if (!isChinese(char)) {
      return { char, bopomofo: null, tone: null, color: null }
    }
    const py = pinyin(char, { toneType: 'num', type: 'string', v: true })
    const result = pinyinToBopomofo(py.trim())
    return { char, ...result }
  })
}
