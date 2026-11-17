export type Trip = {
  id: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  busType: "VIP Sleeper" | "Executive" | "Business Class";
  seatsLeft: number;
  amenities: string[];
};

export const CITIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Eldoret",
  "Nakuru",
  "Malindi",
  "Kakamega",
  "Bungoma",
  "Busia",
  "Kampala",
  "Kitale",
  "Garissa",
];

const AMENITY_SETS = [
  ["Wi-Fi", "USB Charging", "Reclining Seats"],
  ["Wi-Fi", "Blanket", "Refreshments"],
  ["USB Charging", "Extra Legroom", "Air Conditioning"],
];

const TIMES = [
  { departure: "07:30 AM", arrival: "03:15 PM", duration: "7h 45m" },
  { departure: "10:00 AM", arrival: "06:00 PM", duration: "8h 00m" },
  { departure: "02:30 PM", arrival: "10:10 PM", duration: "7h 40m" },
  { departure: "08:00 PM", arrival: "04:30 AM", duration: "8h 30m" },
  { departure: "10:30 PM", arrival: "06:20 AM", duration: "7h 50m" },
];

const BUS_TYPES: Trip["busType"][] = ["VIP Sleeper", "Executive", "Business Class"];

function hash(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) % 100000;
  return h;
}

export function findTrips(from: string, to: string): Trip[] {
  const seed = hash(`${from.toLowerCase()}-${to.toLowerCase()}`);
  return TIMES.map((t, i) => {
    const n = (seed + i * 137) % 100;
    return {
      id: `${seed}-${i}`,
      from,
      to,
      ...t,
      price: 1200 + ((n % 9) * 250),
      busType: BUS_TYPES[(seed + i) % 3]!,
      seatsLeft: 3 + (n % 26),
      amenities: AMENITY_SETS[(seed + i) % 3]!,
    };
  });
}
