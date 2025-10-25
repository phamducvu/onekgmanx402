const express = require('express');
const { paymentMiddleware } = require('x402-express');
require('dotenv').config();

const app = express();

// Configuration
const payTo = process.env.ADDRESS;
const facilitatorUrl = process.env.FACILITATOR_URL || 'https://facilitator.x402.org';
const network = process.env.NETWORK || 'base-sepolia';

if (!payTo) {
  console.error('Missing required environment variable: ADDRESS');
  process.exit(1);
}

console.log('🚀 Onekgman Server Starting...');
console.log(`💰 Payment Address: ${payTo}`);
console.log(`🌐 Network: ${network}`);
console.log(`🔗 Facilitator: ${facilitatorUrl}`);

// Configure x402 payment middleware
app.use(
  paymentMiddleware(
    payTo,
    {
      // Basic content - $0.001
      '/api/basic': {
        price: '$0.001',
        network: network,
        description: 'Basic Onekgman content access'
      },
      // Premium content - $0.01
      '/api/premium': {
        price: '$0.01',
        network: network,
        description: 'Premium Onekgman content access'
      },
      // Pro content - $0.10
      '/api/pro': {
        price: '$0.10',
        network: network,
        description: 'Pro Onekgman content access'
      },
      // VIP content - $1.00
      '/api/vip': {
        price: '$1.00',
        network: network,
        description: 'VIP Onekgman content access'
      }
    },
    {
      url: facilitatorUrl,
    }
  )
);

// Free endpoints
app.get('/', (req, res) => {
  res.json({
    name: 'Onekgman Server',
    version: '1.0.0',
    description: 'A x402 payment-enabled server',
    endpoints: {
      free: ['/health', '/info'],
      paid: ['/api/basic', '/api/premium', '/api/pro', '/api/vip']
    },
    prices: {
      basic: '$0.001',
      premium: '$0.01',
      pro: '$0.10',
      vip: '$1.00'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: 'Onekgman',
    uptime: process.uptime()
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
      'Real-time Payment Verification'
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
    nextUpgrade: 'Premium tier for $0.01'
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
    nextUpgrade: 'Pro tier for $0.10'
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
    nextUpgrade: 'VIP tier for $1.00'
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
    message: 'You have reached the highest tier!'
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
});
