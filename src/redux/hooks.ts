import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from 'react-redux';

import type { RootState, AppDispatch } from '@/redux/store';

//================ SELECTOR =================

export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

//================ DISPATCH =================

export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
