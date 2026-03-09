export interface LinkData {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  username: string;
  isActive: boolean;
  maxClicks: number | null;
  lastAccessedAt: string | null;
}

const STORAGE_KEY = 'link_shortener_data';

export const getLinks = (): LinkData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to parse links from localStorage', error);
    return [];
  }
};

export const saveLinks = (links: LinkData[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  } catch (error) {
    console.error('Failed to save links to localStorage', error);
  }
};

export const addLink = (originalUrl: string, username: string, maxClicks: number | null = null): LinkData => {
  const links = getLinks();
  
  const id = Math.random().toString(36).substring(2, 8);
  const baseUrl = window.location.href.split('#')[0].replace(/\/$/, '');

  const newLink: LinkData = {
    id,
    originalUrl,
    shortUrl: `${baseUrl}/#/r/${id}`,
    clicks: 0,
    createdAt: new Date().toISOString(),
    username,
    isActive: true,
    maxClicks,
    lastAccessedAt: null
  };

  links.push(newLink);
  saveLinks(links);
  return newLink;
};

export const getLinkById = (id: string): LinkData | undefined => {
  const links = getLinks();
  return links.find((l) => l.id === id);
};

export const incrementClicks = (id: string) => {
  const links = getLinks();
  const linkIndex = links.findIndex((l) => l.id === id);
  if (linkIndex !== -1) {
    links[linkIndex].clicks += 1;
    links[linkIndex].lastAccessedAt = new Date().toISOString();
    saveLinks(links);
  }
};

export const toggleLinkStatus = (id: string) => {
  const links = getLinks();
  const linkIndex = links.findIndex((l) => l.id === id);
  if (linkIndex !== -1) {
    links[linkIndex].isActive = !links[linkIndex].isActive;
    saveLinks(links);
  }
};

export const updateDestinationUrl = (id: string, newUrl: string) => {
  const links = getLinks();
  const linkIndex = links.findIndex((l) => l.id === id);
  if (linkIndex !== -1) {
    links[linkIndex].originalUrl = newUrl;
    saveLinks(links);
  }
};
