// Debug script to help identify issues
console.log('ZK SoulDrop Debug Info:');
console.log('Environment:', process.env.NODE_ENV);
console.log('Base URL:', import.meta.env.BASE_URL);
console.log('App loaded successfully');

// Check if all required modules are available
try {
  console.log('React available:', typeof React !== 'undefined');
  console.log('ReactDOM available:', typeof ReactDOM !== 'undefined');
  console.log('Ethers available:', typeof ethers !== 'undefined');
} catch (error) {
  console.error('Module check failed:', error);
}

// Export for potential use
export const debugInfo = {
  environment: process.env.NODE_ENV,
  baseUrl: import.meta.env.BASE_URL,
  timestamp: new Date().toISOString()
}; 