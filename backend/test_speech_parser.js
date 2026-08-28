// Test suite for emergency speech parser
import { parseEmergencySpeech } from "../frontend/src/utils/emergencySpeechParser.js";

const testCases = [
  {
    input: "There is a fire accident in A-BLOCK, Room 302, 3rd Floor.",
    expected: {
      incidentType: "FIRE",
      campusBlock: "A-BLOCK",
      floor: "3rd Floor",
      room: "Room 302",
      specificArea: "Room 302, 3rd Floor"
    }
  },
  {
    input: "There is a medical emergency in N Block, third floor, room 302.",
    expected: {
      incidentType: "MEDICAL",
      campusBlock: "N-BLOCK",
      floor: "3rd Floor",
      room: "Room 302",
      specificArea: "Room 302, 3rd Floor"
    }
  },
  {
    input: "Medical emergency near NTR Library.",
    expected: {
      incidentType: "MEDICAL",
      campusBlock: "NTR LIBRARY"
    }
  },
  {
    input: "Security issue at Lara Gate.",
    expected: {
      incidentType: "SECURITY",
      campusBlock: "LARA GATE"
    }
  },
  {
    input: "Accident near Boys Hostel.",
    expected: {
      incidentType: "ACCIDENT",
      campusBlock: "BOYS HOSTEL"
    }
  },
  {
    input: "There is heavy rain near H block.",
    expected: {
      incidentType: "WEATHER",
      campusBlock: "H-BLOCK"
    }
  },
  {
    input: "Someone collapsed in U Block.",
    expected: {
      incidentType: "MEDICAL",
      campusBlock: "U-BLOCK"
    }
  },
  {
    input: "Fire in Pharmacy Block laboratory.",
    expected: {
      incidentType: "FIRE",
      campusBlock: "PHARMACY BLOCK"
    }
  },
  {
    input: "Crowd surge near Convocation open lawn.",
    expected: {
      incidentType: "CROWD",
      campusBlock: "CONVOCATION"
    }
  }
];

let failed = 0;
console.log("=== Testing Emergency Speech Parser ===");

for (const tc of testCases) {
  const result = parseEmergencySpeech(tc.input, {
    incidentType: "FIRE",
    locationBuilding: "A-BLOCK",
    specificLocation: ""
  });

  console.log(`\nInput: "${tc.input}"`);
  console.log("Parsed:", {
    incidentType: result.incidentType,
    campusBlock: result.campusBlock,
    floor: result.floor,
    room: result.room,
    specificArea: result.specificArea,
    summary: result.extractedSummary
  });

  for (const [key, expectedVal] of Object.entries(tc.expected)) {
    if (result[key] !== expectedVal) {
      console.error(`❌ Mismatch for key '${key}': Expected '${expectedVal}', got '${result[key]}'`);
      failed++;
    }
  }
}

if (failed === 0) {
  console.log("\n✅ ALL SPEECH PARSER TEST CASES PASSED 100%!");
  process.exit(0);
} else {
  console.error(`\n❌ FAILED ${failed} assertions.`);
  process.exit(1);
}
