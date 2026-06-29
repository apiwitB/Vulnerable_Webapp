/* src/data/mockData.js — Mock data สำหรับ shadowMarketplace */

export const CATEGORIES = [
  { id: 'all',      label: 'All Items',      icon: '🌐' },
  { id: 'digital',  label: 'Digital Goods',  icon: '💾' },
  { id: 'accounts', label: 'Accounts',        icon: '👤' },
  { id: 'tools',    label: 'Tools & Scripts', icon: '🔧' },
  { id: 'data',     label: 'Data Dumps',      icon: '📊' },
  { id: 'exploits', label: 'Exploits',        icon: '🛡️' },
]

export const PRODUCTS = [
  {
    id: 1, name: 'Stealth VPN Bundle Pro', category: 'digital', price: 49,
    originalPrice: 89, emoji: '🌐', bg: 'linear-gradient(135deg,#1a1040,#2d1f6e)',
    seller: 'ghost_vendor', badge: { text: 'HOT', type: 'red' }, rating: 4.8,
  },
  {
    id: 2, name: 'Premium Account Generator v3', category: 'accounts', price: 120,
    originalPrice: null, emoji: '👤', bg: 'linear-gradient(135deg,#0d1f2d,#1a3a4a)',
    seller: 'byte_dealer', badge: { text: 'NEW', type: 'accent' }, rating: 4.6,
  },
  {
    id: 3, name: 'SQL Injection Toolkit 2026', category: 'tools', price: 200,
    originalPrice: 280, emoji: '💉', bg: 'linear-gradient(135deg,#1f0d0d,#3a1a1a)',
    seller: 'dark_coder', badge: { text: 'SALE', type: 'green' }, rating: 4.9,
  },
  {
    id: 4, name: 'Credential Dump — Fortune 500', category: 'data', price: 350,
    originalPrice: null, emoji: '📂', bg: 'linear-gradient(135deg,#1f1a0d,#3a2d0a)',
    seller: 'leak_lord', badge: null, rating: 4.3,
  },
  {
    id: 5, name: 'Zero-Day Browser Exploit Kit', category: 'exploits', price: 999,
    originalPrice: 1499, emoji: '💣', bg: 'linear-gradient(135deg,#1a0a2a,#2d1450)',
    seller: 'void_hacker', badge: { text: 'RARE', type: 'accent' }, rating: 5.0,
  },
  {
    id: 6, name: 'Anonymous BTC Mixer Script', category: 'tools', price: 75,
    originalPrice: null, emoji: '₿', bg: 'linear-gradient(135deg,#0d1f0d,#1a3a1a)',
    seller: 'crypto_ghost', badge: null, rating: 4.5,
  },
  {
    id: 7, name: 'Phishing Page Templates Pack', category: 'digital', price: 30,
    originalPrice: 60, emoji: '🎣', bg: 'linear-gradient(135deg,#0a1520,#162840)',
    seller: 'fish_master', badge: { text: 'SALE', type: 'green' }, rating: 4.1,
  },
  {
    id: 8, name: 'RAT Builder — Cross-Platform', category: 'tools', price: 450,
    originalPrice: null, emoji: '🐀', bg: 'linear-gradient(135deg,#1a0d10,#2d1520)',
    seller: 'malware_dev', badge: { text: 'PREMIUM', type: 'accent' }, rating: 4.7,
  },
]

export const POSTS = [
  { id: 1, title: 'PSA: New OPSEC techniques for 2026',              author: 'anon_op',     time: '2h ago', replies: 47,  views: 1240, tag: 'OPSEC'      },
  { id: 2, title: 'Review: SQL Injection Toolkit — is it worth $200?', author: 'pentest_pro', time: '5h ago', replies: 23,  views: 892,  tag: 'REVIEW'    },
  { id: 3, title: 'How I exfiltrated 50GB without triggering DLP',    author: 'ghost_vendor', time: '1d ago', replies: 88,  views: 5430, tag: 'TUTORIAL'   },
  { id: 4, title: 'Discussion: Best anonymous payment methods 2026',  author: 'crypto_ghost', time: '2d ago', replies: 134, views: 7800, tag: 'DISCUSSION' },
]

export const FEATURES = [
  { icon: '🛡️', title: 'Anonymous Transactions',  desc: 'All payments processed through Monero and mixed BTC. No traces left behind.' },
  { icon: '🔐', title: 'PGP Encrypted Comms',     desc: 'End-to-end encrypted messaging between buyers and vendors.' },
  { icon: '⚡', title: 'Instant Delivery',         desc: 'Digital goods delivered automatically upon payment confirmation.' },
  { icon: '🌐', title: 'Onion Routing',            desc: 'All traffic routed through Tor for maximum anonymity.' },
  { icon: '💬', title: 'Dispute Resolution',       desc: 'Neutral escrow system protects both buyers and sellers.' },
  { icon: '📋', title: 'Discussion Board',         desc: 'Community forum to share knowledge, reviews, and techniques.' },
]
