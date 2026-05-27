// src/lib/products-data.ts

export type ProductStatus = 'live' | 'building' | 'research' | 'coming-soon';

export interface Product {
  id: string;
  name: string;
  status: ProductStatus;
  type: string;
  description: string;
  problemSolved?: string;
  modules?: string[];
  link?: string;
  color: string;
  icon: string; // emoji
}

export const products: Product[] = [
  {
    id: 'acquisitionos',
    name: 'AcquisitionOS',
    status: 'building',
    type: 'AI Acquisition SaaS',
    description: 'AI Powered Acquisition Intelligence Platform that unifies lead generation, CRM, billing, and revenue analytics into a single intelligent system.',
    problemSolved: 'Lead fragmentation, CRM separation, billing isolation, and operational acquisition problems.',
    modules: ['Lead Engine', 'AI Qualification', 'CRM', 'Billing', 'Credits', 'Analytics', 'Revenue Intelligence'],
    link: 'https://preview-chat-ab88c1b0-d6fd-4199-b9d5-ec3a018502fc.space-z.ai/',
    color: '#6366f1',
    icon: '🚀',
  },
  {
    id: 'systemfoundry',
    name: 'SystemFoundry',
    status: 'live',
    type: 'Architecture Platform',
    description: 'AI Architecture Thinking Platform that helps engineers think in systems, not just code.',
    problemSolved: 'Engineers code. Few think in systems.',
    modules: ['Architecture Simulation', 'Design Generation', 'JSON Export', 'System Mapping', 'Component Modeling'],
    link: 'https://systemfoundry.vercel.app/',
    color: '#8b5cf6',
    icon: '🏗️',
  },
  {
    id: 'quantumfusion',
    name: 'QuantumFusion Solutions',
    status: 'live',
    type: 'Company',
    description: 'An innovative tech company shaping the future through AI, cloud computing, automation, and open-source development.',
    link: 'https://quantumfusion-solutions.vercel.app/',
    color: '#06b6d4',
    icon: '⚡',
  },
  {
    id: 'prabhatblogs',
    name: 'PrabhatBlogs',
    status: 'live',
    type: 'Publishing Platform',
    description: 'A modern full-stack blogging platform with AI-powered writing assistance, markdown editing, and premium content support.',
    link: 'https://prabhatblogs.lovable.app/',
    color: '#f59e0b',
    icon: '📝',
  },
  {
    id: 'codeguard-ai',
    name: 'CodeGuard AI',
    status: 'coming-soon',
    type: 'DevTools',
    description: 'VS Code extension that analyzes Terraform infrastructure code and detects potential AWS cost risks before deployment.',
    color: '#10b981',
    icon: '🛡️',
  },
  {
    id: 'quantumos',
    name: 'QuantumOS',
    status: 'research',
    type: 'Operating System',
    description: 'Research project exploring quantum-inspired computing paradigms for next-generation operating systems.',
    color: '#ec4899',
    icon: '🔬',
  },
  {
    id: 'trading-infra',
    name: 'Trading Infrastructure',
    status: 'research',
    type: 'FinTech',
    description: 'High-frequency trading infrastructure with algorithmic precision and market psychology integration.',
    color: '#14b8a6',
    icon: '📈',
  },
  {
    id: 'ai-observability',
    name: 'AI Observability Layer',
    status: 'building',
    type: 'AI Infrastructure',
    description: 'Comprehensive observability platform for monitoring, debugging, and optimizing AI model performance in production.',
    color: '#f97316',
    icon: '👁️',
  },
  {
    id: 'prabhatai',
    name: 'PrabhatAI',
    status: 'building',
    type: 'AI Platform',
    description: 'Personal AI assistant ecosystem with voice control, context awareness, and multi-modal interaction capabilities.',
    color: '#a855f7',
    icon: '🤖',
  },
  {
    id: 'visualization-engine',
    name: 'Visualization Engine',
    status: 'research',
    type: 'Data Visualization',
    description: 'GPU-accelerated data visualization engine for rendering complex datasets in real-time with interactive 3D graphs.',
    color: '#3b82f6',
    icon: '📊',
  },
];

export const statusConfig: Record<ProductStatus, { label: string; color: string; bg: string }> = {
  live: { label: 'LIVE', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  building: { label: 'BUILDING', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  research: { label: 'RESEARCH', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
  'coming-soon': { label: 'COMING SOON', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
};
