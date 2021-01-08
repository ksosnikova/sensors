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
    //mapTo({ name, value: randomNumber(1000) }),
    timeout(1500),
    catchError(err => of(undefined).pipe(mapTo(`${name}: No data`))),
    //catchError(err => of(undefined).pipe(mapTo({ name, value: 'No data' }))),
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

const repeater$ = interval(500);
const any$ = combineLatest(sensorCreate('A'), sensorCreate('B'), sensorCreate('C'), sensorCreate('D'));

// const allSensors$ = zip(sensorCreate('A'), sensorCreate('B'), sensorCreate('C'), sensorCreate('D'))
//           .pipe(expand(() => any$.pipe(
//             delay(200),
//             tap(i => console.log(i)))))


function App() {

  const [state, setState] = useState(null);

  const sensors$ = merge(sensorCreate('A'), sensorCreate('B'),
    sensorCreate('C'), sensorCreate('D'));
  const sensorsStart$ = zip(sensorCreate('A'), sensorCreate('B'),
    sensorCreate('C'), sensorCreate('D'));

  // const allSensors$ = of(undefined)
  // .pipe(expand(() => {return sensorsStart$}),
  //   delay(200),
  //   // startWith(() => { return of(undefined).
  //   //  pipe(expand(() => sensorsStart$))}),
  //   tap(i => console.log(i)),
  //   scan((state, curr) => ({ ...state, ...curr }), {})
  //   )


  const allSensors$ = of(undefined).pipe(
    expand(() => zip(
      sensorCreate('A'), sensorCreate('B'),
      sensorCreate('C'), sensorCreate('D')
    )
      // .pipe(
      //   tap(i => console.log(i)),
      //  // delay(200),
      //   // switchMap(() => { return of(undefined).
      //   //   pipe(expand(() => sensors$))}),
      //   // expand(() => sensors$.pipe(
      //   // tap(i => console.log(i)),
      //   // scan((state, curr) => ({ ...state, ...curr }), {}),
      //   // repeat(true)
      // )
    ))

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



