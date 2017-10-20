import $ from 'jquery';
import Rx from 'rxjs/Rx';

const startButton = $('#start')
const stopButton = $('#stop')
const resetButton = $('#reset')

const start$ = Rx.Observable.fromEvent(startButton, 'click')
const stop$ = Rx.Observable.fromEvent(stopButton, 'click')
const reset$ = Rx.Observable.fromEvent(resetButton, 'click')

const minutes = $('#minutes')
const seconds = $('#seconds')
const milliseconds = $('#milliseconds')

const pad = (number) => number <= 9 ? ('0' + number) : number.toString()


const interval$ = Rx.Observable.interval(10)

const stopOrReset$ = Rx.Observable.merge(
    stop$,
    reset$
)

const pausible$ = interval$
                          .takeUntil(stopOrReset$)
const init = 0   
const inc = acc => acc+1
const reset = acc => init

const incOrReset$ = Rx.Observable.merge(
    pausible$.mapTo(inc),
    reset$.mapTo(reset)
)

const app$ = start$
      .switchMapTo(incOrReset$)
      .startWith(init)
      .scan((acc, currFunc) => currFunc(acc))
      .map((time) => ({
        milliseconds: Math.floor(time % 100),
        seconds: Math.floor((time/100) % 60),
        minutes: Math.floor(time / 6000)
      }))
      .subscribe((time) => {
        minutes.html(pad(time.minutes))
        seconds.html(pad(time.seconds))
        milliseconds.html(pad(time.milliseconds))
      })







