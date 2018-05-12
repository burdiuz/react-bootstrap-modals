import { createExportsReducer } from 'createReducer';

const composeReducerFromExports = (exports) =>
  createExportsReducer(exports, exports.default);

export const createReducers = (reducers) => {
  return Object.keys(reducers).reduce(
    (result, key) => ({
      ...result,
      [key]: composeReducerFromExports(reducers[key]),
    }),
    {},
  );
};

export const bindActionToPromise = (actionCreator) =>
  (payload) =>
    (dispatch) => {
      return new Promise(
        (resolve, reject) => dispatch(actionCreator(payload, resolve, reject)),
      );
};

export const makeActionCreator = (type) =>
  (payload) => ({
    type,
    payload,
  });

export const makePromisedActionCreator = (type) => {
  return bindActionToPromise((payload, resolve, reject) => ({
    type,
    payload,
    resolve,
    reject,
  }));
};

const convertJQueryEventToDOM = (jQueryEvent) => {
  return new CustomEvent(jQueryEvent.type, { detail: jQueryEvent });
};

const dispatchJQueryEventToDOM = (jQueryEvent) => {
  jQueryEvent.target.dispatchEvent(convertJQueryEventToDOM(jQueryEvent));
};

export const translateJQueryEventsToDOM = (
  target = document,
  jQuery = window.$,
) => (...events) => {
  events.forEach((jQueryEventType) => {
    jQuery(target).off(jQueryEventType, dispatchJQueryEventToDOM);
    jQuery(target).on(jQueryEventType, dispatchJQueryEventToDOM);
  });
};

export const deferred = () => {
  let resolve;
  let reject;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { resolve, reject, promise };
};
