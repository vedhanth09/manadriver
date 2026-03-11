export const JOB_TYPES = [
  { value: "hourly", label: "Hourly" },
  { value: "temporary", label: "Temporary" },
  { value: "permanent", label: "Permanent" },
] as const

export const CAR_TYPES = [
  { value: "hatchback", label: "Hatchback" },
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "luxury", label: "Luxury" },
] as const

export const TRANSMISSION_TYPES = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
  { value: "semi-automatic", label: "Semi-Automatic" },
] as const

export const VEHICLE_CATEGORIES = [
  { value: "hatchback", label: "Hatchback" },
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "luxury", label: "Luxury" },
] as const

export const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Kochi",
] as const

export const CITY_AREAS: Record<string, string[]> = {
  Mumbai: ["Andheri", "Bandra", "Borivali", "Churchgate", "Colaba", "Dadar", "Goregaon", "Juhu", "Malad", "Powai", "Thane", "Worli"],
  Delhi: ["Connaught Place", "Dwarka", "Greater Kailash", "Hauz Khas", "Karol Bagh", "Lajpat Nagar", "Nehru Place", "Rohini", "Saket", "Vasant Kunj"],
  Bangalore: ["Indiranagar", "Koramangala", "Electronic City", "Whitefield", "HSR Layout", "Jayanagar", "Marathahalli", "MG Road", "Hebbal", "Yelahanka"],
  Hyderabad: ["Banjara Hills", "HITEC City", "Gachibowli", "Jubilee Hills", "Kukatpally", "Madhapur", "Secunderabad", "Ameerpet", "LB Nagar", "Uppal"],
  Chennai: ["Adyar", "Anna Nagar", "T. Nagar", "Velachery", "OMR", "Mylapore", "Nungambakkam", "Porur", "Tambaram", "Guindy"],
  Pune: ["Koregaon Park", "Hinjewadi", "Kharadi", "Viman Nagar", "Baner", "Wakad", "Aundh", "Hadapsar", "Kothrud", "Deccan"],
  Kolkata: ["Salt Lake", "Park Street", "New Town", "Howrah", "Dum Dum", "Ballygunge", "Gariahat", "Alipore", "Behala", "Jadavpur"],
  Ahmedabad: ["Navrangpura", "Satellite", "Vastrapur", "SG Highway", "Maninagar", "Bopal", "Prahladnagar", "Ashram Road", "Ellis Bridge", "Thaltej"],
  Jaipur: ["C-Scheme", "Malviya Nagar", "Vaishali Nagar", "Mansarovar", "Tonk Road", "Raja Park", "Bani Park", "Jagatpura", "Sodala", "Ajmer Road"],
  Lucknow: ["Hazratganj", "Gomti Nagar", "Aliganj", "Indira Nagar", "Aminabad", "Alambagh", "Mahanagar", "Rajajipuram", "Vikas Nagar", "Jankipuram"],
  Chandigarh: ["Sector 17", "Sector 22", "Sector 35", "Sector 43", "IT Park", "Manimajra", "Panchkula", "Mohali", "Zirakpur", "Kharar"],
  Kochi: ["MG Road", "Edappally", "Kakkanad", "Fort Kochi", "Marine Drive", "Vyttila", "Palarivattom", "Aluva", "Kaloor", "Tripunithura"],
}

export const JOB_STATUSES = [
  { value: "posted", label: "Posted" },
  { value: "applied", label: "Applied" },
  { value: "accepted", label: "Accepted" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const

export const APPLICATION_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
] as const
