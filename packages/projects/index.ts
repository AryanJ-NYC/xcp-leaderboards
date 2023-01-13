import fetch from 'node-fetch';

export const getBitcornList = async (): Promise<PepeList> => {
  try {
    const pepesResponse = await fetch('https://bitcorns.com/api/cards');
    const pepeJson = (await pepesResponse.json()) as Bitcorn[];
    const pepeList = pepeJson.reduce(
      (acc, bitcorn): PepeList => ({
        ...acc,
        [bitcorn.name]: {
          img_url: !bitcorn?.card.startsWith('http') ? `https:${bitcorn?.card}` : bitcorn.card,
          order: bitcorn.harvest_ranking,
          series: bitcorn.harvest,
          burned: bitcorn.burned,
          set: 'bitcorns',
        },
      }),
      {}
    );
    return pepeList;
  } catch (e) {
    console.error(e);
    return {};
  }
};
type Bitcorn = {
  name: string;
  card: string;
  issued: number;
  burned: number;
  supply: number;
  harvest: number;
  harvest_ranking: number;
};

export const getDabcList = async (): Promise<PepeList> => {
  try {
    const pepesResponse = await fetch('https://droolingapebus.club/api/verbose-feed');
    const pepeJson = (await pepesResponse.json()) as PepeList;
    return Object.entries(pepeJson).reduce(
      (acc, [apeName, ape]) => ({ ...acc, [apeName]: { ...ape, set: 'dabc' } }),
      {}
    );
  } catch {
    return {};
  }
};

export const getPhunchkins = async (): Promise<PepeList> => {
  try {
    const pepesResponse = await fetch('http://phunchkins.com/wp-json/phunchkins/feed');
    const pepeJson = (await pepesResponse.json()) as PepeList;
    return pepeJson;
  } catch {
    return {};
  }
};

export const getProjectAssets = async (projectName: ProjectName): Promise<PepeList> => {
  switch (projectName) {
    case 'bitcorn':
      return getBitcornList();
    case 'drooling-apes':
      return getDabcList();
    case 'phunchkins':
      return getPhunchkins();
    case 'retro-xcp':
      return getRetroXcp();
    case 'wojaks':
      return getWojaks();
    case 'xcp-pinata':
      return getXcpPinata();
  }
};

export const getRetroXcp = async (): Promise<PepeList> => {
  try {
    const pepesResponse = await fetch('https://www.retro-xcp.art/api/retro-feed');
    const pepeJson = (await pepesResponse.json()) as PepeList;
    return pepeJson;
  } catch {
    return {};
  }
};

export const getWojaks = async (): Promise<PepeList> => {
  try {
    const response = await fetch('https://thewojakway.com/wojakway-collection.json');
    const json = (await response.json()) as Wojak[];
    return json.reduce(
      (acc, wojak): PepeList => ({
        ...acc,
        [wojak.asset_name]: {
          img_url: wojak.url,
          order: wojak.card,
          series: wojak.series,
          set: 'the-wojak-way',
        },
      }),
      {}
    );
  } catch {
    return {};
  }
};
type Wojak = {
  asset_name: string;
  series: string;
  card: string;
  issuance: string;
  url: string;
};

export const getXcpPinata = async () => {
  try {
    const pepesResponse = await fetch('https://xcpinata.s3.amazonaws.com/XCPinata_images.json');
    const pepeJson = (await pepesResponse.json()) as Record<string, string>;
    return Object.entries(pepeJson).reduce(
      (acc, [name, img_url]) => ({ ...acc, [name]: { img_url, set: 'xcp-pinata' } }),
      {}
    );
  } catch {
    return {};
  }
};

export type PepeList = Record<string, LooneyPepe>;
export type ProjectName =
  | 'bitcorn'
  | 'drooling-apes'
  | 'phunchkins'
  | 'retro-xcp'
  | 'wojaks'
  | 'xcp-pinata';
type LooneyPepe = {
  burned?: number;
  img_url: string;
  order?: number;
  quantity?: number;
  series?: number;
  set?: 'dabc';
};
