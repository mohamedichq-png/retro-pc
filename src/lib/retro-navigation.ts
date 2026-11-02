// RETRO store visual navigation; read-only, no database mutations.
export type RetroKindId = 'consoles' | 'games' | 'accessories';
export type RetroDevice = {
  id: string;
  name: string;
  nameAr?: string;
  image: string;
  tokens: string[];
  hidden?: boolean;
  kindImages?: Partial<Record<RetroKindId, string>>;
};
export type RetroBrand = {
  id: string;
  name: string;
  nameAr?: string;
  color: string;
  logo?: string;
  hidden?: boolean;
  devices: RetroDevice[];
};
const img = (name: string) => !name ? '' : name.startsWith('/') ? name : `/media/consoles/${encodeURIComponent(name)}`;
const d = (id: string, name: string, filename: string, tokens: string[]): RetroDevice => ({ id, name, image: img(filename), tokens });
export const RETRO_BRANDS: RetroBrand[] = [
 {id:'playstation',name:'PlayStation',color:'#e8e8e8',devices:[
  d('ps1','PlayStation 1','/media/retro-verified/playstation-ps1.webp',['playstation 1','ps1','ps one','ps-one']),
  d('ps2','PlayStation 2','/media/retro-verified/playstation-ps2.webp',['playstation 2','ps2']),
  d('ps3','PlayStation 3 Slim','/media/retro-verified/playstation-ps3.webp',['playstation 3','ps3']),
  d('ps4','PlayStation 4 Pro','/media/retro-verified/playstation-ps4.webp',['playstation 4','ps4']),
  d('ps5','PlayStation 5 Slim','/media/retro-verified/playstation-ps5.webp',['playstation 5','ps5']),
  d('psp','PSP','/media/consoles/psp-normal.png',['playstation portable','psp']),
  d('psvita','PS Vita','/media/retro-verified/playstation-psvita.webp',['ps vita','playstation vita','psvita'])]},
 {id:'nintendo',name:'Nintendo',color:'#f04747',devices:[
  d('nes','NES / Famicom','/media/catalog/nintendo/nintendo-classic-mini-nes-30-games-pre-installed.webp',['nintendo entertainment system','famicom','nes']),
  d('snes','Super Nintendo (US)','/media/retro-verified/nintendo-snes.webp',['super nintendo','snes','super famicom']),
  d('n64','Nintendo 64','/media/catalog/nintendo/nintendo-64-pal-version.webp',['nintendo 64','n64']),
  d('gamecube','GameCube','/media/retro-verified/nintendo-gamecube.webp',['gamecube']),
  d('wii','Wii','/media/catalog/nintendo/nintendo-wii-white-with-wii-sports.webp',['nintendo wii','wii']),
  d('wiiu','Wii U','/media/catalog/nintendo/nintendo-wii-u-zombiu-premium-pack-limited-edition.webp',['wii u','wiiu']),
  d('switch','Nintendo Switch','/media/retro-verified/nintendo-switch.webp',['nintendo switch','switch']),
  d('gameboy','Game Boy','/media/retro-verified/nintendo-gameboy.webp',['game boy','gameboy']),
  d('nds','Nintendo DS','/media/catalog/nintendo/nintendo-ds-lite-white.webp',['nintendo ds','dsi','ds lite']),
  d('3ds','Nintendo 3DS','/media/catalog/nintendo/new-nintendo-3ds-xl.webp',['nintendo 3ds','3ds','2ds'])]},
 {id:'xbox',name:'Xbox',color:'#72c769',devices:[
  d('original','Original Xbox','/media/catalog/xbox/original-xbox.webp',['original xbox','classic xbox','xbox original']),
  d('x360','Xbox 360','/media/catalog/xbox/xbox-360-modern-warfare-2-limited-edition.webp',['xbox 360','x360']),
  d('one','Xbox One','/media/catalog/xbox/xbox-one-sunset-overdrive-edition.webp',['xbox one']),
  d('series','Xbox Series X','/media/catalog/xbox/xbox-series-s-white-512gb-ssd.webp',['xbox series','series x','series s'])]},
 {id:'sega',name:'SEGA',color:'#388ce9',devices:[
  d('megadrive','Mega Drive','/media/consoles/sega-mega-drive.png',['mega drive','megadrive','genesis']),
  d('saturn','Saturn','/media/catalog/retro-gaming-classics/sega-saturn-black-pal-version.webp',['sega saturn','saturn']),
  d('dreamcast','Dreamcast','/media/retro-verified/sega-dreamcast.webp',['dreamcast']),
  d('gamegear','Game Gear','/media/consoles/sega-game-gear.png',['game gear'])]},
 {id:'snk',name:'SNK',color:'#e0e0e0',devices:[d('neogeo','Neo Geo AES','/media/consoles/neo-geo-aes.png',['neo geo','neo-geo'])]},
 {id:'panasonic',name:'Panasonic 3DO',color:'#e0e0e0',devices:[d('3do','3DO','/media/consoles/panasonic-3do.png',['3do','panasonic 3do'])]},
 {id:'atari',name:'ATARI',color:'#e94b44',devices:[
  d('2600','Atari 2600','/brand-logos/atari.png',['atari 2600','vcs 2600']),
  d('5200','Atari 5200','/brand-logos/atari.png',['atari 5200']),
  d('7800','Atari 7800','/brand-logos/atari.png',['atari 7800']),
  d('lynx','Atari Lynx','/brand-logos/atari.png',['atari lynx']),
  d('jaguar','Atari Jaguar','/brand-logos/atari.png',['atari jaguar'])]},
 {id:'amiga',name:'AMIGA',color:'#f5d66b',devices:[
  d('a500','Amiga 500','/media/catalog/retro-gaming-classics/the-c64-mini-64-games-included.webp',['amiga 500','a500']),
  d('a600','Amiga 600','/brand-logos/amiga.png',['amiga 600','a600']),
  d('a1000','Amiga 1000','/brand-logos/amiga.png',['amiga 1000','a1000']),
  d('a1200','Amiga 1200','/brand-logos/amiga.png',['amiga 1200','a1200']),
  d('a2000','Amiga 2000','/brand-logos/amiga.png',['amiga 2000','a2000']),
  d('cd32','Amiga CD32','/media/catalog/retro-gaming-classics/amiga-cd32-critical-zone-pack.webp',['amiga cd32','cd32'])]},
 {id:'nec',name:'PC Engine',color:'#f6f6f6',devices:[
  d('pce','PC Engine','/media/catalog/retro-gaming-classics/pc-engine-japanese-version.webp',['pc engine','pc-engine','turbografx']),
  d('tg16','TurboGrafx-16','/media/catalog/retro-gaming-classics/pc-engine-japanese-version.webp',['turbografx-16','turbo grafx 16','tg16']),
  d('pcecd','PC Engine CD','/media/catalog/retro-gaming-classics/pc-engine-japanese-version.webp',['pc engine cd','turbografx cd','super cd-rom'])]},
 {id:'philips',name:'PHILIPS',color:'#579bec',devices:[
  d('cdi','CD-i','/brand-logos/philips.webp',['philips cd-i','cd-i','cdi'])]},
 {id:'arcade',name:'Arcade Systems',color:'#e879b9',devices:[
  d('arcade-machines','Arcade Machines','/media/catalog/nintendo/diy-desktop-arcade-cabinet-for-nintendo-switch.webp',['arcade machine','arcade cabinet','arcade system','coin-op']),
  d('arcade-boards','Arcade Boards','/media/catalog/retro-gaming-classics/super-joystick.webp',['arcade board','jamma','pcb','mvs'])]},
];
export const RETRO_KINDS = [
 {id:'consoles',ar:'الكونسول',en:'Consoles',hintAr:'أجهزة الألعاب'},
 {id:'games',ar:'الألعاب',en:'Games',hintAr:'الألعاب والأقراص'},
 {id:'accessories',ar:'الإكسسوارات',en:'Accessories',hintAr:'التحكم والملحقات'},
] as const;
