import mitt from 'mitt';
import Router from 'next/router';

const emitter = mitt();

export default emitter;

Router.events.on('routeChangeStart', (url) => {
  emitter.emit('routeChangeStart', url);
});

Router.events.on('routeChangeComplete', (url) => {
  emitter.emit('routeChangeComplete', url);
});

Router.events.on('routeChangeError', (err) => {
  emitter.emit('routeChangeError', err);
});
