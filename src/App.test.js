import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { of } from "rxjs";
import { toArray } from "rxjs/operators";
import App, { allSensors$ } from "./App";
import Sensor from './components/Sensor';

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
});

it("renders Sensor component with props", () => {
  act(() => {
    render(<Sensor sensor="Any" />, container);
  });
  expect(container.textContent).toBe("Sensor Any");
});

it('should insert numbers in observables', done => {
  let expectedNumbersObservables = [1, 45, 65, 9];
  const numbersObservables$ = of(1, 45, 65, 9);

  numbersObservables$.pipe(toArray()).subscribe((num) => {
    expect(num).toEqual(expectedNumbersObservables);
    done();
  })
})

it('should stream add array with data correctly', () => {
  const data = ['some data'];
  expect(allSensors$.pipe(toArray()).subscribe((num) => {
    expect(num).toEqual(data);
    done();
  }))
});

it('should not sensors render', () => {
  act(() => {
    render(<Sensor />, container);
  });
  expect(document.querySelectorAll('display').length).toBe(0);
});

it('should sensors render', () => {
  act(() => {
    render(<Sensor />, container);
  });
  const delayRender = setTimeout(() => {
    expect(document.querySelectorAll('display')).toBeTruthy();
  }, 2000);

  clearTimeout(delayRender);
})