import { render, screen } from '@testing-library/react';
import App from './App';

test('renders quiz editor title', () => {
  render(<App />);
  const titleElement = screen.getByText(/quiz editor/i);
  expect(titleElement).toBeInTheDocument();
});
