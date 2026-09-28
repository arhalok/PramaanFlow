#!/usr/bin/env node

const { spawn, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const frontendDir = path.join(rootDir, "frontend");
const nodeModulesDir = path.join(frontendDir, "node_modules");
const envLocalPath = path.join(frontendDir, ".env.local");
const envExamplePath = path.join(rootDir, ".env.example");

const command = process.argv[2] || "dev";

console.log("\n========================================================");
console.log(" 🏛️  REGULATORY OS: MAHARASHTRA JURISDICTION INTELLIGENCE");
console.log("========================================================\n");

// 1. Ensure .env.local exists
if (!fs.existsSync(envLocalPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log("📋 Initializing frontend/.env.local from .env.example...");
    fs.copyFileSync(envExamplePath, envLocalPath);
  } else {
    fs.writeFileSync(
      envLocalPath,
      "GOOGLE_GENERATIVE_AI_API_KEY=\nDATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/regulatory_os\n"
    );
  }
}

// 2. Ensure frontend dependencies are installed
if (!fs.existsSync(nodeModulesDir)) {
  console.log("📦 Dependencies not found. Installing frontend dependencies automatically...");
  try {
    const isWindows = process.platform === "win32";
    const npmCmd = isWindows ? "npm.cmd" : "npm";
    execSync(`${npmCmd} install`, {
      cwd: frontendDir,
      stdio: "inherit"
    });
    console.log("✓ Dependencies installed successfully!\n");
  } catch (err) {
    console.error("❌ Failed to install dependencies:", err.message);
    process.exit(1);
  }
}

// 3. Resolve Next.js binary
const nextBinPath = path.join(nodeModulesDir, "next", "dist", "bin", "next");

if (!fs.existsSync(nextBinPath)) {
  console.error("❌ Next.js binary not found at:", nextBinPath);
  process.exit(1);
}

// 4. Run the requested Next.js command
console.log(`🚀 Starting: next ${command} on port 3000...\n`);
if (command === "dev" || command === "start") {
  console.log("📍 Access Application: http://localhost:3000");
  console.log("📍 PostGIS API:        http://localhost:3000/api/geospatial/analyze\n");
}

const child = spawn(process.execPath, [nextBinPath, command], {
  cwd: frontendDir,
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: process.env.PORT || "3000"
  }
});

child.on("close", (code) => {
  process.exit(code || 0);
});

child.on("error", (err) => {
  console.error("Failed to run next command:", err);
  process.exit(1);
});
