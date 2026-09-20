import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App without crashing', () => {
  render(<App />);
  expect(screen.getByText(/expertos en reparación/i)).toBeInTheDocument();
});
