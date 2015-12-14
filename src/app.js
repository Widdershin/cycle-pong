import {Observable} from 'rx';
import {div} from '@cycle/dom';

function makeUpdate (delta, wIsDown, sIsDown, upIsDown, downIsDown) {
  return function update (state) {
    if (wIsDown) {
      state.paddle1.position.y -= state.paddle1.speed * delta;
    }

    if (sIsDown) {
      state.paddle1.position.y += state.paddle1.speed * delta;
    }

    if (upIsDown) {
      state.paddle2.position.y -= state.paddle2.speed * delta;
    }

    if (downIsDown) {
      state.paddle2.position.y += state.paddle2.speed * delta;
    }

    state.ball.position.x += state.ball.velocity.x * delta;
    state.ball.position.y += state.ball.velocity.y * delta;

    return state;
  };
}

export default function App ({DOM, animation$}) {
  const initialState = {
    ball: {
      position: {
        x: innerWidth / 2,
        y: innerHeight / 2
      },

      velocity: {
        x: 0.05,
        y: 0.05
      }
    },

    paddle1: {
      position: {
        x: innerWidth / 10,
        y: innerHeight / 2
      },

      speed: 0.1
    },

    paddle2: {
      position: {
        x: innerWidth - innerWidth / 10,
        y: innerHeight / 2
      },

      speed: 0.1
    }
  };

  function eventFor (keyCode) {
    return event => {
      return event.keyCode === keyCode;
    };
  }

  function keyIsDown$ (keyCode) {
    const keyDown$ = Observable
      .fromEvent(document.body, 'keydown')
      .filter(eventFor(keyCode))
      .do(ev => ev.preventDefault())
      .map(_ => true);

    const keyUp$ = Observable
      .fromEvent(document.body, 'keyup')
      .filter(eventFor(keyCode))
      .map(_ => false);

    return Observable.merge(
      keyDown$,
      keyUp$
    ).startWith(false);
  }

  const keys = {
    w: 87,
    s: 83,
    up: 38,
    down: 40
  };

  const w$ = keyIsDown$(keys.w);
  const s$ = keyIsDown$(keys.s);

  const up$ = keyIsDown$(keys.up);
  const down$ = keyIsDown$(keys.down);

  const state$ = animation$.pluck('delta')
    .withLatestFrom(w$, s$, up$, down$, makeUpdate)
    .scan((state, update) => update(state), initialState)
    .startWith(initialState);

  return {
    DOM: state$.map(state =>
      div('.game', [
        div('.paddle', {style: {top: state.paddle1.position.y + 'px', left: state.paddle1.position.x + 'px'}}),
        div('.ball', {style: {top: state.ball.position.y + 'px', left: state.ball.position.x + 'px'}}),
        div('.paddle', {style: {top: state.paddle2.position.y + 'px', left: state.paddle2.position.x + 'px'}})
      ])
    )
  };
}
