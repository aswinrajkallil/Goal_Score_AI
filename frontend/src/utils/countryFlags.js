// Mapping of team names to ISO 3166-1 alpha-2 country codes
export const teamToCountryCode = {
  // World Cup teams (commonly used)
  Argentina: "AR",
  Brazil: "BR",
  France: "FR",
  Germany: "DE",
  Spain: "ES",
  England: "GB",
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
  Canada: "CA",
  Jamaica: "JM",
  "Costa Rica": "CR",
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
  Mali: "ML",
  Burkina: "BF",
  Kenya: "KE",
  Uganda: "UG",
  Tanzania: "TZ",
  Ethiopia: "ET",
  Morocco: "MA",
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
  "Northern Ireland": "GB",
  Scotland: "GB",
  Wales: "GB",
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
 * Get the flag emoji for a team name
 * @param {string} teamName - The name of the team
 * @returns {string} The country flag emoji or a default soccer ball emoji
 */
export const getTeamFlag = (teamName) => {
  if (!teamName) return "⚽";

  const countryCode = teamToCountryCode[teamName];

  if (!countryCode) {
    // Fallback: try to match partially
    const partialMatch = Object.keys(teamToCountryCode).find(
      (key) =>
        key.toLowerCase().includes(teamName.toLowerCase()) ||
        teamName.toLowerCase().includes(key.toLowerCase())
    );
    if (partialMatch) {
      return codeToFlag(teamToCountryCode[partialMatch]);
    }
    return "⚽"; // Default soccer ball emoji
  }

  return codeToFlag(countryCode);
};

/**
 * Convert ISO country code to flag emoji
 * @param {string} countryCode - The ISO 3166-1 alpha-2 country code
 * @returns {string} The flag emoji
 */
function codeToFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) {
    return "⚽";
  }

  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());

  return String.fromCodePoint(...codePoints);
}

/**
 * Get country code from team name
 * @param {string} teamName - The name of the team
 * @returns {string|null} The country code or null
 */
export const getCountryCode = (teamName) => {
  if (!teamName) return null;

  const countryCode = teamToCountryCode[teamName];
  if (countryCode) return countryCode;

  // Try partial match
  const partialMatch = Object.keys(teamToCountryCode).find(
    (key) =>
      key.toLowerCase().includes(teamName.toLowerCase()) ||
      teamName.toLowerCase().includes(key.toLowerCase())
  );

  return partialMatch ? teamToCountryCode[partialMatch] : null;
};
