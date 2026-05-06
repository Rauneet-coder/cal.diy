import { WEBAPP_URL } from "@calcom/lib/constants";
import type { AppCategories } from "@calcom/prisma/enums";
import type { IconName } from "@calcom/ui/components/icon";

/** Deprecated categories that should not appear in the app store navigation. */
type DeprecatedAppCategories = "video" | "web3";

/** Active categories currently displayed in the app store UI. */
type ActiveAppCategories = Exclude<AppCategories, DeprecatedAppCategories>;

function getHref(baseURL: string, category: string, useQueryParam: boolean) {
  const baseUrlParsed = new URL(baseURL, WEBAPP_URL);
  baseUrlParsed.searchParams.set("category", category);
  return useQueryParam ? `${baseUrlParsed.toString()}` : `${baseURL}/${category}`;
}

type AppCategoryEntry = {
  name: AppCategories;
  href: string;
  icon: IconName;
  "data-testid": string;
};

/**
 * Omit<> wrapper that builds an AppCategoryEntry from just the icon.
 * Keeps the category map DRY — href and data-testid are derived automatically.
 */
type AppCategoryConfig = { icon: IconName };

const getAppCategories = (baseURL: string, useQueryParam: boolean): AppCategoryEntry[] => {
  /**
   * Type-safe map: the compiler will error if a new active AppCategories value
   * is added to the Prisma enum but not mapped here (or vice-versa).
   *
   * Sorted alphabetically, with "other" last by convention.
   */
  const categoryMap: Record<ActiveAppCategories, AppCategoryConfig> = {
    analytics: { icon: "chart-bar" },
    automation: { icon: "share-2" },
    calendar: { icon: "calendar" },
    conferencing: { icon: "video" },
    crm: { icon: "contact" },
    messaging: { icon: "mail" },
    payment: { icon: "credit-card" },
    other: { icon: "grid-3x3" },
  };

  return (Object.entries(categoryMap) as [ActiveAppCategories, AppCategoryConfig][]).map(
    ([name, { icon }]) => ({
      name,
      href: getHref(baseURL, name, useQueryParam),
      icon,
      "data-testid": name,
    })
  );
};

export default getAppCategories;

