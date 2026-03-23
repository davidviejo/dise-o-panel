import { AppSettings } from "../types";

const SETTINGS_KEY = "valencia_automator_settings";

export const DEFAULT_SETTINGS: AppSettings = {
  geminiApiKey: "",
  serpApiKey: "", // User must provide this (e.g., from SerpApi.com)
  searchQueries: [
    "valencia noticias economía",
    "valencia empresas inversión",
    "feria valencia eventos",
    "puerto valencia tráfico",
    "parque tecnológico paterna",
    "startups valencia lanzadera"
  ],
  targetSources: [
    "Valencia Plaza",
    "Economía 3",
    "Levante EM",
    "Las Provincias",
    "Alicante Plaza"
  ]
};

export const getSettings = (): AppSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};