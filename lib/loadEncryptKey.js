// loadEncruyptKey.js

"use strict";

const path = require("path");
const fs = require("fs");
const system = require("zyx-schema");

/**
 * Load the encryption key into process.env.ENCRYPT_KEY.
 *
 * In non-production, always try to read from file and load into process.env.
 * In production, use process.env.ENCRYPT_KEY if it exists;
 * otherwise, attempt to read it from file.
 *
 * @param {string} [filename="_secret.key"] - Path or name of file containing the key.
 * @returns {string} The encryption key.
 */
function loadEncryptKey(filename = "_secret.key") {
  let key;

  // Resolve the file path
  const resolvedPath = path.isAbsolute(filename)
    ? filename
    : path.resolve(process.cwd(), filename);

  if (!system.isProduction) {
    // Always load from file in non-production
    if (fs.existsSync(resolvedPath)) {
      key = fs.readFileSync(resolvedPath, "utf-8").trim();
      process.env.ENCRYPT_KEY = key;
    }
  } else {
    // Production: prefer env var, fallback to file if not set
    if (process.env.ENCRYPT_KEY) {
      key = process.env.ENCRYPT_KEY;
    } else if (fs.existsSync(resolvedPath)) {
      key = fs.readFileSync(resolvedPath, "utf-8").trim();
      process.env.ENCRYPT_KEY = key;
    }
  }

  // Validate the encryption key
  key = process.env.ENCRYPT_KEY;
  if (!key || key.length !== 64) {
    throw new Error(
      `Encryption key is undefined or invalid. Expected a 64-character string.`
    );
  }

  return key;
}

module.exports = loadEncryptKey;
