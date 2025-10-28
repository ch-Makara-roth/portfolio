/// <reference types="jest" />

import { ReactElement } from 'react';

declare global {
  // Jest globals
  var describe: (name: string, fn: () => void) => void;
  var it: (name: string, fn: () => void) => void;
  var test: (name: string, fn: () => void) => void;
  var expect: any;
  var beforeEach: (fn: () => void) => void;
  var afterEach: (fn: () => void) => void;
  var beforeAll: (fn: () => void) => void;
  var afterAll: (fn: () => void) => void;
}

// Testing Library types
declare module '@testing-library/react' {
  export function render(ui: ReactElement, options?: any): {
    container: HTMLElement;
    baseElement: HTMLElement;
    debug: () => void;
    rerender: (ui: ReactElement) => void;
    unmount: () => void;
  };
  
  export const screen: {
    getByText(text: string | RegExp): HTMLElement;
    getByRole(role: string, options?: any): HTMLElement;
    getByTestId(testId: string): HTMLElement;
    getByPlaceholderText(text: string | RegExp): HTMLElement;
    getByAltText(text: string | RegExp): HTMLElement;
    getAllByText(text: string | RegExp): HTMLElement[];
    queryByText(text: string | RegExp): HTMLElement | null;
    queryByRole(role: string, options?: any): HTMLElement | null;
    findByText(text: string | RegExp): Promise<HTMLElement>;
    findByRole(role: string, options?: any): Promise<HTMLElement>;
  };
}

declare module '@testing-library/jest-dom' {
  export interface JestMatchers<R> {
    toBeInTheDocument(): R;
    toHaveTextContent(text: string | RegExp): R;
    toBeVisible(): R;
    toBeDisabled(): R;
    toBeEnabled(): R;
    toHaveClass(className: string): R;
    toHaveAttribute(attr: string, value?: string): R;
  }
}

export {};