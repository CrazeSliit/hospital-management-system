#!/usr/bin/env node

/**
 * Environment Variables Setup for Netlify
 * 
 * Copy these environment variables to your Netlify dashboard:
 * Site Settings > Environment Variables
 */

const envVars = {
  // Required for database connection
  DATABASE_URL: "mongodb+srv://Thysia:Craze09.@cluster0.ystyc.mongodb.net/thysia-hospital?retryWrites=true&w=majority",
  
  // Required for NextAuth - UPDATE THIS WITH YOUR NETLIFY URL
  NEXTAUTH_URL: "https://your-site-name.netlify.app", // 👈 UPDATE THIS
  NEXTAUTH_SECRET: "your-secret-here-make-it-long-and-random",
  
  // Build configuration
  NODE_VERSION: "18",
  PRISMA_CLI_BINARY_TARGETS: "rhel-openssl-1.0.x,linux-musl,debian-openssl-1.1.x",
  
  // Optional - Email configuration
  EMAIL_SERVER_HOST: "smtp.gmail.com",
  EMAIL_SERVER_PORT: "587",
  EMAIL_SERVER_USER: "your-email@gmail.com",
  EMAIL_SERVER_PASSWORD: "your-app-password",
  EMAIL_FROM: "noreply@hospital.com",
  
  // Optional - SMS configuration
  TWILIO_ACCOUNT_SID: "your-twilio-account-sid",
  TWILIO_AUTH_TOKEN: "your-twilio-auth-token",
};

console.log("=".repeat(60));
console.log("NETLIFY ENVIRONMENT VARIABLES SETUP");
console.log("=".repeat(60));
console.log("\nCopy these to your Netlify dashboard:");
console.log("Site Settings > Environment Variables\n");

Object.entries(envVars).forEach(([key, value]) => {
  console.log(`${key}=${value}`);
});

console.log("\n" + "=".repeat(60));
console.log("IMPORTANT REMINDERS:");
console.log("=".repeat(60));
console.log("1. Update NEXTAUTH_URL with your actual Netlify URL");
console.log("2. Generate a strong NEXTAUTH_SECRET (32+ characters)");
console.log("3. Ensure MongoDB allows Netlify's IP ranges");
console.log("4. Test deployment after setting all variables");
console.log("=".repeat(60));
