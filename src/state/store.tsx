import React, { createContext, useContext } from 'react';
import { IDispatchFunctions, dispatchFunctions, Action } from './action';
// import { reducer } from './reducer';
import { IState, initialState } from './state';
// import { customMiddleware } from './middleware';
import { Provider } from 'react-redux';
import store from './store-redux';

interface IContextProps {
  state: IState;
  actions: IDispatchFunctions;
}

export interface MiddlewareApi {
  getState: () => IState;
  dispatch: (action: Action) => void;
}

// const compose = (...funcs: any[]) => (x: any) =>
//   funcs.reduceRight((composed, f) => f(composed), x);

// const CreateStore = (
//   reducer: (state: IState, action: Action) => IState,
//   initialState: IState,
//   middlewares: any[]
// ) => {
//   const [state, dispatch] = useReducer(reducer, initialState, () => {
//     return initialState;
//   });

//   if (middlewares) {
//     const middlewaresApi: MiddlewareApi = {
//       getState: () => state,
//       dispatch: (action: Action) => dispatch(action),
//     };

//     const chain = middlewares.map((middleware) => middleware(middlewaresApi));

//     const enhancedDispatch: Dispatch<Action> = compose(...chain)(dispatch);
//     return { state, dispatch: enhancedDispatch };
//   }

//   return { state, dispatch };
// };

export const Store = createContext<IContextProps>({
  state: initialState,
  actions: dispatchFunctions(initialState, () => {}),
});

export const StoreProvider: React.FC = ({ children }) => {
  // const { state, dispatch } = CreateStore(reducer, initialState, [
  //   customMiddleware,
  // ]);

  return (
    <Provider store={store}>
      {/* <Store.Provider
        value={{
          state,
          actions: dispatchFunctions(state, dispatch),
        }}
      > */}
      {children}
      {/* </Store.Provider> */}
    </Provider>
  );
};

export const useGlobalState = () => useContext(Store);
