import WorldCountryGeo from "./world-country-geo.json";
import { loadJSON } from "@/utils";

const geo = {
  WorldCountryGeo: loadJSON(WorldCountryGeo)
};

export default geo;
