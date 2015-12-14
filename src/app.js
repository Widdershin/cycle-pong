import {Observable} from 'rx';
import {div} from '@cycle/dom';

export default function App ({DOM}) {
  return {
    DOM: Observable.just(
      div('.game', [
        div('.paddle', {style: {top: '50%', left: '10%'}}),
        div('.ball', {style: {top: '50%', left: '50%'}}),
        div('.paddle', {style: {top: '50%', left: '90%'}})
      ])
    )
  };
}
