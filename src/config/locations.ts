export const mockLocations = [
  {
    id: "loc-home-mg",
    label: "MG Road",
    address: "12 MG Road, Bengaluru",
    latitude: 12.975,
    longitude: 77.6063,
  },
  {
    id: "loc-manyata",
    label: "Manyata Tech Park",
    address: "Manyata Tech Park, Bengaluru",
    latitude: 13.0495,
    longitude: 77.621,
  },
  {
    id: "loc-airport",
    label: "Kempegowda Airport",
    address: "Kempegowda International Airport, Bengaluru",
    latitude: 13.1989,
    longitude: 77.7068,
  },
  {
    id: "loc-indiranagar",
    label: "Indiranagar",
    address: "100 Feet Rd, Indiranagar, Bengaluru",
    latitude: 12.9784,
    longitude: 77.6408,
  },
  {
    id: "loc-koramangala",
    label: "Koramangala",
    address: "5th Block, Koramangala, Bengaluru",
    latitude: 12.9352,
    longitude: 77.6245,
  },
  {
    id: "loc-whitefield",
    label: "Whitefield",
    address: "ITPL Main Rd, Whitefield, Bengaluru",
    latitude: 12.9698,
    longitude: 77.75,
  },
  {
    id: "loc-jayanagar",
    label: "Jayanagar",
    address: "4th Block, Jayanagar, Bengaluru",
    latitude: 12.9308,
    longitude: 77.5838,
  },
  {
    id: "loc-phoenix",
    label: "Phoenix Marketcity",
    address: "Phoenix Marketcity, Bengaluru",
    latitude: 12.9972,
    longitude: 77.6964,
  },
] as const;

export type MockLocation = (typeof mockLocations)[number];
