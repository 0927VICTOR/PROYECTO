import Mock from './mock';

import './db/auth';
import './db/ecommerce';
import './db/notification';
import './db/account';
import './db/historyBalance';
import './db/deposits';
import './db/expenses';
import './db/users';
import './db/earningPayments';

Mock.onAny().passThrough();
