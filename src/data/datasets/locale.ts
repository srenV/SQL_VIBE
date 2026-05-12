/**
 * Locale-aware dataset resolution.
 *
 * Returns the appropriate dataset for a given locale.
 * Falls back to German ("de") if no locale-specific dataset exists.
 */

import type { Dataset } from "@/types/exercise";

// German datasets (default)
import { shopDataset } from "./shop";
import { fitnessDataset } from "./fitness";
import { hrDataset } from "./hr";
import { ticketsDataset } from "./tickets";
import { bankingDataset } from "./banking";
import { streamingDataset } from "./streaming";
import { logsDataset } from "./logs";
import { universityDataset } from "./university";
import { ecommerceDataset } from "./ecommerce";
import { hospitalDataset } from "./hospital";
import { storyAnna7Dataset } from "./story-anna7";
import { storyNexusMarktDataset } from "./story-nexusmarkt";
import { storyHelpCoreDataset } from "./story-helpcore";
import { storyNeuronaleLueckeDataset } from "./story-neuronale-luecke";
import { storySystemfehlerDeltaDataset } from "./story-systemfehler-delta";
import { storyRoteZoneDataset } from "./story-rote-zone";
import { storyGhostProtocolDataset } from "./story-ghost-protocol";
import { storyGeldstromOmegaDataset } from "./story-geldstrom-omega";

// English datasets
import { shopDatasetEn } from "./en/shop";
import { fitnessDatasetEn } from "./en/fitness";
import { hrDatasetEn } from "./en/hr";
import { ticketsDatasetEn } from "./en/tickets";
import { bankingDatasetEn } from "./en/banking";
import { streamingDatasetEn } from "./en/streaming";
import { logsDatasetEn } from "./en/logs";
import { universityDatasetEn } from "./en/university";
import { ecommerceDatasetEn } from "./en/ecommerce";
import { hospitalDatasetEn } from "./en/hospital";
import { storyAnna7DatasetEn } from "./en/story-anna7";
import { storyNexusMarktDatasetEn } from "./en/story-nexusmarkt";
import { storyHelpCoreDatasetEn } from "./en/story-helpcore";
import { storyNeuronaleLueckeDatasetEn } from "./en/story-neuronale-luecke";
import { storySystemfehlerDeltaDatasetEn } from "./en/story-systemfehler-delta";
import { storyRoteZoneDatasetEn } from "./en/story-rote-zone";
import { storyGhostProtocolDatasetEn } from "./en/story-ghost-protocol";
import { storyGeldstromOmegaDatasetEn } from "./en/story-geldstrom-omega";

/** All German datasets keyed by id. */
const deDatasets: Record<string, Dataset> = {
  [shopDataset.id]: shopDataset,
  [fitnessDataset.id]: fitnessDataset,
  [hrDataset.id]: hrDataset,
  [ticketsDataset.id]: ticketsDataset,
  [bankingDataset.id]: bankingDataset,
  [streamingDataset.id]: streamingDataset,
  [logsDataset.id]: logsDataset,
  [universityDataset.id]: universityDataset,
  [ecommerceDataset.id]: ecommerceDataset,
  [hospitalDataset.id]: hospitalDataset,
  [storyAnna7Dataset.id]: storyAnna7Dataset,
  [storyNexusMarktDataset.id]: storyNexusMarktDataset,
  [storyHelpCoreDataset.id]: storyHelpCoreDataset,
  [storyNeuronaleLueckeDataset.id]: storyNeuronaleLueckeDataset,
  [storySystemfehlerDeltaDataset.id]: storySystemfehlerDeltaDataset,
  [storyRoteZoneDataset.id]: storyRoteZoneDataset,
  [storyGhostProtocolDataset.id]: storyGhostProtocolDataset,
  [storyGeldstromOmegaDataset.id]: storyGeldstromOmegaDataset,
};

/** All English datasets keyed by id. */
const enDatasets: Record<string, Dataset> = {
  [shopDatasetEn.id]: shopDatasetEn,
  [fitnessDatasetEn.id]: fitnessDatasetEn,
  [hrDatasetEn.id]: hrDatasetEn,
  [ticketsDatasetEn.id]: ticketsDatasetEn,
  [bankingDatasetEn.id]: bankingDatasetEn,
  [streamingDatasetEn.id]: streamingDatasetEn,
  [logsDatasetEn.id]: logsDatasetEn,
  [universityDatasetEn.id]: universityDatasetEn,
  [ecommerceDatasetEn.id]: ecommerceDatasetEn,
  [hospitalDatasetEn.id]: hospitalDatasetEn,
  [storyAnna7DatasetEn.id]: storyAnna7DatasetEn,
  [storyNexusMarktDatasetEn.id]: storyNexusMarktDatasetEn,
  [storyHelpCoreDatasetEn.id]: storyHelpCoreDatasetEn,
  [storyNeuronaleLueckeDatasetEn.id]: storyNeuronaleLueckeDatasetEn,
  [storySystemfehlerDeltaDatasetEn.id]: storySystemfehlerDeltaDatasetEn,
  [storyRoteZoneDatasetEn.id]: storyRoteZoneDatasetEn,
  [storyGhostProtocolDatasetEn.id]: storyGhostProtocolDatasetEn,
  [storyGeldstromOmegaDatasetEn.id]: storyGeldstromOmegaDatasetEn,
};

/** Locale-specific dataset maps. */
const localeDatasets: Record<string, Record<string, Dataset>> = {
  de: deDatasets,
  en: enDatasets,
};

/**
 * Get a dataset by id for a specific locale.
 * Falls back to German if no locale-specific dataset exists.
 */
export function getDataset(id: string, locale: string): Dataset {
  const localeMap = localeDatasets[locale] ?? localeDatasets.de;
  return localeMap[id] ?? deDatasets[id] ?? deDatasets[id];
}

/**
 * Get all datasets for a specific locale.
 * Falls back to German if no locale-specific datasets exist.
 */
export function getDatasetsForLocale(locale: string): Record<string, Dataset> {
  return localeDatasets[locale] ?? localeDatasets.de;
}

/**
 * Get the list of all dataset ids.
 */
export function getAllDatasetIds(): string[] {
  return Object.keys(deDatasets);
}