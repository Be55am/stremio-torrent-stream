import { JackettApi } from "ts-jackett-api";
import { JackettCategory } from "ts-jackett-api/lib/types/JackettCategory.js";
import { TorrentSearchResult } from "./search.js";

const JACKETT_URL = process.env.JACKETT_URL;
const JACKETT_KEY = process.env.JACKETT_KEY;

export const searchJackett = async (
  searchQuery: string,
  categories: JackettCategory[],
  jackettUrl?: string,
  jackettKey?: string
): Promise<TorrentSearchResult[]> => {
  try {
    const url = JACKETT_URL || jackettUrl;
    const key = JACKETT_KEY || jackettKey;

    if (!url || !key) {
      console.error(`Jackett search skipped: url=${url} key=${key ? "set" : "missing"}`);
      return [];
    }

    console.log(`Jackett searching: url=${url} key=${key ? "set" : "missing"}`);
    const client = new JackettApi(url, key);

    const res = await client.search({
      query: searchQuery,
      category: categories,
    });

    return res.Results.map((result) => ({
      name: result.Title,
      tracker: result.Tracker,
      category: result.CategoryDesc || undefined,
      size: result.Size,
      seeds: result.Seeders,
      peers: result.Peers,
      torrent: result.Link || undefined,
      magnet: result.MagnetUri || undefined,
    }));
  } catch (error) {
    console.error(`Jackett search error: ${error instanceof Error ? error.message : error}`);
    return [];
  }
};
