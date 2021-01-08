import './App.css';
import { useState, useEffect } from 'react';
import Sensor from './components/Sensor';
import { interval, merge, of, race, zip, combineLatest } from 'rxjs';
import { scan, tap, mapTo, repeat, switchMapTo, delay, catchError, expand, timeout, distinctUntilChanged, take, takeLast, bufferCount, startWith, repeatWhen, combineAll, switchMap, debounceTime } from 'rxjs/operators';


const intervalRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomNumber = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

const sensorCreate = (name) => {
  return of(undefined).pipe(
    delay(intervalRandom(100, 1700)),
    mapTo(`${name}: ${randomNumber(100)}`),
    timeout(1500),
    catchError(err => of(undefined).pipe(mapTo(`${name}: No data`))),
    tap(ev => console.log(ev))
  )
};

const allSensors$ = of(undefined).pipe(
  expand(() => zip(
    sensorCreate('A'), sensorCreate('B'),
    sensorCreate('C'), sensorCreate('D')
  )))


function App() {

  const [state, setState] = useState(null);

  useEffect(() => {
    const sub = allSensors$.subscribe(setState);
    return () => sub.unsubscribe()
  }, [])

  return (
    <div className="App">
      <h2 className="title">Sensors Data</h2>
      {state && state.map((sensor, i) => <Sensor
        key={i}
        sensor={sensor}
      />)}
    </div>
  );
}


export default App;



