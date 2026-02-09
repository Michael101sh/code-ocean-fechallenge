/* Extends vitest's expect with DOM-specific matchers (.toBeInTheDocument, etc.). */
import '@testing-library/jest-dom/vitest';

/* Auto-cleanup after each test – needed because vitest globals are not enabled. */
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());
