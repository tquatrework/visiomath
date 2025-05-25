import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  //screen.debug();
  const buttonElement = screen.getByRole("button", { name: /Se connecter/i });
  expect(buttonElement).toBeInTheDocument();
});
