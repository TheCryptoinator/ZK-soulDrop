// Polyfills for Node.js compatibility in browser
import { Buffer } from 'buffer'
import process from 'process'

// Global polyfills
window.Buffer = Buffer
window.process = process

// Additional process properties that might be needed
if (!window.process.env) {
  window.process.env = {}
}

if (!window.process.version) {
  window.process.version = 'v16.0.0'
}

if (!window.process.platform) {
  window.process.platform = 'browser'
}

console.log('Polyfills loaded successfully') 