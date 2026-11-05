/** The games shown on the App Development room. Asset paths are root-absolute. */
export interface AppProject {
  kind: string;
  title: string;
  sub: string;
  desc: string;
  tags: string[];
  /** portrait phone screenshot shown as a still on the phone's screen (same shape as the screen: 591 × 1280) */
  shot: string;
  /** tiny inline placeholder painted behind the screen until the screenshot shows */
  lqip: string;
  /** APK download link */
  url: string;
}

export const PROJECTS: AppProject[] = [
  { kind: 'Android game', title: 'Single Pointer 3D', sub: 'A 3D game played with a single pointer', desc: 'Control the game with a single pointer in a 3D world! Experience smooth mechanics, immersive gameplay, and precision control like never before.', tags: ['3D gameplay', 'Single-pointer control', 'Precision control'], shot: '/app-developer/single-pointer-3d.webp', url: 'https://drive.google.com/file/d/1TozU5knBaRalnLjyVz1I8pSrKK5gN-TP/view?usp=sharing', lqip: 'data:image/webp;base64,UklGRpIAAABXRUJQVlA4IIYAAAAQBQCdASoWADAAPxF0tFMsJiSiqrgMAYAiCUAQXKBeZRFZdTYoGb3kjt0WtV53ipdgAP7sRI0KW+AIT/TsufCiZmsYaNOlT1P7d0qRGsKb1Og7ekUUux2ZECDd8b85Vpq6wAiJiEDLuR6vAJVJ1CZWhzNtSixzcsQYIQZjokeuOBsyD5AAAA==' },
  { kind: 'Android game', title: 'Raja Rani Chor Sipahi', sub: 'The classic strategy game, made digital', desc: 'Relive the classic strategy game digitally! Play, bluff, and outsmart your friends in this fun and interactive version of Raja Rani Chor Sipahi.', tags: ['Classic game', 'Bluff & strategy', 'Play with friends'], shot: '/app-developer/raja-rani-chor-sipahi.webp', url: 'https://drive.google.com/file/d/16X3eUP7bcXvtllsOvHrqV9DmiyEx-S4c/view?usp=sharing', lqip: 'data:image/webp;base64,UklGRuAAAABXRUJQVlA4INQAAADQBQCdASoWADAAPxF6slMsJ6QiqrgMAYAiCWUAsswicLFugweAROKg0ZuDo0x3tIRLT9F+G24AAP5b/x/YPjCxOUcNAHt0KdOAjypWT9WNacUsza1krGbMwdAfvwQahevjv/+LoEIcTBgHJV5xQ4b8qsQWTdwOIhREt5GBnYqaTToTt0XLDfZ16el1Di4BQmH9NV01Qo8frGI4/zXd+b1BQ6Cu0a/WjUbfAvsY4Q14WsQlLO8DAT7v0PIVprePHzkIjT35WwOzI2Lu2ymq06DIRmgAAA==' },
  { kind: 'Android game', title: '2 Player Games', sub: 'Offline 2-player games on one device', desc: 'Enjoy fun anytime, anywhere! Play multiple exciting 2-player games offline with your friends on a single device - no internet needed, just pure fun.', tags: ['2-player', 'Offline play', 'Single device'], shot: '/app-developer/2-player-games.webp', url: 'https://drive.google.com/file/d/10tPOTFeC9GZMe5r5ZkrNfZWUARJvRbn2/view?usp=sharing', lqip: 'data:image/webp;base64,UklGRgwBAABXRUJQVlA4IAABAABQBgCdASoWADAAPwlwrFArpqQitVgIAXAhCWkADoXAmwUFwulAvQ8eE4jIooxUwDXqQYmPdfINoBc/8AD+7UzWgvc2yNQSYuItGtvFrPTbC4H7ewPgOkolbeAVv8XmisAdf/Ul4wCUkkn7mz6wlp2CDTV/WXkQXWl67IGBZ+U0XiMnyl0r99GJLN4z9QSgIO0zomU/3aNSZS7nu9YMuHvs1wyWjuC0IWML41g9f3njdFzyszpiVRyk6Hq9snaaZF0mcbx7XnSSincbq9VSiEvbfbD4TWOqiWiT3vp215yFtr5Wk9D9fb6xSVBPAnoN4fLynNkbBXom0+OIczfgAAAA' },
];
