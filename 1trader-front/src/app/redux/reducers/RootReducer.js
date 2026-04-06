import { combineReducers } from 'redux';
import EcommerceReducer from './EcommerceReducer';
import NavigationReducer from './NavigationReducer';
import NotificationReducer from './NotificationReducer';
import AccountReducer from './AccountReducer';
import { historyBalanceSlice } from '../../slices/user/historyBalance'

const RootReducer = combineReducers({
  notifications: NotificationReducer,
  navigations: NavigationReducer,
  ecommerce: EcommerceReducer,
  account: AccountReducer,
  historyBalance: historyBalanceSlice.reducer,
});

export default RootReducer;
