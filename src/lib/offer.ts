const OFFER_DURATION_DAYS = 20;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const OFFER_LABEL = "EID UL ADHA OFFER";
export const OFFER_BANNER_TEXT = "UP TO 50% OFF";

export function getOfferEndDate() {
  return new Date(Date.now() + OFFER_DURATION_DAYS * DAY_IN_MS);
}
