import axios from "axios";
import * as cheerio from "cheerio";

// export const scrapeCocoonMarket = async (req, res) => {
//   try {
//     const { data } = await axios.get("https://tnsericulture.tn.gov.in/cocoonmarket", {
//       timeout: 60000,
//     });

//     const $ = cheerio.load(data);

//     // Find the table (need to inspect actual HTML)
//     let results = [];
//     $("table tr").each((i, row) => {
//       if (i === 0) return; // skip header
//       const cols = $(row).find("td");
//       if (cols.length > 0) {
//         results.push({
//           date: $(cols[0]).text().trim(),
//           market: $(cols[1]).text().trim(),
//           variety: $(cols[2]).text().trim(),
//           minPrice: $(cols[3]).text().trim(),
//           maxPrice: $(cols[4]).text().trim(),
//           avgPrice: $(cols[5]).text().trim(),
//         });
//       }
//     });

//     res.json({ count: results.length, data: results });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

let cache = { data: null, timestamp: 0 };
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const scrapeCocoonMarket = async (req, res) => {
  try {
    if (cache.data && Date.now() - cache.timestamp < CACHE_DURATION) {
      return res.json(cache.data);
    }

    const { data } = await axios.get("https://tnsericulture.tn.gov.in/cocoonmarket", { timeout: 60000 });
    const $ = cheerio.load(data);

    let results = [];
    $("table tr").each((i, row) => {
      if (i === 0) return; // skip header
      const cols = $(row).find("td");
      if (cols.length >= 6) {
        results.push({
          date: $(cols[0]).text().trim(),
          market: $(cols[1]).text().trim(),
          variety: $(cols[2]).text().trim(),
          minPrice: $(cols[3]).text().trim(),
          maxPrice: $(cols[4]).text().trim(),
          avgPrice: $(cols[5]).text().trim(),
        });
      }
    });

    const response = { count: results.length, data: results };
    cache = { data: response, timestamp: Date.now() };
    res.json(response);
  } catch (err) {
    console.error("Scraping error:", err.message);
    res.status(500).json({ error: "Failed to fetch cocoon market data" });
  }
};