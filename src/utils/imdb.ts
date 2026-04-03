import axios from "axios";

const CINEMETA_URL = "https://v3-cinemeta.strem.io/meta";

export const getTitles = async (imdbId: string) => {
  const titles = new Set<string>();

  const results = await Promise.all(
    ["movie", "series"].map((type) =>
      axios
        .get(`${CINEMETA_URL}/${type}/${imdbId}.json`)
        .then((res) => res.data?.meta?.name as string | undefined)
        .catch(() => undefined)
    )
  );

  results.forEach((title) => {
    if (title) titles.add(title);
  });

  return [...titles];
};

export const isImdbId = (str: string) =>
  /ev\d{7}\/\d{4}(-\d)?|(ch|co|ev|nm|tt)\d{7}/.test(str);
