
export const navigations = [
  {
    name: 'Clientes',
    icon: 'group_add',
    children: [
      { name: 'Usuarios', icon: 'group', iconText: 'SU', path: '/admin/user' },
    ],
  },
  {
    name: 'Transacciones',
    icon: 'monetization_on',
    children: [
      { name: 'Depositos/Retiros', icon: 'attach_money', iconText: 'SU', path: '/admin/user/deposits-expenses' },
      // { name: 'Retiros', icon: 'money_off', iconText: 'SU', path: '/admin/user' },
    ],
  },
  // { label: 'PAGES', type: 'label' },
  // { label: 'Components', type: 'label' },
  {
    name: 'Seguridad/Atorización',
    icon: 'security',
    children: [
      { name: 'Usuarios', icon: 'group_add', iconText: 'SU', path: '/admin/user-system' },
      { name: 'Salir', icon: 'power_settings_new', iconText: 'SU', path: '/session/sigout' },
      // { name: 'Gestión Contraseñas', icon: 'vpn_key', iconText: 'RP', path: '/admin/user-system-change-password' },
      // { name: 'Error', iconText: '404', path: '/session/404' },
    ],
  },

];


export const navigationsUser = [
  { name: 'Home', path: '/dashboard/default', icon: 'home' },
  { name: 'Cuenta', path: '/customer/account', icon: 'call_to_action' },
  {
    name: 'Movimientos',
    icon: 'paid',
    children: [
      { name: 'Depositos', icon: 'trending_up', path: '/customer/account/deposits' },
      { name: 'Retiros', icon: 'loyalty', path: '/customer/account/expenses' },
      { name: 'Pagos', icon: 'currency_exchange', path: '/customer/payments' },
    ],
  },
  { name: 'Perfil', path: '/customer/perfil', icon: 'person' },
];
