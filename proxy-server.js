import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();

// Enable CORS
app.use(cors());

// Proxy endpoint
app.use('/api', createProxyMiddleware({
    target: 'http://127.0.0.1:8545',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Access-Control-Allow-Origin', '*');
        proxyReq.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        proxyReq.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}));

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});