/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

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
    const { container } = render(<TestComponent />);
    expect(container).toBeTruthy();
  });

  test('can find text content', () => {
    render(<TestComponent />);
    const heading = screen.getByRole('heading', { name: /test page/i });
    expect(heading).toBeInTheDocument();
  });

  test('can find paragraph text', () => {
    render(<TestComponent />);
    const paragraph = screen.getByText(/this is a test component/i);
    expect(paragraph).toBeInTheDocument();
  });

  test('basic math works', () => {
    expect(2 + 2).toBe(4);
  });
});