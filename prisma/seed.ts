import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Helper to stringify arrays/objects
const J = (v: any) => JSON.stringify(v);

// ==========================================
// DEFAULT DETAIL DATA
// ==========================================
const DEFAULT_HIGHLIGHTS = [
  "Expert local guide",
  "Small group experience",
  "All entrance fees included",
  "Hotel pickup & drop-off",
];

const DEFAULT_INCLUDED = [
  "Professional guide",
  "Entrance fees",
  "Bottled water",
  "Transportation",
];

const DEFAULT_NOT_INCLUDED = [
  "Meals & drinks (unless specified)",
  "Personal expenses",
  "Travel insurance",
  "Gratuities",
];

const DEFAULT_LANGUAGES = ["English", "Spanish"];

// ==========================================
// DESTINATIONS
// ==========================================
const destinations = [
  {
    name: "Bali",
    slug: "bali",
    country: "Indonesia",
    description:
      "Island of the Gods — rice terraces, temples, and world-class beaches.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600",
  },
  {
    name: "Paris",
    slug: "paris",
    country: "France",
    description:
      "The City of Light — romance, art, cuisine, and iconic landmarks.",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600",
  },
  {
    name: "Dubai",
    slug: "dubai",
    country: "United Arab Emirates",
    description: "Futuristic skyline, desert safaris, and luxury shopping.",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600",
  },
  {
    name: "Istanbul",
    slug: "istanbul",
    country: "Turkey",
    description:
      "Where East meets West — bazaars, mosques, and Bosphorus cruises.",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600",
  },
  {
    name: "Maldives",
    slug: "maldives",
    country: "Maldives",
    description: "Overwater bungalows, turquoise lagoons, and coral reefs.",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600",
  },
  {
    name: "Rome",
    slug: "rome",
    country: "Italy",
    description:
      "Ancient ruins, Vatican treasures, and the best pasta of your life.",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600",
  },
  {
    name: "Tokyo",
    slug: "tokyo",
    country: "Japan",
    description: "Neon streets, serene temples, and unforgettable sushi.",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600",
  },
  {
    name: "Reykjavik",
    slug: "reykjavik",
    country: "Iceland",
    description: "Northern lights, geysers, and volcanic landscapes.",
    image:
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1600",
  },
  {
    name: "Barcelona",
    slug: "barcelona",
    country: "Spain",
    description: "Gaudí architecture, tapas bars, and Mediterranean beaches.",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1600",
  },
  {
    name: "Cape Town",
    slug: "cape-town",
    country: "South Africa",
    description:
      "Table Mountain, wine lands, and penguins at Boulders Beach.",
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1600",
  },
  {
    name: "Mexico City",
    slug: "mexico-city",
    country: "Mexico",
    description:
      "Aztec ruins, Frida Kahlo, street tacos, and vibrant culture.",
    image:
      "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1600",
  },
  {
    name: "London",
    slug: "london",
    country: "United Kingdom",
    description: "Royal palaces, world-class museums, and cozy pubs.",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600",
  },
];

// ==========================================
// TOURS
// ==========================================
// Type with optional detail fields
type TourSeed = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  price: number;
  durationDays: number;
  maxGuests: number;
  coverImage: string;
  images?: string;
  highlights?: string;
  included?: string;
  notIncluded?: string;
  itinerary?: string;
  meetingPoint?: string;
  languages?: string;
  cancellationHrs?: number;
  featured: boolean;
  destinationSlug: string;
};

const tours: TourSeed[] = [
  // ---------- BALI ----------
  {
    title: "7-Day Bali Island Escape",
    slug: "bali-7-day-island-escape",
    summary: "Beaches, temples, and rice terraces in one unforgettable week.",
    description:
      "Explore Bali's best — Ubud's rice terraces, Uluwatu's cliff temple, Nusa Penida's beaches, and a sunrise trek up Mount Batur. Includes private driver, 4-star hotels, and daily breakfast.",
    price: 899,
    durationDays: 7,
    maxGuests: 12,
    coverImage:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
    images: J([
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200",
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200",
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1200",
    ]),
    highlights: J([
      "Sunrise trek up Mount Batur volcano",
      "Private tour of Ubud's Tegallalang rice terraces",
      "Uluwatu Temple with cliffside Kecak fire dance",
      "Nusa Penida island day trip with snorkeling",
      "Traditional Balinese spa and dinner experience",
    ]),
    included: J([
      "6 nights in 4-star hotels",
      "Daily breakfast",
      "Private air-conditioned driver",
      "All entrance fees and temple donations",
      "English-speaking guide",
      "Airport transfers",
    ]),
    notIncluded: J([
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Lunches and dinners (unless specified)",
      "Personal expenses",
    ]),
    itinerary: J([
      { day: 1, title: "Arrival in Denpasar", description: "Airport pickup, hotel check-in, welcome dinner in Seminyak." },
      { day: 2, title: "Ubud Rice Terraces & Monkey Forest", description: "Visit Tegallalang terraces, Sacred Monkey Forest, and Ubud Art Market." },
      { day: 3, title: "Mount Batur Sunrise Trek", description: "Pre-dawn hike to the summit, breakfast cooked in volcanic steam, coffee plantation visit." },
      { day: 4, title: "Nusa Penida Day Trip", description: "Speedboat to Nusa Penida, Kelingking Beach, Angel's Billabong, snorkeling with manta rays." },
      { day: 5, title: "Uluwatu Temple & Kecak Dance", description: "Cliffside temple visit, sunset Kecak fire dance performance, seafood dinner at Jimbaran Bay." },
      { day: 6, title: "Free Day & Balinese Spa", description: "Free morning, afternoon spa treatment, farewell dinner." },
      { day: 7, title: "Departure", description: "Breakfast and airport transfer." },
    ]),
    meetingPoint: "Ngurah Rai International Airport (DPS), Bali",
    languages: J(["English", "Indonesian", "Spanish"]),
    cancellationHrs: 48,
    featured: true,
    destinationSlug: "bali",
  },
  {
    title: "Bali Sunrise Trek: Mount Batur",
    slug: "bali-sunrise-trek-mount-batur",
    summary: "Hike an active volcano and watch the sunrise above the clouds.",
    description:
      "A guided pre-dawn hike to Mount Batur's summit. Includes hotel pickup, breakfast cooked in volcanic steam, and a visit to a coffee plantation on the way back.",
    price: 65,
    durationDays: 1,
    maxGuests: 15,
    coverImage:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200",
    images: J([
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
    ]),
    highlights: J([
      "Watch the sunrise from Mount Batur's summit",
      "Breakfast cooked in volcanic steam",
      "Visit a working coffee plantation",
      "Small group size (max 15)",
    ]),
    meetingPoint: "Hotel pickup in Ubud or Seminyak",
    languages: J(["English", "Indonesian"]),
    cancellationHrs: 24,
    featured: false,
    destinationSlug: "bali",
  },
  {
    title: "Nusa Penida Day Trip",
    slug: "nusa-penida-day-trip",
    summary:
      "Kelingking Beach, Angel's Billabong, and crystal-clear snorkeling.",
    description:
      "Speedboat to Nusa Penida, visit the iconic T-Rex-shaped cliff at Kelingking, swim at Angel's Billabong, and snorkel with manta rays.",
    price: 120,
    durationDays: 1,
    maxGuests: 20,
    coverImage:
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200",
    images: J([
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
    ]),
    highlights: J([
      "Kelingking Beach — the famous T-Rex cliff",
      "Snorkeling at Crystal Bay",
      "Angel's Billabong natural infinity pool",
      "Swim with manta rays",
    ]),
    meetingPoint: "Sanur Harbor, Bali",
    languages: J(["English", "Indonesian"]),
    cancellationHrs: 24,
    featured: true,
    destinationSlug: "bali",
  },

  // ---------- PARIS ----------
  {
    title: "5-Day Paris Romantic Getaway",
    slug: "paris-5-day-romantic-getaway",
    summary: "Eiffel Tower, Seine cruise, and Versailles in one perfect trip.",
    description:
      "Skip-the-line Eiffel Tower access, a candlelit Seine dinner cruise, day trip to Versailles, and a private Montmartre walking tour. Boutique hotel in Le Marais included.",
    price: 1199,
    durationDays: 5,
    maxGuests: 8,
    coverImage:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
    images: J([
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200",
      "https://images.unsplash.com/photo-1591287192681-4b8e3a8d4f0c?w=1200",
      "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=1200",
    ]),
    highlights: J([
      "Skip-the-line Eiffel Tower summit access",
      "Candlelit dinner cruise on the Seine",
      "Day trip to Palace of Versailles",
      "Private Montmartre art & food walking tour",
      "Boutique hotel in Le Marais",
    ]),
    included: J([
      "4 nights in a 4-star boutique hotel",
      "Daily breakfast",
      "Skip-the-line Eiffel Tower tickets",
      "Seine dinner cruise with drinks",
      "Versailles day trip with transport",
      "Private Montmartre walking tour",
    ]),
    notIncluded: J([
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Gratuities",
    ]),
    itinerary: J([
      { day: 1, title: "Arrival & Eiffel Tower", description: "Private transfer, hotel check-in, skip-the-line Eiffel Tower summit visit." },
      { day: 2, title: "Louvre & Seine Cruise", description: "Guided Louvre tour, evening Seine dinner cruise." },
      { day: 3, title: "Versailles Day Trip", description: "Full-day excursion to Versailles palace and gardens." },
      { day: 4, title: "Montmartre & Latin Quarter", description: "Private walking tour of Montmartre and Latin Quarter food tour." },
      { day: 5, title: "Departure", description: "Breakfast and airport transfer." },
    ]),
    meetingPoint: "Charles de Gaulle Airport (CDG), Paris",
    languages: J(["English", "French", "Spanish"]),
    cancellationHrs: 72,
    featured: true,
    destinationSlug: "paris",
  },
  {
    title: "Paris Louvre Guided Tour",
    slug: "paris-louvre-guided-tour",
    summary: "Skip the line and see the Mona Lisa with an expert guide.",
    description:
      "A 2.5-hour guided tour of the Louvre's greatest hits. Small groups, skip-the-line entry, and headsets included.",
    price: 75,
    durationDays: 1,
    maxGuests: 12,
    coverImage:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200",
    highlights: J([
      "Skip-the-line entry to the Louvre",
      "See the Mona Lisa up close",
      "Small groups (max 12)",
      "Expert English-speaking guide",
    ]),
    meetingPoint: "Louvre Pyramid main entrance",
    languages: J(["English", "French", "German", "Spanish"]),
    cancellationHrs: 24,
    featured: false,
    destinationSlug: "paris",
  },
  {
    title: "Versailles & Gardens Day Trip",
    slug: "paris-versailles-gardens-day-trip",
    summary: "The Palace of Versailles and its legendary gardens.",
    description:
      "Round-trip train from Paris, skip-the-line palace entry, and a guided walk through the Hall of Mirrors and gardens.",
    price: 95,
    durationDays: 1,
    maxGuests: 15,
    coverImage:
      "https://images.unsplash.com/photo-1591287192681-4b8e3a8d4f0c?w=1200",
    highlights: J([
      "Skip-the-line Palace of Versailles entry",
      "Hall of Mirrors tour",
      "Guided walk through the gardens",
      "Round-trip train from Paris included",
    ]),
    meetingPoint: "Gare Saint-Lazare, Paris",
    languages: J(["English", "French"]),
    cancellationHrs: 24,
    featured: false,
    destinationSlug: "paris",
  },

  // ---------- DUBAI ----------
  {
    title: "Dubai Luxury 4-Day Experience",
    slug: "dubai-luxury-4-day-experience",
    summary: "Burj Khalifa, desert safari, and a marina yacht cruise.",
    description:
      "Includes Burj Khalifa 124th-floor entry, a red-dune desert safari with BBQ dinner, a Dubai Marina yacht cruise, and 5-star hotel stay.",
    price: 1099,
    durationDays: 4,
    maxGuests: 10,
    coverImage:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200",
    images: J([
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200",
      "https://images.unsplash.com/photo-1452022582947-b521d8779ab6?w=1200",
      "https://images.unsplash.com/photo-1582672060674-bc2bd808a8f5?w=1200",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200",
    ]),
    highlights: J([
      "Burj Khalifa 124th & 125th floor access",
      "Red-dune desert safari with BBQ dinner",
      "Dubai Marina luxury yacht cruise",
      "5-star hotel accommodation",
      "Dubai Mall & fountain show",
    ]),
    included: J([
      "3 nights in a 5-star hotel",
      "Daily breakfast",
      "Burj Khalifa skip-the-line tickets",
      "Desert safari with BBQ dinner",
      "Marina yacht cruise",
      "Airport transfers",
    ]),
    notIncluded: J([
      "International flights",
      "Visa fees",
      "Lunches & dinners (unless specified)",
      "Personal expenses",
      "Gratuities",
    ]),
    itinerary: J([
      { day: 1, title: "Arrival & Dubai Mall", description: "Airport pickup, hotel check-in, evening at Dubai Mall and fountain show." },
      { day: 2, title: "Burj Khalifa & Marina Cruise", description: "Morning at Burj Khalifa, afternoon Marina yacht cruise." },
      { day: 3, title: "Desert Safari", description: "Afternoon pickup, dune bashing, camel ride, BBQ dinner under stars." },
      { day: 4, title: "Departure", description: "Breakfast and airport transfer." },
    ]),
    meetingPoint: "Dubai International Airport (DXB)",
    languages: J(["English", "Arabic", "Hindi"]),
    cancellationHrs: 48,
    featured: true,
    destinationSlug: "dubai",
  },
  {
    title: "Dubai Desert Safari with BBQ",
    slug: "dubai-desert-safari-bbq",
    summary: "Dune bashing, camel rides, and a starlit BBQ dinner.",
    description:
      "Afternoon pickup in a 4x4, dune bashing in the red dunes, sandboarding, camel ride, henna, tanoura show, and a buffet BBQ dinner under the stars.",
    price: 85,
    durationDays: 1,
    maxGuests: 25,
    coverImage:
      "https://images.unsplash.com/photo-1452022582947-b521d8779ab6?w=1200",
    highlights: J([
      "Dune bashing in a 4x4 Land Cruiser",
      "Sandboarding on red dunes",
      "Camel ride & henna painting",
      "Tanoura & fire show",
      "Buffet BBQ dinner under the stars",
    ]),
    meetingPoint: "Hotel pickup anywhere in Dubai",
    languages: J(["English", "Arabic"]),
    cancellationHrs: 24,
    featured: true,
    destinationSlug: "dubai",
  },
  {
    title: "Burj Khalifa At The Top",
    slug: "dubai-burj-khalifa-at-the-top",
    summary: "Skip-the-line tickets to the world's tallest building.",
    description:
      "Fast-track entry to levels 124 and 125 of Burj Khalifa. Includes access to the outdoor observation deck and a multimedia presentation.",
    price: 55,
    durationDays: 1,
    maxGuests: 30,
    coverImage:
      "https://images.unsplash.com/photo-1582672060674-bc2bd808a8f5?w=1200",
    highlights: J([
      "Skip-the-line entry",
      "124th & 125th floor observation decks",
      "Outdoor terrace with 360° views",
      "Multimedia presentation on Dubai's history",
    ]),
    meetingPoint: "Dubai Mall, Lower Ground Level",
    languages: J(["English", "Arabic"]),
    cancellationHrs: 24,
    featured: false,
    destinationSlug: "dubai",
  },

  // ---------- ISTANBUL ----------
  {
    title: "Istanbul 4-Day Cultural Journey",
    slug: "istanbul-4-day-cultural-journey",
    summary: "Hagia Sophia, Blue Mosque, Grand Bazaar, and Bosphorus cruise.",
    description:
      "Guided tours of Istanbul's top landmarks, a Bosphorus dinner cruise, and free time in the Grand Bazaar. Central boutique hotel included.",
    price: 649,
    durationDays: 4,
    maxGuests: 12,
    coverImage:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200",
    images: J([
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200",
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1200",
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200",
    ]),
    highlights: J([
      "Hagia Sophia & Blue Mosque guided tours",
      "Grand Bazaar shopping experience",
      "Bosphorus dinner cruise with live music",
      "Topkapi Palace visit",
    ]),
    included: J([
      "3 nights in a boutique hotel",
      "Daily breakfast",
      "All guided tours",
      "Bosphorus dinner cruise",
      "Airport transfers",
    ]),
    notIncluded: J([
      "International flights",
      "Visa fees",
      "Lunches & dinners (unless specified)",
      "Personal expenses",
    ]),
    itinerary: J([
      { day: 1, title: "Arrival & Old City", description: "Hotel check-in, evening walk through Sultanahmet." },
      { day: 2, title: "Hagia Sophia & Blue Mosque", description: "Guided tour of the two iconic landmarks, Grand Bazaar visit." },
      { day: 3, title: "Bosphorus Cruise", description: "Morning Topkapi Palace, evening Bosphorus dinner cruise." },
      { day: 4, title: "Departure", description: "Breakfast and airport transfer." },
    ]),
    meetingPoint: "Istanbul Airport (IST)",
    languages: J(["English", "Turkish"]),
    cancellationHrs: 48,
    featured: true,
    destinationSlug: "istanbul",
  },
  {
    title: "Bosphorus Sunset Cruise",
    slug: "istanbul-bosphorus-sunset-cruise",
    summary: "Sail between two continents as the sun sets.",
    description:
      "A 2-hour cruise along the Bosphorus with views of palaces, mosques, and bridges. Includes Turkish snacks and live music.",
    price: 45,
    durationDays: 1,
    maxGuests: 40,
    coverImage:
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1200",
    highlights: J([
      "2-hour sunset cruise",
      "Views of Dolmabahçe Palace & Bosphorus Bridge",
      "Turkish snacks & drinks included",
      "Live music on board",
    ]),
    meetingPoint: "Kabataş Pier, Istanbul",
    languages: J(["English", "Turkish"]),
    cancellationHrs: 24,
    featured: false,
    destinationSlug: "istanbul",
  },

  // ---------- MALDIVES ----------
  {
    title: "Maldives Overwater Villa 6-Day",
    slug: "maldives-overwater-villa-6-day",
    summary: "Stay in an overwater bungalow with all meals included.",
    description:
      "6 days in a private overwater villa, seaplane transfer, all-inclusive dining, snorkeling gear, and a sunset dolphin cruise.",
    price: 2899,
    durationDays: 6,
    maxGuests: 4,
    coverImage:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200",
    images: J([
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200",
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200",
    ]),
    highlights: J([
      "Private overwater villa",
      "Seaplane transfer with aerial views",
      "All-inclusive dining & drinks",
      "Sunset dolphin cruise",
      "Snorkeling with manta rays",
    ]),
    included: J([
      "5 nights in an overwater villa",
      "All meals & selected drinks",
      "Seaplane transfers",
      "Snorkeling gear",
      "Sunset dolphin cruise",
      "Kayaks & paddleboards",
    ]),
    notIncluded: J([
      "International flights",
      "Spa treatments",
      "Premium alcohol",
      "Diving courses",
      "Gratuities",
    ]),
    itinerary: J([
      { day: 1, title: "Arrival & Seaplane", description: "Seaplane transfer to the resort, villa check-in, welcome dinner." },
      { day: 2, title: "Snorkeling & Beach Day", description: "Guided house-reef snorkeling, afternoon at the beach." },
      { day: 3, title: "Dolphin Cruise", description: "Sunset dolphin cruise, dinner at an overwater restaurant." },
      { day: 4, title: "Manta Ray Excursion", description: "Boat trip to swim with manta rays." },
      { day: 5, title: "Free Day & Spa", description: "Free morning, optional spa treatment, farewell dinner." },
      { day: 6, title: "Departure", description: "Breakfast and seaplane transfer." },
    ]),
    meetingPoint: "Velana International Airport (MLE), Malé",
    languages: J(["English", "Dhivehi"]),
    cancellationHrs: 72,
    featured: true,
    destinationSlug: "maldives",
  },
  {
    title: "Maldives Snorkeling & Dolphin Cruise",
    slug: "maldives-snorkeling-dolphin-cruise",
    summary: "Swim with manta rays and spot wild dolphins at sunset.",
    description:
      "Half-day snorkeling trip to a coral reef, followed by a sunset dolphin-watching cruise with snacks and drinks.",
    price: 130,
    durationDays: 1,
    maxGuests: 20,
    coverImage:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200",
    highlights: J([
      "Snorkeling at a vibrant coral reef",
      "Sunset dolphin-watching cruise",
      "Snacks & drinks included",
      "Small group size (max 20)",
    ]),
    meetingPoint: "Resort jetty or Malé harbor",
    languages: J(["English"]),
    cancellationHrs: 24,
    featured: false,
    destinationSlug: "maldives",
  },

  // ---------- ROME ----------
  {
    title: "Rome 3-Day Ancient Wonders",
    slug: "rome-3-day-ancient-wonders",
    summary: "Colosseum, Vatican, and Trevi Fountain in 3 days.",
    description:
      "Skip-the-line Colosseum and Roman Forum tour, Vatican Museums with Sistine Chapel, and a food tour through Trastevere.",
    price: 599,
    durationDays: 3,
    maxGuests: 10,
    coverImage:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200",
    images: J([
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200",
      "https://images.unsplash.com/photo-1525874684015-58379d421a52?w=1200",
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1200",
    ]),
    highlights: J([
      "Skip-the-line Colosseum & Roman Forum",
      "Vatican Museums & Sistine Chapel",
      "Trevi Fountain & Pantheon",
      "Trastevere food walking tour",
    ]),
    meetingPoint: "Colosseum main entrance",
    languages: J(["English", "Italian"]),
    cancellationHrs: 48,
    featured: true,
    destinationSlug: "rome",
  },
  {
    title: "Colosseum Underground Tour",
    slug: "rome-colosseum-underground-tour",
    summary: "Go beneath the arena floor where gladiators waited.",
    description:
      "Exclusive access to the Colosseum's underground passages and arena floor. Includes Roman Forum and Palatine Hill entry.",
    price: 95,
    durationDays: 1,
    maxGuests: 15,
    coverImage:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200",
    highlights: J([
      "Exclusive underground passages access",
      "Walk on the arena floor",
      "Roman Forum & Palatine Hill entry",
      "Expert archaeologist guide",
    ]),
    meetingPoint: "Colosseum main entrance",
    languages: J(["English", "Italian", "Spanish"]),
    cancellationHrs: 24,
    featured: false,
    destinationSlug: "rome",
  },

  // ---------- TOKYO ----------
  {
    title: "Tokyo 5-Day Neon & Tradition",
    slug: "tokyo-5-day-neon-tradition",
    summary: "Shibuya, temples, sushi, and Mt. Fuji day trip.",
    description:
      "Includes guided Shibuya and Shinjuku tours, Asakusa temple visit, a sushi-making class, and a day trip to Mt. Fuji with Lake Kawaguchi.",
    price: 1299,
    durationDays: 5,
    maxGuests: 8,
    coverImage:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200",
    images: J([
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200",
      "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=1200",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200",
    ]),
    highlights: J([
      "Shibuya Crossing & Shinjuku tour",
      "Senso-ji Temple in Asakusa",
      "Hands-on sushi-making class",
      "Mt. Fuji & Lake Kawaguchi day trip",
      "Tokyo Skytree visit",
    ]),
    meetingPoint: "Narita International Airport (NRT)",
    languages: J(["English", "Japanese"]),
    cancellationHrs: 48,
    featured: true,
    destinationSlug: "tokyo",
  },
  {
    title: "Mt. Fuji & Lake Kawaguchi Day Trip",
    slug: "tokyo-mt-fuji-lake-kawaguchi",
    summary: "See Japan's iconic volcano up close.",
    description:
      "Comfortable coach from Tokyo, visit to Mt. Fuji 5th Station, Lake Kawaguchi, and a traditional Japanese lunch.",
    price: 110,
    durationDays: 1,
    maxGuests: 40,
    coverImage:
      "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=1200",
    highlights: J([
      "Mt. Fuji 5th Station visit",
      "Lake Kawaguchi scenic views",
      "Traditional Japanese lunch",
      "Round-trip coach from Tokyo",
    ]),
    meetingPoint: "Shinjuku Station, Tokyo",
    languages: J(["English", "Japanese"]),
    cancellationHrs: 24,
    featured: false,
    destinationSlug: "tokyo",
  },

  // ---------- REYKJAVIK ----------
  {
    title: "Iceland 5-Day Northern Lights",
    slug: "reykjavik-5-day-northern-lights",
    summary: "Chase the aurora, soak in lagoons, and walk on glaciers.",
    description:
      "Includes Golden Circle tour, Blue Lagoon entry, glacier hike, and a northern lights hunt with a local guide.",
    price: 1499,
    durationDays: 5,
    maxGuests: 12,
    coverImage:
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200",
    images: J([
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200",
      "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=1200",
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200",
    ]),
    highlights: J([
      "Golden Circle: Þingvellir, Geysir, Gullfoss",
      "Blue Lagoon geothermal spa entry",
      "Glacier hike with crampons",
      "Northern lights hunt with a local guide",
      "Reykjavik city tour",
    ]),
    included: J([
      "4 nights in a 4-star hotel",
      "Daily breakfast",
      "Golden Circle tour",
      "Blue Lagoon entry & towel",
      "Glacier hike with gear",
      "Northern lights tour (weather permitting)",
    ]),
    notIncluded: J([
      "International flights",
      "Lunches & dinners (unless specified)",
      "Personal expenses",
      "Gratuities",
    ]),
    itinerary: J([
      { day: 1, title: "Arrival in Reykjavik", description: "Airport transfer, hotel check-in, evening city walk." },
      { day: 2, title: "Golden Circle", description: "Full-day tour of Þingvellir, Geysir, and Gullfoss." },
      { day: 3, title: "Glacier Hike & South Coast", description: "Hike Sólheimajökull glacier, visit Seljalandsfoss & Skógafoss." },
      { day: 4, title: "Blue Lagoon & Northern Lights", description: "Morning at Blue Lagoon, evening northern lights hunt." },
      { day: 5, title: "Departure", description: "Breakfast and airport transfer." },
    ]),
    meetingPoint: "Keflavík International Airport (KEF)",
    languages: J(["English", "Icelandic"]),
    cancellationHrs: 48,
    featured: true,
    destinationSlug: "reykjavik",
  },
  {
    title: "Golden Circle & Blue Lagoon",
    slug: "reykjavik-golden-circle-blue-lagoon",
    summary: "Geysers, waterfalls, and a geothermal spa in one day.",
    description:
      "Full-day tour of Þingvellir, Geysir, and Gullfoss, ending with a relaxing soak at the Blue Lagoon. Includes entry and towel.",
    price: 175,
    durationDays: 1,
    maxGuests: 20,
    coverImage:
      "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=1200",
    highlights: J([
      "Þingvellir National Park",
      "Strokkur geyser eruptions",
      "Gullfoss waterfall",
      "Blue Lagoon entry & towel",
    ]),
    meetingPoint: "Reykjavik city center hotels",
    languages: J(["English"]),
    cancellationHrs: 24,
    featured: true,
    destinationSlug: "reykjavik",
  },

  // ---------- BARCELONA ----------
  {
    title: "Barcelona 4-Day Gaudí & Tapas",
    slug: "barcelona-4-day-gaudi-tapas",
    summary: "Sagrada Família, Park Güell, and a tapas crawl.",
    description:
      "Skip-the-line Sagrada Família and Park Güell tours, Gothic Quarter walk, and a guided tapas and wine evening.",
    price: 749,
    durationDays: 4,
    maxGuests: 10,
    coverImage:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200",
    images: J([
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200",
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200",
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=1200",
    ]),
    highlights: J([
      "Skip-the-line Sagrada Família",
      "Park Güell guided tour",
      "Gothic Quarter walking tour",
      "Tapas & wine tasting evening",
    ]),
    meetingPoint: "Sagrada Família main entrance",
    languages: J(["English", "Spanish", "Catalan"]),
    cancellationHrs: 48,
    featured: true,
    destinationSlug: "barcelona",
  },
  {
    title: "Sagrada Família Skip-the-Line Tour",
    slug: "barcelona-sagrada-familia-tour",
    summary: "Gaudí's masterpiece with an expert guide.",
    description:
      "Skip-the-line entry and a 1.5-hour guided tour of the Sagrada Família, including the Passion and Nativity façades.",
    price: 65,
    durationDays: 1,
    maxGuests: 15,
    coverImage:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200",
    highlights: J([
      "Skip-the-line entry",
      "1.5-hour expert guided tour",
      "Passion & Nativity façades",
      "Small group size",
    ]),
    meetingPoint: "Sagrada Família main entrance",
    languages: J(["English", "Spanish"]),
    cancellationHrs: 24,
    featured: false,
    destinationSlug: "barcelona",
  },

  // ---------- CAPE TOWN ----------
  {
    title: "Cape Town 5-Day Safari & Wine",
    slug: "cape-town-5-day-safari-wine",
    summary: "Table Mountain, Cape Winelands, and a Big Five safari.",
    description:
      "Table Mountain cable car, Cape Point day trip, Stellenbosch wine tasting, and a 2-day Big Five safari in a private reserve.",
    price: 1699,
    durationDays: 5,
    maxGuests: 10,
    coverImage:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200",
    images: J([
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200",
      "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=1200",
    ]),
    highlights: J([
      "Table Mountain cable car",
      "Cape Point & Boulders Beach penguins",
      "Stellenbosch wine tasting",
      "2-day Big Five safari",
    ]),
    meetingPoint: "Cape Town International Airport (CPT)",
    languages: J(["English", "Afrikaans"]),
    cancellationHrs: 72,
    featured: true,
    destinationSlug: "cape-town",
  },
  {
    title: "Cape Peninsula & Boulders Beach",
    slug: "cape-town-peninsula-boulders-beach",
    summary: "See wild penguins at Boulders Beach.",
    description:
      "Full-day tour of the Cape Peninsula: Chapman's Peak, Cape of Good Hope, and a stop to see African penguins at Boulders Beach.",
    price: 95,
    durationDays: 1,
    maxGuests: 20,
    coverImage:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200",
    highlights: J([
      "Chapman's Peak scenic drive",
      "Cape of Good Hope",
      "Boulders Beach penguin colony",
      "Kirstenbosch Botanical Gardens",
    ]),
    meetingPoint: "Cape Town city center hotels",
    languages: J(["English"]),
    cancellationHrs: 24,
    featured: false,
    destinationSlug: "cape-town",
  },

  // ---------- MEXICO CITY ----------
  {
    title: "Mexico City 4-Day Aztec & Tacos",
    slug: "mexico-city-4-day-aztec-tacos",
    summary: "Teotihuacán, Frida Kahlo, and the best street tacos.",
    description:
      "Pyramids of Teotihuacán, Frida Kahlo Museum, Xochimilco boat ride, and a guided street-food tour of Centro Histórico.",
    price: 599,
    durationDays: 4,
    maxGuests: 12,
    coverImage:
      "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1200",
    images: J([
      "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1200",
      "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1200",
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200",
    ]),
    highlights: J([
      "Teotihuacán pyramids",
      "Frida Kahlo Museum (Casa Azul)",
      "Xochimilco colorful boat ride",
      "Centro Histórico street food tour",
    ]),
    meetingPoint: "Mexico City International Airport (MEX)",
    languages: J(["English", "Spanish"]),
    cancellationHrs: 48,
    featured: true,
    destinationSlug: "mexico-city",
  },
  {
    title: "Teotihuacán Pyramids Day Trip",
    slug: "mexico-city-teotihuacan-pyramids",
    summary: "Climb the Pyramid of the Sun with a local guide.",
    description:
      "Early-morning departure to Teotihuacán to beat the crowds, guided tour of the pyramids, and a stop at a local obsidian workshop.",
    price: 55,
    durationDays: 1,
    maxGuests: 25,
    coverImage:
      "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1200",
    highlights: J([
      "Climb the Pyramid of the Sun",
      "Walk the Avenue of the Dead",
      "Local obsidian workshop visit",
      "Early departure to beat the crowds",
    ]),
    meetingPoint: "Mexico City hotels or Zócalo",
    languages: J(["English", "Spanish"]),
    cancellationHrs: 24,
    featured: false,
    destinationSlug: "mexico-city",
  },

  // ---------- LONDON ----------
  {
    title: "London 4-Day Royal Experience",
    slug: "london-4-day-royal-experience",
    summary: "Buckingham Palace, Tower of London, and a Thames cruise.",
    description:
      "Includes Tower of London entry, Buckingham Palace visit, London Eye, Thames dinner cruise, and a day trip to Windsor Castle.",
    price: 1099,
    durationDays: 4,
    maxGuests: 10,
    coverImage:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200",
    images: J([
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200",
      "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1200",
      "https://images.unsplash.com/photo-1520986606214-8b456906c813?w=1200",
    ]),
    highlights: J([
      "Tower of London & Crown Jewels",
      "Buckingham Palace visit",
      "London Eye ride",
      "Thames dinner cruise",
      "Windsor Castle day trip",
    ]),
    meetingPoint: "Heathrow Airport (LHR)",
    languages: J(["English"]),
    cancellationHrs: 48,
    featured: true,
    destinationSlug: "london",
  },
  {
    title: "Tower of London & Crown Jewels",
    slug: "london-tower-of-london-crown-jewels",
    summary: "900 years of history in one fortress.",
    description:
      "Skip-the-line entry to the Tower of London with a Beefeater-guided tour, Crown Jewels viewing, and access to the White Tower.",
    price: 60,
    durationDays: 1,
    maxGuests: 20,
    coverImage:
      "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1200",
    highlights: J([
      "Beefeater-guided tour",
      "Crown Jewels viewing",
      "White Tower & medieval palace",
      "Skip-the-line entry",
    ]),
    meetingPoint: "Tower of London main entrance",
    languages: J(["English"]),
    cancellationHrs: 24,
    featured: false,
    destinationSlug: "london",
  },
];

// ==========================================
// SEED LOGIC
// ==========================================
async function main() {
  console.log("🌱 Starting seed...\n");

  // 1. Upsert destinations
  console.log("📍 Seeding destinations...");
  const destinationMap = new Map<string, string>();

  for (const dest of destinations) {
    const created = await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: dest,
      create: dest,
    });
    destinationMap.set(dest.slug, created.id);
    console.log(`   ✅ ${dest.name}, ${dest.country}`);
  }

  // 2. Upsert tours
  console.log("\n🎫 Seeding tours...");
  for (const tour of tours) {
    const { destinationSlug, ...tourData } = tour;

    const destinationId = destinationMap.get(destinationSlug);
    if (!destinationId) {
      console.warn(`   ⚠️  Skipping ${tour.title} — destination not found`);
      continue;
    }

    // Apply defaults for any missing detail field
    const payload = {
      ...tourData,
      price: new Prisma.Decimal(tourData.price),
      destinationId,
      highlights: tourData.highlights ?? J(DEFAULT_HIGHLIGHTS),
      included: tourData.included ?? J(DEFAULT_INCLUDED),
      notIncluded: tourData.notIncluded ?? J(DEFAULT_NOT_INCLUDED),
      languages: tourData.languages ?? J(DEFAULT_LANGUAGES),
      cancellationHrs: tourData.cancellationHrs ?? 24,
      images:
        tourData.images ??
        J([tourData.coverImage].filter(Boolean) as string[]),
    };

    await prisma.tour.upsert({
      where: { slug: tour.slug },
      update: payload,
      create: payload,
    });
    console.log(`   ✅ ${tour.title}`);
  }

  // 3. Summary
  const destCount = await prisma.destination.count();
  const tourCount = await prisma.tour.count();
  const featuredCount = await prisma.tour.count({
    where: { featured: true },
  });

  console.log("\n✨ Seed complete!");
  console.log(`   📍 ${destCount} destinations`);
  console.log(`   🎫 ${tourCount} tours`);
  console.log(`   🖼️  ${featuredCount} featured\n`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });