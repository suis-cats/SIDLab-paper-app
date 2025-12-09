import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge3D from './Badge3D';
import { Achievement } from './types';
import { Trophy } from 'lucide-react';
import '@testing-library/jest-dom';

// Mock ResizeObserver for 3D canvas
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock React Three Fiber Canvas to avoid WebGL context issues in test environment
jest.mock('@react-three/fiber', () => ({
  ...jest.requireActual('@react-three/fiber'),
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas-mock">{children}</div>,
  useFrame: jest.fn(),
}));

jest.mock('@react-three/drei', () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div data-testid="html-overlay">{children}</div>,
  Float: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Environment: () => null,
  ContactShadows: () => null,
}));

const mockAchievement: Achievement = {
  id: 'test-badge-1',
  title: 'Test Badge',
  description: 'A test badge description',
  icon: Trophy,
  rarity: 'COMMON',
  condition: () => true,
  order: 1,
};

describe('Badge3D', () => {
    it('renders without crashing', () => {
        render(<Badge3D achievement={mockAchievement} size="md" />);
        const canvas = screen.getByTestId('canvas-mock');
        expect(canvas).toBeInTheDocument();
    });

    it('renders the icon within the HTML overlay', () => {
        render(<Badge3D achievement={mockAchievement} size="md" />);
        const iconContainer = screen.getByTestId('html-overlay');
        expect(iconContainer).toBeInTheDocument();
        // Lucide icons usually render as SVGs
        const svg = iconContainer.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });
});
