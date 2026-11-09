import manifest from "./card-artwork.json";
import frenchManifest from "./card-artwork.fr.json";
import type { CatalogLanguage } from "./catalog-language";

type Artwork = { src: string; source: string; width: number; height: number };
export const cardArtwork: Record<string, Artwork> = manifest;
const frenchArtwork: Record<string, Artwork> = frenchManifest;
export const getCardArtwork = (id: string, language: CatalogLanguage = "en") => (language === "fr" ? frenchArtwork : cardArtwork)[id];
