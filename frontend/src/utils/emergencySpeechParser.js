// Campus Sentinel - Robust NLP Emergency Voice & Text Parser
// Normalizes speech and text inputs into structured emergency fields matching the 15 official Vignan University campus blocks.

export const OFFICIAL_BLOCKS = [
  "A-BLOCK",
  "H-BLOCK",
  "NTR LIBRARY",
  "MHP",
  "N-BLOCK",
  "U-BLOCK",
  "BOYS HOSTEL",
  "PHARMACY BLOCK",
  "CONVOCATION",
  "DINING HALL",
  "PLAYGROUND",
  "GUEST HOUSE",
  "LARA CAMPUS",
  "PRIYADARSHINI GIRLS HOSTEL",
  "LARA GATE"
];

/**
 * Normalizes speech input into structured incident type, official campus block, floor, room, and specific area.
 * @param {string} text - Raw speech transcript or typed description
 * @param {Object} currentValues - Existing form state { incidentType, locationBuilding, specificLocation }
 * @returns {Object} Parsed structured data
 */
export function parseEmergencySpeech(text, currentValues = {}) {
  if (!text || typeof text !== "string" || !text.trim()) {
    return {
      incidentType: currentValues.incidentType || "FIRE",
      campusBlock: currentValues.locationBuilding || "A-BLOCK",
      floor: null,
      room: null,
      specificArea: currentValues.specificLocation || "",
      description: text || "",
      hasLocationChanged: false,
      hasTypeChanged: false,
      extractedSummary: null
    };
  }

  const raw = text.trim();
  const lower = raw.toLowerCase();

  // -------------------------------------------------------------
  // 1. INCIDENT TYPE CLASSIFICATION
  // -------------------------------------------------------------
  let detectedType = null;

  // Fire keywords
  if (
    lower.includes("fire") ||
    lower.includes("flame") ||
    lower.includes("smoke") ||
    lower.includes("burning") ||
    lower.includes("explosion") ||
    lower.includes("blast")
  ) {
    detectedType = "FIRE";
  }
  // Medical keywords (tested before accident so "medical emergency" isn't overridden)
  else if (
    lower.includes("medical") ||
    lower.includes("heart") ||
    lower.includes("collapse") ||
    lower.includes("collapsed") ||
    lower.includes("faint") ||
    lower.includes("fainted") ||
    lower.includes("bleed") ||
    lower.includes("bleeding") ||
    lower.includes("unconscious") ||
    lower.includes("seizure") ||
    lower.includes("injured") ||
    lower.includes("injury") ||
    lower.includes("sick") ||
    lower.includes("ambulance") ||
    lower.includes("paramedic") ||
    lower.includes("trauma") ||
    lower.includes("emergency")
  ) {
    detectedType = "MEDICAL";
  }
  // Security keywords
  else if (
    lower.includes("security") ||
    lower.includes("intruder") ||
    lower.includes("threat") ||
    lower.includes("unauthorized") ||
    lower.includes("fight") ||
    lower.includes("weapon") ||
    lower.includes("gun") ||
    lower.includes("knife") ||
    lower.includes("theft") ||
    lower.includes("robbery") ||
    lower.includes("trespass") ||
    lower.includes("attack") ||
    lower.includes("hostile")
  ) {
    detectedType = "SECURITY";
  }
  // Severe weather keywords
  else if (
    lower.includes("heavy rain") ||
    lower.includes("rain") ||
    lower.includes("flood") ||
    lower.includes("flooding") ||
    lower.includes("cyclone") ||
    lower.includes("storm") ||
    lower.includes("lightning") ||
    lower.includes("thunder") ||
    lower.includes("tree fell") ||
    lower.includes("water leak")
  ) {
    detectedType = "WEATHER";
  }
  // Accident keywords
  else if (
    lower.includes("accident") ||
    lower.includes("crash") ||
    lower.includes("collision") ||
    lower.includes("vehicle") ||
    lower.includes("bike crash") ||
    lower.includes("car crash") ||
    lower.includes("bus accident") ||
    lower.includes("hit and run")
  ) {
    detectedType = "ACCIDENT";
  }
  // Crowd & stampede keywords
  else if (
    lower.includes("stampede") ||
    lower.includes("crowd") ||
    lower.includes("surge") ||
    lower.includes("bottleneck") ||
    lower.includes("blocked exit") ||
    lower.includes("overcrowd")
  ) {
    detectedType = "CROWD";
  }

  // -------------------------------------------------------------
  // 2. CAMPUS BLOCK EXTRACTION (Strict 15 Vignan locations)
  // -------------------------------------------------------------
  let detectedBlock = null;

  // Specific multi-word / priority checks first
  if (/\b(priyadarshini\s*girls\s*hostel|priyadarshini\s*hostel|priyadarshini|girls\s*hostel|women['’]?s?\s*hostel|ladies\s*hostel)\b/i.test(lower)) {
    detectedBlock = "PRIYADARSHINI GIRLS HOSTEL";
  } else if (/\b(vignan\s*vihar\s*boys\s*hostel|vignan\s*vihar|boys?\s*hostel|men['’]?s?\s*hostel|gents\s*hostel)\b/i.test(lower)) {
    detectedBlock = "BOYS HOSTEL";
  } else if (/\b(lara\s*gate|main\s*gate|entry\s*gate|exit\s*gate|north\s*gate)\b/i.test(lower)) {
    detectedBlock = "LARA GATE";
  } else if (/\b(lara\s*campus|lara\s*institute|lara)\b/i.test(lower)) {
    detectedBlock = "LARA CAMPUS";
  } else if (/\b(ntr\s*vignan\s*library|ntr\s*library|ntr|central\s*library|library|main\s*library)\b/i.test(lower)) {
    detectedBlock = "NTR LIBRARY";
  } else if (/\b(mhp\s*auditorium|mhp\s*block|mhp|auditorium|mahati\s*pranganam)\b/i.test(lower)) {
    detectedBlock = "MHP";
  } else if (/\b(pharmacy\s*block|pharmaceutical|pharmacy)\b/i.test(lower)) {
    detectedBlock = "PHARMACY BLOCK";
  } else if (/\b(convocation\s*(hall|lawn|open\s*lawn)?|sangamithra)\b/i.test(lower)) {
    detectedBlock = "CONVOCATION";
  } else if (/\b(dining\s*hall|canteen|cafeteria|mess|dining|food\s*court)\b/i.test(lower)) {
    detectedBlock = "DINING HALL";
  } else if (/\b(playground|sports\s*ground|cricket\s*ground|stadium|ground)\b/i.test(lower)) {
    detectedBlock = "PLAYGROUND";
  } else if (/\b(guest\s*house|vip\s*guest\s*house)\b/i.test(lower)) {
    detectedBlock = "GUEST HOUSE";
  } else if (/\b(administration\s*block|administrative\s*block|admin\s*block|a[\s-]?block|block[\s-]?a|ablock)\b/i.test(lower)) {
    detectedBlock = "A-BLOCK";
  } else if (/\b(visweswaraya\s*block|visvesvaraya\s*block|visweswaraya|h[\s-]?block|block[\s-]?h|hblock)\b/i.test(lower)) {
    detectedBlock = "H-BLOCK";
  } else if (/\b(ntr\s*vignan\s*bhavan|cse\s*block|it\s*block|computer\s*science|n[\s-]?block|block[\s-]?n|nblock)\b/i.test(lower)) {
    detectedBlock = "N-BLOCK";
  } else if (/\b(aryabhatta\s*block|aryabhatta|u[\s-]?block|block[\s-]?u|ublock)\b/i.test(lower)) {
    detectedBlock = "U-BLOCK";
  }

  // -------------------------------------------------------------
  // 3. FLOOR EXTRACTION
  // -------------------------------------------------------------
  let detectedFloor = null;

  if (/\b(ground\s*floor|ground\s*level|ground)\b/i.test(lower)) {
    detectedFloor = "Ground Floor";
  } else if (/\b(first\s*floor|1st\s*floor|floor\s*1|1st\s*level)\b/i.test(lower)) {
    detectedFloor = "1st Floor";
  } else if (/\b(second\s*floor|2nd\s*floor|floor\s*2|2nd\s*level)\b/i.test(lower)) {
    detectedFloor = "2nd Floor";
  } else if (/\b(third\s*floor|3rd\s*floor|floor\s*3|3rd\s*level)\b/i.test(lower)) {
    detectedFloor = "3rd Floor";
  } else if (/\b(fourth\s*floor|4th\s*floor|floor\s*4|4th\s*level)\b/i.test(lower)) {
    detectedFloor = "4th Floor";
  } else if (/\b(fifth\s*floor|5th\s*floor|floor\s*5|5th\s*level)\b/i.test(lower)) {
    detectedFloor = "5th Floor";
  } else if (/\b(basement|cellar)\b/i.test(lower)) {
    detectedFloor = "Basement";
  } else if (/\b(terrace|roof|rooftop)\b/i.test(lower)) {
    detectedFloor = "Terrace / Rooftop";
  } else {
    const genericFloor = raw.match(/(\d+)(st|nd|rd|th)?\s*(floor|level)/i);
    if (genericFloor) {
      detectedFloor = `${genericFloor[1]}th Floor`;
    }
  }

  // -------------------------------------------------------------
  // 4. ROOM & SPECIFIC AREA EXTRACTION
  // -------------------------------------------------------------
  let detectedRoom = null;

  const roomRegex = /\b(room|lab|hall|seminar\s*hall|cabin|office)\s+(no\.?|number)?\s*([a-z0-9-]+)\b/i;
  const roomMatch = raw.match(roomRegex);
  if (roomMatch) {
    const label = roomMatch[1].charAt(0).toUpperCase() + roomMatch[1].slice(1).toLowerCase();
    const number = roomMatch[3].toUpperCase();
    detectedRoom = `${label} ${number}`;
  } else {
    // Check for standalone 3-digit room numbers like "302" or "105"
    const standaloneRoom = raw.match(/\b(in|at|room|lab)?\s*(\d{3}[a-z]?)\b/i);
    if (standaloneRoom && standaloneRoom[2]) {
      detectedRoom = `Room ${standaloneRoom[2].toUpperCase()}`;
    }
  }

  // -------------------------------------------------------------
  // 5. COMBINE SPECIFIC AREA STRING
  // -------------------------------------------------------------
  let specificArea = "";
  if (detectedRoom && detectedFloor) {
    specificArea = `${detectedRoom}, ${detectedFloor}`;
  } else if (detectedRoom) {
    specificArea = detectedRoom;
  } else if (detectedFloor) {
    specificArea = detectedFloor;
  }

  // -------------------------------------------------------------
  // 6. ASSEMBLE FINAL RESULTS WITH FALLBACK PRESERVATION
  // -------------------------------------------------------------
  const finalType = detectedType || currentValues.incidentType || "FIRE";
  const finalBlock = detectedBlock || currentValues.locationBuilding || "A-BLOCK";
  const finalSpecificArea = specificArea !== "" ? specificArea : (currentValues.specificLocation || "");

  // Build human-friendly confirmation line
  const typeLabel = finalType === "FIRE" ? "Fire" : finalType === "MEDICAL" ? "Medical Emergency" : finalType === "SECURITY" ? "Security Incident" : finalType === "WEATHER" ? "Severe Weather" : finalType === "ACCIDENT" ? "Accident" : "Other Emergency";
  
  let confirmationParts = [`Incident: ${typeLabel}`];
  if (detectedBlock) confirmationParts.push(`Location: ${detectedBlock}`);
  if (detectedRoom) confirmationParts.push(detectedRoom);
  if (detectedFloor) confirmationParts.push(detectedFloor);

  const summary = `✓ Voice Analyzed: ${confirmationParts.join(" • ")}`;

  return {
    incidentType: finalType,
    campusBlock: finalBlock,
    floor: detectedFloor,
    room: detectedRoom,
    specificArea: finalSpecificArea,
    description: raw,
    hasLocationChanged: !!detectedBlock && detectedBlock !== currentValues.locationBuilding,
    hasTypeChanged: !!detectedType && detectedType !== currentValues.incidentType,
    extractedSummary: summary
  };
}
