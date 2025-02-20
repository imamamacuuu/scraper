import cheerio from 'cheerio'
import got from 'got'

export default async function googleImage (query: string): Promise<string[]> {
  const data = await got(`https://www.google.com/search?q=${query}&tbm=isch`, {
    headers: {
	    cookie:
	    'NID="511=Yt9NkK2-LnJ_JOEGQ-PGXEVuGs9-kkieJwyi08PhOQZSS71bz4C2AjUlIGQ3uxh2pY0Fll7wjlfOHYVKH45LKx7wX5FxeTEX8f0_RCssqbUcb9q2ZffSSbOCIsE3TVnGTx_g-Tuy6ideKPDK2Wn2x7Pn10pfACJGZYWc8k32R01moKNuv0RqjyhiWZLQ5BjbKIXygg_ZvjL-SB4ZCPR-yVHWVUU2nAQOiThI0LfXwJI_Q9P2kw"',
      accept:
				'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9,id;q=0.8',
      'user-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36'
    }
  }).text()

  const $ = cheerio.load(data)
  const pattern =
		/\[1,\[0,"(?<id>[\d\w\-_]+)",\["https?:\/\/(?:[^"]+)",\d+,\d+\]\s?,\["(?<url>https?:\/\/(?:[^"]+))",\d+,\d+\]/gm
  const matches = $.html().matchAll(pattern)
  const decodeUrl = (url: string) => decodeURIComponent(JSON.parse(`"${url}"`))
  return [...matches]
    .map(({ groups }) => decodeUrl(groups?.url as string))
    .filter((v) => /.*\.jpe?g|png$/gi.test(v))
}
