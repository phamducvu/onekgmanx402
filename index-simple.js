const express = require('express');
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-PAYMENT');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Configuration
const payTo = process.env.ADDRESS;
const network = process.env.NETWORK || 'base';

if (!payTo) {
  console.error('Missing required environment variable: ADDRESS');
  process.exit(1);
}

console.log('🚀 Onekgman Server Starting...');
console.log(`💰 Payment Address: ${payTo}`);
console.log(`🌐 Network: ${network}`);
console.log(`🔧 Using SIMPLE verification (bypass signature check)`);

// Simple payment verification middleware (bypass signature verification for testing)
async function verifyPayment(req, res, next) {
  const path = req.path;
  const paymentHeader = req.headers['x-payment'];
  
  // Check if this is a paid endpoint
  const paidEndpoints = ['/api/basic', '/api/premium', '/api/pro', '/api/vip'];
  if (!paidEndpoints.includes(path)) {
    return next(); // Free endpoint, proceed
  }
  
  // Check for payment header
  if (!paymentHeader) {
    return res.status(402).json({
      x402Version: 1,
      error: 'X-PAYMENT header is required',
      accepts: [{
        scheme: 'exact',
        network: network,
        maxAmountRequired: path === '/api/basic' ? '1000' : 
                          path === '/api/premium' ? '10000' :
                          path === '/api/pro' ? '100000' : '1000000',
        resource: `http://localhost:3001${path}`,
        description: `${path} content access`,
        mimeType: 'application/json',
        payTo: payTo,
        maxTimeoutSeconds: 60,
        asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        outputSchema: {
          input: {
            type: 'http',
            method: 'GET',
            discoverable: true
          }
        },
        extra: {
          name: 'USD Coin',
          version: '2'
        }
      }]
    });
  }
  
  try {
    // Decode payment payload
    const paymentPayload = JSON.parse(Buffer.from(paymentHeader, 'base64').toString());
    
    console.log('🔍 Payment received:', {
      path,
      payer: paymentPayload.payload?.authorization?.from,
      amount: paymentPayload.payload?.authorization?.value,
      signature: paymentPayload.payload?.signature?.substring(0, 10) + '...'
    });
    
    // For testing purposes, accept any valid payment format
    if (paymentPayload.payload?.authorization?.from && 
        paymentPayload.payload?.authorization?.to === payTo &&
        paymentPayload.payload?.signature) {
      
      console.log('✅ Payment accepted (bypassing signature verification)');
      
      // Store payment info
      req.paymentInfo = {
        payer: paymentPayload.payload.authorization.from,
        amount: paymentPayload.payload.authorization.value,
        signature: paymentPayload.payload.signature
      };
      
      next();
    } else {
      console.log('❌ Invalid payment format');
      return res.status(402).json({
        x402Version: 1,
        error: 'Invalid payment format',
        accepts: [{
          scheme: 'exact',
          network: network,
          maxAmountRequired: path === '/api/basic' ? '1000' : 
                            path === '/api/premium' ? '10000' :
                            path === '/api/pro' ? '100000' : '1000000',
          resource: `http://localhost:3001${path}`,
          description: `${path} content access`,
          mimeType: 'application/json',
          payTo: payTo,
          maxTimeoutSeconds: 60,
          asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          outputSchema: {
            input: {
              type: 'http',
              method: 'GET',
              discoverable: true
            }
          },
          extra: {
            name: 'USD Coin',
            version: '2'
          }
        }]
      });
    }
    
  } catch (error) {
    console.error('💥 Payment verification error:', error);
    return res.status(402).json({
      x402Version: 1,
      error: 'Invalid payment format',
      accepts: [{
        scheme: 'exact',
        network: network,
        maxAmountRequired: path === '/api/basic' ? '1000' : 
                          path === '/api/premium' ? '10000' :
                          path === '/api/pro' ? '100000' : '1000000',
        resource: `http://localhost:3001${path}`,
        description: `${path} content access`,
        mimeType: 'application/json',
        payTo: payTo,
        maxTimeoutSeconds: 60,
        asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        outputSchema: {
          input: {
            type: 'http',
            method: 'GET',
            discoverable: true
          }
        },
        extra: {
          name: 'USD Coin',
          version: '2'
        }
      }]
    });
  }
}

// Apply payment verification middleware
app.use(verifyPayment);

// Free endpoints
app.get('/', (req, res) => {
  res.json({
    name: 'Onekgman Server',
    version: '1.0.0',
    description: 'A x402 payment-enabled server with SIMPLE verification',
    endpoints: {
      free: ['/health', '/info'],
      paid: ['/api/basic', '/api/premium', '/api/pro', '/api/vip']
    },
    prices: {
      basic: '$0.001',
      premium: '$0.01',
      pro: '$0.10',
      vip: '$1.00'
    },
    verification: 'SIMPLE (bypass signature check)'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: 'Onekgman',
    uptime: process.uptime(),
    verification: 'SIMPLE'
  });
});

app.get('/info', (req, res) => {
  res.json({
    server: 'Onekgman',
    description: 'Welcome to Onekgman - Your premium content server',
    features: [
      'x402 Payment Integration',
      'Multiple Pricing Tiers',
      'Base Network Support',
      'SIMPLE Payment Verification'
    ],
    contact: 'onekgman@example.com'
  });
});

// Paid endpoints
app.get('/api/basic', (req, res) => {
  res.json({
    content: 'Basic Onekgman Content',
    message: 'Welcome to the basic tier!',
    features: [
      'Basic content access',
      'Standard support',
      'Community features'
    ],
    nextUpgrade: 'Premium tier for $0.01',
    payment: 'Verified with SIMPLE verification',
    payer: req.paymentInfo?.payer,
    amount: req.paymentInfo?.amount
  });
});

app.get('/api/premium', (req, res) => {
  res.json({
    content: 'Premium Onekgman Content',
    message: 'Welcome to the premium tier!',
    features: [
      'Premium content access',
      'Priority support',
      'Advanced features',
      'Exclusive content'
    ],
    nextUpgrade: 'Pro tier for $0.10',
    payment: 'Verified with SIMPLE verification',
    payer: req.paymentInfo?.payer,
    amount: req.paymentInfo?.amount
  });
});

app.get('/api/pro', (req, res) => {
  res.json({
    content: 'Pro Onekgman Content',
    message: 'Welcome to the pro tier!',
    features: [
      'Pro content access',
      '24/7 support',
      'All advanced features',
      'Exclusive pro content',
      'API access'
    ],
    nextUpgrade: 'VIP tier for $1.00',
    payment: 'Verified with SIMPLE verification',
    payer: req.paymentInfo?.payer,
    amount: req.paymentInfo?.amount
  });
});

app.get('/api/vip', (req, res) => {
  res.json({
    content: 'VIP Onekgman Content',
    message: 'Welcome to the VIP tier!',
    features: [
      'VIP content access',
      'Personal manager',
      'All features unlocked',
      'Exclusive VIP content',
      'Full API access',
      'Custom integrations',
      'White-label options'
    ],
    message: 'You have reached the highest tier!',
    payment: 'Verified with SIMPLE verification',
    payer: req.paymentInfo?.payer,
    amount: req.paymentInfo?.amount
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: ['/', '/health', '/info', '/api/basic', '/api/premium', '/api/pro', '/api/vip']
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🎉 Onekgman Server running on port ${PORT}`);
  console.log(`📱 Test endpoints:`);
  console.log(`   Free: http://localhost:${PORT}/health`);
  console.log(`   Paid: http://localhost:${PORT}/api/basic`);
  console.log(`🔧 Using SIMPLE verification (bypass signature check)`);
});
