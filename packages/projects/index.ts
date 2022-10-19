import fetch from 'node-fetch';

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

export const getProject = async (projectName: ProjectName): Promise<PepeList> => {
  switch (projectName) {
    case 'drooling-apes':
      return getDabcList();
    case 'phunchkins':
      return getPhunchkins();
    case 'retro-xcp':
      return getRetroXcp();
    case 'wojaks':
      return getWojaks();
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

export type PepeList = Record<string, LooneyPepe>;
export type ProjectName = 'drooling-apes' | 'phunchkins' | 'retro-xcp' | 'wojaks';
type LooneyPepe = {
  burned?: number;
  img_url: string;
  order?: number;
  quantity?: number;
  series?: number;
  set?: 'dabc';
};
