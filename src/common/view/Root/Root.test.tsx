import React from 'react';
import { render } from '@testing-library/react';
import Root from './Root';

test('renders without crash', () => {
  render(<Root />);
});
