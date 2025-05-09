/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
    reactStrictMode: true,
    env: {
        DATABASE_URL: process.env.DATABASE_URL,
    },
    transpilePackages: [],
}

module.exports = nextConfig