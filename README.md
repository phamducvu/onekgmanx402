# Onekgman Server

A x402 payment-enabled server built with Express.js and deployed on Vercel.

## Features

- 🚀 **Multiple Pricing Tiers**: Basic ($0.001), Premium ($0.01), Pro ($0.10), VIP ($1.00)
- 💰 **x402 Payment Integration**: Seamless crypto payments
- 🌐 **Base Network Support**: Works on Base mainnet and testnet
- 📱 **RESTful API**: Clean and simple endpoints
- 🔒 **Payment Verification**: Real-time payment verification

## Endpoints

### Free Endpoints
- `GET /` - Server information and available endpoints
- `GET /health` - Health check
- `GET /info` - Server details

### Paid Endpoints
- `GET /api/basic` - Basic content ($0.001)
- `GET /api/premium` - Premium content ($0.01)
- `GET /api/pro` - Pro content ($0.10)
- `GET /api/vip` - VIP content ($1.00)

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment file:
   ```bash
   cp env.example .env
   ```
4. Update `.env` with your wallet address:
   ```
   ADDRESS=0xYourWalletAddressHere
   NETWORK=base-sepolia
   ```
5. Run the server:
   ```bash
   npm run dev
   ```

## Deployment on Vercel

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard:
   - `ADDRESS`: Your wallet address
   - `NETWORK`: base-sepolia (testnet) or base (mainnet)
4. Deploy!

## Environment Variables

- `ADDRESS` (required): Your wallet address to receive payments
- `NETWORK`: Network to use (base-sepolia, base)
- `FACILITATOR_URL`: Facilitator service URL
- `PORT`: Port for local development

## Testing

Test the server locally:
```bash
# Free endpoints
curl http://localhost:3000/health

# Paid endpoints (will return 402 Payment Required)
curl http://localhost:3000/api/basic
```

## License

MIT
