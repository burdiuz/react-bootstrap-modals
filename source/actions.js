import { makeActionCreator } from './utils';
import { dispatchCloseEvent } from './components/ModalsHost';
import { getModals } from './selectors';

export const MODAL_CLOSE = 'modalClose';

export const modalClose = (id) => (dispatch) => {
  if (dispatchCloseEvent(id)) {
    dispatch({
      type: MODAL_CLOSE,
      payload: id,
    });
  }
};

export const MODAL_SHOW = 'modalShow';

export const modalShow = (renderer, props = {}, id = undefined) => (
  dispatch,
  getState,
) => {
  let closeHandler;

  if (id) {
    const modal = getModals(getState()).find(
      ({ id: modalId }) => modalId === id,
    );
    if (modal) return modal.closeHandler;
  } else {
    // eslint-disable-next-line no-param-reassign
    id = `modal_${Date.now()}_${Math.ceil(Math.random() * 100000)}`;
    closeHandler = () => dispatch(modalClose(id));
    closeHandler.id = id;
  }

  dispatch({
    type: MODAL_SHOW,
    payload: {
      id,
      props,
      renderer,
      closeHandler,
    },
  });

  return closeHandler;
};

export const MODAL_CLOSED = 'modalClosed';

export const modalClosed = makeActionCreator(MODAL_CLOSED);
