import axios from "axios";
import * as cheerio from "cheerio";

export const scrapeCocoonMarket = async (req, res) => {
  try {
    const { data } = await axios.get("https://tnsericulture.tn.gov.in/cocoonmarket", {
      timeout: 15000,
    });

    const $ = cheerio.load(data);

    // Find the table (need to inspect actual HTML)
    let results = [];
    $("table tr").each((i, row) => {
      if (i === 0) return; // skip header
      const cols = $(row).find("td");
      if (cols.length > 0) {
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

    res.json({ count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
