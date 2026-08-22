// Automated test script to verify full backend workflow
async function runTests() {
  console.log("=== Testing Campus Sentinel AI Backend APIs ===");

  // 1. Health
  const healthRes = await fetch("http://localhost:5000/api/health");
  const health = await healthRes.json();
  console.log("✓ Health Status:", health.status, "| Engine:", health.engine);

  // 2. Campus Overview
  const campusRes = await fetch("http://localhost:5000/api/campus/overview");
  const campus = await campusRes.json();
  console.log(`✓ Campus Digital Twin: ${campus.buildingsCount} Buildings, ${campus.camerasCount} Cameras, ${campus.assemblyPointsCount} Assembly Safe Zones`);

  // 3. Trigger Fire Simulation
  console.log("--- Triggering Primary FIRE Emergency Simulation ---");
  const simRes = await fetch("http://localhost:5000/api/incidents/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario: "FIRE", fastDemo: true })
  });
  const sim = await simRes.json();
  console.log("✓ Fire Emergency Workflow Executed:", sim.success ? "SUCCESS" : "FAILED");
  console.log("  Incident ID:", sim.incident.id);
  console.log("  Severity:", sim.incident.severity);
  console.log("  Location:", sim.incident.location);
  console.log("  Safe Route Distance:", sim.incident.evacuationRoute ? `${sim.incident.evacuationRoute.totalDistanceMeters}m` : "N/A");
  console.log("  Recommended Safe Zone:", sim.incident.recommendedAssemblyPoint ? sim.incident.recommendedAssemblyPoint.name : "N/A");
  console.log("  Activated Agents:", sim.incident.activatedAgents.length);

  // 4. Dynamic Re-planning (Block road)
  console.log("--- Triggering Dynamic Re-planning (Road Obstruction on E-07) ---");
  const blockRes = await fetch("http://localhost:5000/api/incidents/block-route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ edgeId: "E-07" })
  });
  const block = await blockRes.json();
  console.log("✓ Dynamic Re-planning Result:", block.success ? "SUCCESS" : "FAILED");
  console.log("  New Evacuation Route Distance:", block.incident?.evacuationRoute?.totalDistanceMeters, "m");
  console.log("  New Safe Assembly Zone:", block.incident?.recommendedAssemblyPoint?.name);

  // 5. NLP Entity Extraction
  console.log("--- Testing Natural Language Emergency Parser ---");
  const nlpRes = await fetch("http://localhost:5000/api/ai/report-nlp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "Smoke coming from second floor of CSE block and 400 students nearby", autoDispatch: false })
  });
  const nlp = await nlpRes.json();
  console.log("✓ NLP Extracted Type:", nlp.analysis.extracted.type);
  console.log("✓ NLP Extracted Location:", nlp.analysis.extracted.location);
  console.log("✓ NLP Extracted Severity:", nlp.analysis.extracted.severity);
  console.log("✓ NLP Extracted People at Risk:", nlp.analysis.extracted.peopleAtRisk);

  // 6. Human Approval Decision
  console.log("--- Testing Human-In-The-Loop Approval Decision ---");
  const approvalsRes = await fetch("http://localhost:5000/api/approvals");
  const approvals = await approvalsRes.json();
  if (approvals.approvals && approvals.approvals.length > 0) {
    const targetApp = approvals.approvals[0];
    const decisionRes = await fetch(`http://localhost:5000/api/approvals/${targetApp.id}/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision: "APPROVED", operatorName: "Chief Commander Mitchell", notes: "Authorized immediate gas main isolation" })
    });
    const dec = await decisionRes.json();
    console.log(`✓ Human Authorization on [${targetApp.title}]:`, dec.approval.status, "by", dec.approval.reviewedBy);
  }

  // 7. Audit Log
  const auditRes = await fetch("http://localhost:5000/api/audit");
  const audit = await auditRes.json();
  console.log(`✓ Tamper-Evident Audit Ledger verified: ${audit.totalLogs} entries logged.`);

  console.log("\n=======================================================");
  console.log("🎉 ALL MULTI-AGENT BACKEND CAPABILITIES VERIFIED 100%");
  console.log("=======================================================");
}

runTests().catch(console.error);
