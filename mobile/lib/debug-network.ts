/**
 * 🐛 Network Debugging Utilities
 * 
 * This file helps debug network connectivity issues between mobile and backend
 */

// Test different IP addresses and configurations
export const DEBUG_ENDPOINTS = [
  'http://192.168.56.1:3000',    // Current IP
  'http://localhost:3000',       // Localhost
  'http://127.0.0.1:3000',       // Loopback
  'http://10.0.2.2:3000',        // Android emulator special IP
  'http://192.168.1.1:3000',     // Common router IP
  'http://192.168.0.1:3000',     // Alternative router IP
];

/**
 * Test basic connectivity to an endpoint
 */
export const testEndpointConnectivity = async (baseUrl: string): Promise<{
  url: string;
  reachable: boolean;
  responseTime?: number;
  error?: string;
}> => {
  const testUrl = `${baseUrl}/api/docs`;
  const startTime = Date.now();
  
  try {
    console.log(`🔍 [DEBUG] Testing connectivity to: ${testUrl}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for testing
    
    const response = await fetch(testUrl, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    console.log(`✅ [DEBUG] ${testUrl} - Status: ${response.status} (${responseTime}ms)`);
    
    return {
      url: baseUrl,
      reachable: true,
      responseTime,
    };
    
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    console.log(`❌ [DEBUG] ${testUrl} - Failed after ${responseTime}ms:`, error?.message || error);
    
    return {
      url: baseUrl,
      reachable: false,
      responseTime,
      error: error?.message || 'Unknown error',
    };
  }
};

/**
 * Test all possible endpoints to find working ones
 */
export const findWorkingEndpoints = async (): Promise<string[]> => {
  console.log('🔍 [DEBUG] Testing all possible endpoints...');
  
  const results = await Promise.all(
    DEBUG_ENDPOINTS.map(endpoint => testEndpointConnectivity(endpoint))
  );
  
  const workingEndpoints = results
    .filter(result => result.reachable)
    .map(result => result.url);
  
  console.log('✅ [DEBUG] Working endpoints:', workingEndpoints);
  console.log('❌ [DEBUG] Failed endpoints:', results.filter(r => !r.reachable).map(r => r.url));
  
  return workingEndpoints;
};

/**
 * Test registration endpoint specifically
 */
export const testRegistrationEndpoint = async (baseUrl: string): Promise<{
  success: boolean;
  responseTime?: number;
  error?: string;
  httpStatus?: number;
}> => {
  const registrationUrl = `${baseUrl}/api/auth/register`;
  const startTime = Date.now();
  
  try {
    console.log(`🔍 [DEBUG] Testing registration at: ${registrationUrl}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(registrationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Debug Test User',
        email: 'debug@test.com',
        password: 'debugtest123',
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    const responseText = await response.text();
    
    console.log(`📨 [DEBUG] Registration response (${responseTime}ms):`, {
      status: response.status,
      body: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '')
    });
    
    return {
      success: response.ok,
      responseTime,
      httpStatus: response.status,
    };
    
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    console.log(`💥 [DEBUG] Registration test failed after ${responseTime}ms:`, error?.message || error);
    
    return {
      success: false,
      responseTime,
      error: error?.message || 'Unknown error',
    };
  }
};

/**
 * Run comprehensive network diagnostics
 */
export const runNetworkDiagnostics = async (): Promise<void> => {
  console.log('🚀 [DEBUG] Starting comprehensive network diagnostics...');
  console.log('=====================================');
  
  // Step 1: Find working endpoints
  const workingEndpoints = await findWorkingEndpoints();
  
  if (workingEndpoints.length === 0) {
    console.log('💥 [DEBUG] NO WORKING ENDPOINTS FOUND!');
    console.log('🔧 [DEBUG] Possible solutions:');
    console.log('   1. Check if backend is running');
    console.log('   2. Try using Android emulator with 10.0.2.2');
    console.log('   3. Try using iOS simulator with localhost');
    console.log('   4. Check Windows Firewall settings');
    console.log('   5. Try different network adapter (WiFi vs Ethernet)');
    return;
  }
  
  // Step 2: Test registration on working endpoints
  console.log('🧪 [DEBUG] Testing registration on working endpoints...');
  
  for (const endpoint of workingEndpoints) {
    await testRegistrationEndpoint(endpoint);
  }
  
  console.log('=====================================');
  console.log('✅ [DEBUG] Network diagnostics complete!');
  
  if (workingEndpoints.length > 0) {
    console.log(`🎯 [DEBUG] RECOMMENDED: Update .env to use: ${workingEndpoints[0]}`);
  }
};
