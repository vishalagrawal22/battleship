import {
  subscribe as sub,
  publish as pub,
  unsubscribe as unsub,
} from 'pubsub-js';

function subscribe(topic, callback) {
  return sub(topic, callback);
}

function publish(topic, data) {
  console.log({ topic, data });
  return pub(topic, data);
}

function unsubscribe(token) {
  return unsub(token);
}

export { subscribe, publish, unsubscribe };
