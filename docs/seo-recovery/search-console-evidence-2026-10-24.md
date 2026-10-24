# Search Console decline: evidence and limits

Source: `souvenirlilin.id-Performance-on-Search-2026-10-24.zip`, Google Search Console Web search export. The chart covers 23 June 2025 through 22 October 2026. Page and query tables are aggregate exports capped at 1,000 rows; they are not date-filtered.

## Technical decisions based on the available evidence

- The owner confirmed `souvenirlilin.id` as the Search Console property/preferred host. The supplied aggregate Pages export contains both `www` and bare-host URLs, and the live inspection found both hosts serving pages without redirect. The code now redirects `www` to the confirmed bare HTTPS host and emits canonical URLs on that host. Verify the redirect and canonical in Search Console after deployment; this change has not been deployed.
- Locale-specific canonical URLs and document language are generated for supported pages. No `hreflang` pairs are emitted because the repository does not provide a verified translation map for equivalent article/product content.
- The sitemap uses an allowlist of reachable public routes and product slugs from the public API. Search-result URLs receive `X-Robots-Tag: noindex, follow`; utility and private routes are excluded from the sitemap, with noindex kept separate from authentication.
- Removed the shared footer keyword block and unsupported local-business review/rating, business-hours, address, offer-price, and free-shipping structured data. These claims were hard-coded without an authoritative source in the available project inputs. Product prices and stock continue to come from the public product data.
- The contact form offers both an email submission to the owner-provided `contact@souvenirlilin.id` destination and a WhatsApp handoff to the owner-provided number. The WhatsApp link pre-fills the entered details; the visitor must press Send in WhatsApp. The email path reports success only after the API returns the mailer-accepted response.

## Comparable periods

| Period                |  Clicks | Impressions |                      CTR | Impression-weighted average position |
| --------------------- | ------: | ----------: | -----------------------: | -----------------------------------: |
| 25 Sep–22 Oct 2025    |     725 |      48,173 |                   1.505% |                                8.109 |
| 25 Sep–22 Oct 2026    |     325 |      21,314 |                   1.525% |                                7.080 |
| Change year over year | −55.17% |     −55.76% | +0.020 percentage points |          Improved by 1.029 positions |

The closest observed 28-day peak was 12 November–9 December 2025: 1,016 clicks and 68,298 impressions. Compared with that peak, the latest 28 days had 68.01% fewer clicks and 68.79% fewer impressions. The latest 28 days were nearly flat against the preceding 28 days (clicks +1.25%, impressions +4.63%).

This supports a substantial reduction in search exposure as the main observed change. Aggregate CTR is nearly unchanged and aggregate position improved. These sitewide aggregates do not show whether the same pages or queries lost visibility; changes in the mix of impressions can also move average position.

The remembered 50 clicks per day was a peak-day result, not a sustained baseline: only 2 of 487 chart days reached 50 clicks. The best rolling 28-day average was about 36 clicks per day.

Two periods deserve cohort-level investigation, without treating timing as proof of cause:

- Impressions fell 33.8% from 1–7 December to 8–14 December 2025, followed by further decline in the next week.
- Impressions fell 45.3% from 18–24 May to 25–31 May 2026 and remained lower in the first week of June.

No Google update or deployment is identified as the cause by this dataset.

## Limits of the supplied export

- Pages and Queries contain all-time rows across the 16-month chart range, not matching date-filtered cohorts. Their top-1,000-row exports cannot identify which URLs or queries lost clicks between the comparison periods.
- The page table totals 8,869 clicks and 823,126 impressions, while the chart totals 8,711 clicks and 597,665 impressions. These views have different aggregation/row coverage; do not combine their denominators.
- Visible query rows cover only a subset of chart clicks. The page/query totals are unsuitable for claiming total query share or identifying lost query themes.
- Country and device tables are available only as aggregate report views; there are no matching country/device cohorts for the comparison windows.
- Search impressions and clicks do not prove qualified wholesale inquiries, sales, or revenue.

## Additional three-month export

A separate export marked `Last 3 months` covers 23 July–22 October 2026 (92 days). Its chart has 1,018 clicks and 68,658 impressions (1.483% CTR). The Pages and Queries tables contain 705 and 986 rows respectively. This provides a recent-period view but has no matching 2025 table in the supplied files.

Indonesia accounts for 959 clicks and 63,309 impressions in the country table. Mobile accounts for 838 clicks and 58,620 impressions in the device table. These splits indicate that Indonesian mobile search is the main current exposure cohort. They do not establish the device or country cohorts that lost traffic year over year.

The visible leading page rows are largely local “toko/jual lilin terdekat” articles. The leading visible queries include “toko lilin terdekat” (17 clicks, 1,015 impressions), “jual sumbu lilin terdekat” (14 clicks, 444 impressions), and “jual lilin terdekat” (11 clicks, 431 impressions). These are useful current-intent signals, but the separate Pages and Queries tables do not map each query to a URL, and the export does not identify which rows declined.

## Data needed to select the ten URLs

The supplied files do not contain the date-filtered Pages and Queries needed to compare page/query losses. The 16-month Pages and Queries tables are aggregate top-1,000-row exports, and the 3-month tables cover only 2026. The available files therefore cannot support the ten evidence-selected URLs. No additional exports are available for this task, so those selections and page/query-level cause claims remain open.

The missing comparisons are:

1. 23 July–22 October 2025: Pages and Queries tables, to match the available 2026 three-month export.
2. If diagnosing the sharper steps, Pages and Queries for 1–7, 8–14, and 15–21 December 2025, plus 18–24 May, 25–31 May, and 1–7 June 2026.

When these comparisons become available, use the same Search Console property, country, device, and search-type filters, include all available rows (or document the export/API row cap), inspect material country/device differences, and verify product/service facts. The approved audiences are religious-supply shops and churches, with equal priority. Until then, no URL is assigned to either five-page segment and no page/query-level cause is claimed.
