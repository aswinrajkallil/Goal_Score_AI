// Mapping of team names to ISO 3166-1 alpha-2 country codes or custom regional codes
export const teamToCountryCode = {
  // World Cup teams (commonly used)
  Argentina: "AR",
  Brazil: "BR",
  France: "FR",
  Germany: "DE",
  Spain: "ES",
  England: "gb-eng",
  Italy: "IT",
  Netherlands: "NL",
  Belgium: "BE",
  Portugal: "PT",
  Poland: "PL",
  Russia: "RU",
  "Czech Republic": "CZ",
  Greece: "GR",
  Romania: "RO",
  Croatia: "HR",
  Serbia: "RS",
  Hungary: "HU",
  Ukraine: "UA",
  Austria: "AT",
  Norway: "NO",
  Sweden: "SE",
  Denmark: "DK",
  Iceland: "IS",
  Finland: "FI",
  Switzerland: "CH",
  Turkey: "TR",
  "South Africa": "ZA",
  Mexico: "MX",
  USA: "US",
  "United States": "US",
  Canada: "CA",
  Jamaica: "JM",
  "Costa Rica": "CR",
  CostaRica: "CR",
  Panama: "PA",
  Honduras: "HN",
  "El Salvador": "SV",
  Belize: "BZ",
  Trinidad: "TT",
  Chile: "CL",
  Paraguay: "PY",
  Uruguay: "UY",
  Ecuador: "EC",
  Peru: "PE",
  Colombia: "CO",
  Venezuela: "VE",
  Suriname: "SR",
  Guyana: "GY",
  Bolivia: "BO",
  "New Zealand": "NZ",
  Australia: "AU",
  Japan: "JP",
  "South Korea": "KR",
  SouthKorea: "KR",
  "Saudi Arabia": "SA",
  SaudiArabia: "SA",
  Qatar: "QA",
  "United Arab Emirates": "AE",
  Iran: "IR",
  Iraq: "IQ",
  Uzbekistan: "UZ",
  Kazakhstan: "KZ",
  Tajikistan: "TJ",
  Turkmenistan: "TM",
  Kyrgyzstan: "KG",
  Israel: "IL",
  Lebanon: "LB",
  Syria: "SY",
  Jordan: "JO",
  Palestine: "PS",
  Egypt: "EG",
  Morocco: "MA",
  Algeria: "DZ",
  Tunisia: "TN",
  Senegal: "SN",
  Nigeria: "NG",
  Ghana: "GH",
  Cameroon: "CM",
  "Côte d'Ivoire": "CI",
  IvoryCoast: "CI",
  "Ivory Coast": "CI",
  Mali: "ML",
  Burkina: "BF",
  Kenya: "KE",
  Uganda: "UG",
  Tanzania: "TZ",
  Ethiopia: "ET",
  Thailand: "TH",
  Vietnam: "VN",
  Indonesia: "ID",
  Philippines: "PH",
  Malaysia: "MY",
  Singapore: "SG",
  China: "CN",
  Mongolia: "MN",
  India: "IN",
  Pakistan: "PK",
  Bangladesh: "BD",
  "Sri Lanka": "LK",
  Nepal: "NP",
  Afghanistan: "AF",
  Belarus: "BY",
  Georgia: "GE",
  Armenia: "AM",
  Azerbaijan: "AZ",
  Albania: "AL",
  "Bosnia and Herzegovina": "BA",
  Montenegro: "ME",
  "North Macedonia": "MK",
  Bulgaria: "BG",
  Slovenia: "SI",
  Slovakia: "SK",
  Cyprus: "CY",
  Malta: "MT",
  Luxembourg: "LU",
  Ireland: "IE",
  "Northern Ireland": "gb-nir",
  Scotland: "gb-sct",
  Wales: "gb-wls",
  "New Caledonia": "NC",
  Fiji: "FJ",
  Samoa: "WS",
  Tahiti: "PF",
  "Solomon Islands": "SB",
  Vanuatu: "VU",
  Kiribati: "KI",
  Tonga: "TO",
  Curacao: "CW",
  Bahamas: "BS",
  Barbados: "BB",
  Haiti: "HT",
  "Dominican Republic": "DO",
  "Puerto Rico": "PR",
  Cuba: "CU",
};

/**
 * Get country code from team name (with normalize and partial matching)
 * @param {string} teamName - The name of the team
 * @returns {string|null} The country code (lowercase) or null
 */
export const getCountryCode = (teamName) => {
  if (!teamName) return null;

  const normalized = teamName.trim();
  const lowerName = normalized.toLowerCase();

  // Try exact lookup first
  if (teamToCountryCode[normalized]) return teamToCountryCode[normalized].toLowerCase();

  // Try case-insensitive lookup
  for (const [key, code] of Object.entries(teamToCountryCode)) {
    if (key.toLowerCase() === lowerName) {
      return code.toLowerCase();
    }
  }

  // Try partial matching as fallback
  for (const [key, code] of Object.entries(teamToCountryCode)) {
    const keyLower = key.toLowerCase();
    if (lowerName.includes(keyLower) || keyLower.includes(lowerName)) {
      return code.toLowerCase();
    }
  }

  return null;
};

/**
 * Get the flag image URL from FlagCDN
 * @param {string} teamName - The name of the team
 * @returns {string|null} The FlagCDN image URL or null
 */
export const getTeamFlagUrl = (teamName) => {
  const code = getCountryCode(teamName);
  if (!code) return null;
  return `https://flagcdn.com/w40/${code}.png`;
};

/**
 * Get the flag emoji for a team name (Legacy support)
 * @param {string} teamName - The name of the team
 * @returns {string} The country flag emoji or a default soccer ball emoji
 */
export const getTeamFlag = (teamName) => {
  if (!teamName) return "⚽";

  const code = getCountryCode(teamName);
  if (!code) return "⚽";

  // Regional codes like gb-eng cannot easily be converted to standard flag emojis
  if (code.includes("-")) {
    return "⚽";
  }

  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());

  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return "⚽";
  }
};
