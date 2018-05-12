const getInitialState = () => ({
  list: [],
});

export const modalShow = ({ list, ...state }, { payload }) => ({
  ...state,
  list: [...list, payload],
});

export const modalClosed = ({ list, ...state }, { payload }) => ({
  ...state,
  list: list.filter(({ id }) => id !== payload),
});

export default getInitialState;
