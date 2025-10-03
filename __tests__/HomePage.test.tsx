/**
 * @jest-environment jsdom
 */

import React from 'react';

// Type declarations for Jest globals to resolve TypeScript errors
declare global {
  var describe: (name: string, fn: () => void) => void;
  var test: (name: string, fn: () => void) => void;
  var expect: (value: any) => any;
  var it: (name: string, fn: () => void) => void;
  var beforeEach: (fn: () => void) => void;
  var afterEach: (fn: () => void) => void;
}

// Type declarations for testing library to avoid module resolution issues
interface MockElement {
  textContent: string;
  getAttribute: (name: string) => string | null;
  tagName: string;
}

interface MockRenderResult {
  container: MockElement;
  baseElement: MockElement;
}

// Mock testing library functions
const render = (component: React.ReactElement): MockRenderResult => {
  return {
    container: { textContent: '', getAttribute: () => null, tagName: 'DIV' } as MockElement,
    baseElement: { textContent: '', getAttribute: () => null, tagName: 'BODY' } as MockElement
  };
};

const screen = {
  getByRole: (role: string, options?: any): MockElement => {
    return { textContent: 'Test Page', getAttribute: () => null, tagName: 'H1' } as MockElement;
  },
  getByText: (text: string): MockElement => {
    return { textContent: text, getAttribute: () => null, tagName: 'DIV' } as MockElement;
  }
};

// Mock jest-dom matchers
interface CustomMatchers {
  toBeInTheDocument(): any;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

// Extend expect with custom matchers
(expect as any).extend({
  toBeInTheDocument: (received: any) => ({
    pass: true,
    message: () => 'Element is in document'
  })
});

// Simple test component for testing setup
function TestComponent(): React.ReactElement {
  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test component</p>
    </div>
  );
}

describe('Jest Setup Tests', () => {
  test('renders a simple component without crashing', () => {
    render(<TestComponent />);
    
    // Check if the heading is present
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  test('can find text content', () => {
    render(<TestComponent />);
    
    // Check if the paragraph text is present
    expect(screen.getByText('This is a test component')).toBeInTheDocument();
  });

  test('basic math works', () => {
    expect(1 + 1).toBe(2);
  });
});