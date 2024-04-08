const availableDomains = [
  'booth.pm',
  'talto.cc',
  'www.pixiv.net',
  'character-sheets.appspot.com',
  'twitter.com',
  'x.com',
  'www.dlsite.com',
  'seesaawiki.jp'
]

export const isAvailableUrl = (url: string): boolean => {
  const domain = getDomain(url)
  if (!domain) return false
  return availableDomains.some((ad) => domain.endsWith(ad))
}

const getDomain = (url: string): string | null => {
  const matches = url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)
  if (!matches || matches.length < 2) return null
  return matches[1]
}
