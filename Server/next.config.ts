import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL,
    COMMITMENT_CONTRACT_ADDRESS: process.env.COMMITMENT_CONTRACT_ADDRESS,
  },
}
export default nextConfig;
