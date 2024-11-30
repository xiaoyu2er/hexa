import { parseAcceptLanguage } from 'intl-parse-accept-language';
import { UAParser } from 'ua-parser-js';
import {
  Bots,
  CLIs,
  Crawlers,
  Emails,
  ExtraDevices,
  Fetchers,
  InApps,
  Libraries,
  MediaPlayers,
} from 'ua-parser-js/extensions';

async function getSHA256HashFromObject(obj: Record<string, string>) {
  const sorted = Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0]));
  const joined = sorted.map(([key, value]) => `${key}=${value}`).join('&');
  const encoder = new TextEncoder();
  const data = encoder.encode(joined);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

const randomChoice = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const getRandomDataPoint = (): AnalyticsEngineDataPoint => {
  // Random data pools
  const domains = ['localhost:7001', 'example.com', 'test.dev', 'demo.app'];
  const projects = ['proj_123', 'proj_456', 'proj_789', 'proj_abc'];
  const orgs = ['org_123', 'org_456', 'org_789', 'org_abc'];
  const sources = ['direct', 'qr', 'social', 'email'];
  const languages = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP'];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  const versions = ['131.0.0.0', '122.0.0', '98.0.2', '89.1.1'];
  const osNames = ['macOS', 'Windows', 'Linux', 'iOS', 'Android'];
  const osVersions = ['10.15.7', '11.0', '12.4', '15.0'];
  const deviceTypes = ['desktop', 'mobile', 'tablet'];
  const vendors = ['Apple', 'Samsung', 'Dell', 'Lenovo', 'HP'];
  const models = ['Macintosh', 'Galaxy S21', 'XPS 13', 'ThinkPad'];
  const engines = ['Blink', 'Gecko', 'WebKit'];
  const continents = ['NA', 'EU', 'AS', 'SA', 'AF', 'OC'];
  const countries = ['US', 'GB', 'DE', 'FR', 'JP', 'AU'];
  const regions = ['California', 'Texas', 'New York', 'Florida'];
  const cities = [
    'Los Angeles',
    'San Francisco',
    'New York',
    'London',
    'Tokyo',
  ];
  const postalCodes = ['90025', '94105', '10001', 'SW1A 1AA'];
  const metroCodes = ['803', '807', '501', '206'];
  const timezones = [
    'America/Los_Angeles',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
  ];

  // Generate random coordinates
  const lat = (Math.random() * 180 - 90).toFixed(5);
  const lng = (Math.random() * 360 - 180).toFixed(5);
  const visitId = crypto.randomUUID().replace(/-/g, '');

  return {
    blobs: [
      // blob1: shortUrl
      `${randomChoice(domains)}/${Math.floor(Math.random() * 100)}`,
      // blob2: destUrl
      `http://${randomChoice(domains)}/project/${Math.random().toString(36).substring(7)}`,
      // blob3: projectId
      randomChoice(projects),
      // blob4: orgId
      randomChoice(orgs),
      // blob5: visitId
      visitId,
      // blob6: referrer
      Math.random() > 0.7 ? `https://${randomChoice(domains)}` : '',
      // blob7: ip
      Math.random() > 0.5
        ? `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
        : '',
      // blob8: source
      randomChoice(sources),
      // blob9: language
      randomChoice(languages),
      // blob10: query
      Math.random() > 0.8 ? `utm_source=${randomChoice(sources)}` : '',
      // blob11: UA
      `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) ${randomChoice(browsers)}/${randomChoice(versions)} Safari/537.36`,
      // blob12: browser
      `NAME=${randomChoice(browsers)}&VERSION=${randomChoice(versions)}&MAJOR=${Math.floor(Math.random() * 100)}&TYPE=`,
      // blob13: os
      `NAME=${randomChoice(osNames)}&VERSION=${randomChoice(osVersions)}&CPU=`,
      // blob14: device
      `TYPE=${randomChoice(deviceTypes)}&VENDOR=${randomChoice(vendors)}&MODEL=${randomChoice(models)}`,
      // blob15: engine
      `NAME=${randomChoice(engines)}&VERSION=${randomChoice(versions)}`,
      // blob16: location
      `CONTINENT=${randomChoice(continents)}&IS_EU_COUNTRY=${Math.random() > 0.5 ? '1' : '0'}&COUNTRY=${randomChoice(countries)}&REGION_CODE=${randomChoice(countries)}&REGION=${randomChoice(regions)}&CITY=${randomChoice(cities)}&POSTAL_CODE=${randomChoice(postalCodes)}&METRO_CODE=${randomChoice(metroCodes)}&TIMEZONE=${randomChoice(timezones)}`,
      // blob17: coordinates
      `${lat},${lng}`,
    ],
    doubles: [1],
    indexes: [Math.floor(Math.random() * 1000).toString()],
  };
};

export const getDataPoint = async (
  link: {
    destUrl: string;
    domain: string;
    slug: string;
    id: string;
    projectId: string;
    project: {
      orgId: string;
    };
  },
  request: Request
): Promise<AnalyticsEngineDataPoint> => {
  const headers = request.headers;
  const cf = (request.cf ?? {}) as IncomingRequestCfProperties;
  const language =
    parseAcceptLanguage(headers.get('Accept-Language') ?? '')[0] ?? '';
  const referer = headers.get('Referer') ?? '';
  const shortUrl = `${link.domain}/${link.slug}`;
  const userAgent = headers.get('User-Agent') ?? '';
  const searchParams = new URL(request.url).searchParams;
  const source = searchParams.get('qr') ? 'qr' : 'direct';
  const ip = (headers.get('x-real-ip') || headers.get('X-Forwarded-For')) ?? '';
  const visitId = await getSHA256HashFromObject({
    ua: userAgent,
    ip,
    latitude: cf.latitude ?? '',
    longitude: cf.longitude ?? '',
    language,
    referer,
    linkId: link.id,
  });

  // @ts-ignore
  const parser = new UAParser(userAgent, [
    Bots,
    CLIs,
    Crawlers,
    ExtraDevices,
    Emails,
    Fetchers,
    InApps,
    Libraries,
    MediaPlayers,
  ]);
  // const powerpc = 'Mozilla/4.0 (compatible; MSIE 5.17; Mac_PowerPC Mac OS; en)';
  // const galaxytabs8 =
  //   'Mozilla/5.0 (Linux; Android 12; SM-X706B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36';
  // const operamini =
  //   'Opera/9.80 (J2ME/MIDP; Opera Mini/5.1.21214/19.916; U; en) Presto/2.5.25';
  // const inapp = `Mozilla/5.0 (Linux; U; Android 10; zh-CN; V2034A Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/69.0.3497.100 UWS/3.22.2.33 Mobile Safari/537.36 UCBS/3.22.2.33_211025173018 NebulaSDK/1.8.100112 Nebula AlipayDefined(nt:WIFI,ws:360|0|2.0) AliApp(AP/10.2.51.7100) AlipayClient/10.2.51.7100 Language/zh-Hans useStatusBar/true isConcaveScreen/true Region/CNAriver/1.0.0`;
  // const i686 = `Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:19.0) Gecko/20100101 Firefox/19.0`;

  // { name : "Opera Mini", version : "5.1.21214", major : "5" }
  const { browser, os, device, ua, cpu, engine } = parser.getResult();

  // https://developers.cloudflare.com/fundamentals/reference/http-request-headers/
  const dataPoint = {
    blobs: [
      // blob1: shortUrl
      shortUrl,
      // blob2: destUrl
      link.destUrl,
      // blob3: projectId
      link.projectId,
      // blob4: orgId
      link.project.orgId,
      // blob5: visitId
      visitId,
      // blob6: referrer
      referer,
      // blob7: ip
      ip,
      // blob8: source
      source,
      // blob9: language
      language,
      // blob10: query
      new URL(request.url).searchParams.toString(),
      // blob11: User agent
      ua,
      // blob12: browser { name: '', version: '', major: '', type: '' }
      // name: https://docs.uaparser.dev/info/browser/name.html
      // version: https://docs.uaparser.dev/info/browser/version.html
      // major: https://docs.uaparser.dev/info/browser/major.html
      // type: https://docs.uaparser.dev/info/browser/type.html
      [
        `NAME=${browser.name || ''}`,
        `VERSION=${browser.version || ''}`,
        `MAJOR=${browser.major || ''}`,
        `TYPE=${browser.type || ''}`,
      ].join('&'),
      // blob13: os name + version + cpu architecture
      // name: https://docs.uaparser.dev/info/os/name.html
      // version: https://docs.uaparser.dev/info/os/version.html
      // cpu architecture: https://docs.uaparser.dev/info/cpu/arch.html
      [
        `NAME=${os.name || ''}`,
        `VERSION=${os.version || ''}`,
        `CPU=${cpu.architecture || ''}`,
      ].join('&'),

      // blob14: device type + vendor
      // type: https://docs.uaparser.dev/info/device/type.html
      // vendor: https://docs.uaparser.dev/info/device/vendor.html
      [
        `TYPE=${device.type || 'desktop'}`,
        `VENDOR=${device.vendor || ''}`,
        `MODEL=${device.model || ''}`,
      ].join('&'),
      // blob15: engine name + version
      // name: https://docs.uaparser.dev/info/engine/name.html
      [`NAME=${engine.name || ''}`, `VERSION=${engine.version || ''}`].join(
        '&'
      ),
      // blob16: location
      // continent, isEUCountry, country, regionCode, region
      [
        `CONTINENT=${cf.continent || ''}`,
        `IS_EU_COUNTRY=${cf.isEUCountry || '0'}`,
        `COUNTRY=${cf.country || ''}`,
        `REGION_CODE=${cf.regionCode || ''}`,
        `REGION=${cf.region || ''}`,
        `CITY=${cf.city || ''}`,
        `POSTAL_CODE=${cf.postalCode || ''}`,
        `METRO_CODE=${cf.metroCode || ''}`,
        `TIMEZONE=${cf.timezone || ''}`,
      ].join('&'),
      // blob17: coordinates
      [cf.latitude || '', cf.longitude || ''].join(','),
    ],
    doubles: [1],
    indexes: [link.id],
  };

  return dataPoint;
};

export const logDataPoint = (dataPoint: AnalyticsEngineDataPoint) => {
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob1', 'shortUrl', JSON.stringify(dataPoint.blobs?.[0]));
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob2', 'destUrl', JSON.stringify(dataPoint.blobs?.[1]));
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob3', 'projectId', JSON.stringify(dataPoint.blobs?.[2]));
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob4', 'orgId', JSON.stringify(dataPoint.blobs?.[3]));
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob5', 'visitId', JSON.stringify(dataPoint.blobs?.[4]));
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob6', 'referrer', JSON.stringify(dataPoint.blobs?.[5]));
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob7', 'ip', JSON.stringify(dataPoint.blobs?.[6]));
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob8', 'source', JSON.stringify(dataPoint.blobs?.[7]));
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob9', 'language', JSON.stringify(dataPoint.blobs?.[8]));
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob10', 'query', JSON.stringify(dataPoint.blobs?.[9]));
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob11', 'UA', JSON.stringify(dataPoint.blobs?.[10]));
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob12', 'browser', JSON.stringify(dataPoint.blobs?.[11]));
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob13', 'os', JSON.stringify(dataPoint.blobs?.[12]));
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob14', 'device', JSON.stringify(dataPoint.blobs?.[13]));
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob15', 'engine', JSON.stringify(dataPoint.blobs?.[14]));
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob16', 'location', JSON.stringify(dataPoint.blobs?.[15]));
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('blob17', 'coordinates', JSON.stringify(dataPoint.blobs?.[16]));
};
