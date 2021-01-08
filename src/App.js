import './App.css';
import { useState, useEffect } from 'react';
import Sensor from './components/Sensor';
import { zip, of, combineLatest } from 'rxjs';
import { tap, mapTo, delay, catchError, expand, timeout } from 'rxjs/operators';


const intervalRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomNumber = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

export const sensorCreate = (name) => {
  return of(undefined).pipe(
    delay(intervalRandom(100, 1700)),
    mapTo(`${name}: ${randomNumber(100)}`),
    timeout(1500),
    catchError(err => of(undefined).pipe(mapTo(`${name}: No data`))),
    tap(ev => console.log(ev))
  )
};

// const sensorA$ = of(undefined).pipe(
//   expand(() => of(undefined).pipe(
//     mapTo(`sensorD: ${randomNumber(100)} `),
//     delay(intervalRandom(100, 1500)),
//     timeout(1500),
//     catchError(err => of(undefined).pipe(mapTo('sensorD No data'))),
//     tap(ev => console.log(ev))
//   ))
// )

// const allSensors$ = of(undefined).pipe(expand(() => {     
//     return 
// merge(sensorCreate('A'), sensorCreate('B'), sensorCreate('C'), sensorCreate('D'))
// .pipe(delay(200),
//    // tap(e => console.log(e)),
//     //map((sensors, curr) => ({ ...sensors, [curr.name]: curr.value }), {}),
//     //scan((state, curr) => ([ ...state, ...curr ]), []),
//     tap(el => console.log(`Last sensor emited value ${el}`))
// );
// }))

export const allSensors$ = of(undefined).pipe(
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



