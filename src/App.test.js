import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
//import { render, screen } from '@testing-library/react';
import App from './App';
import Sensor from './components/Sensor';


// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });



let container = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders with or without a name", () => {
  act(() => {
    render(<Sensor />, container);
  });
  expect(container.textContent).toBe("Sensor ");

  act(() => {
    render(<Sensor sensor="Any"/>, container);
  });
  expect(container.textContent).toBe("Sensor Any");
});

