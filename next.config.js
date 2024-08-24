/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  // Ajouter la configuration pour le export statique
  output: 'export',
  // Autres configurations éventuelles
}

module.exports = nextConfig
