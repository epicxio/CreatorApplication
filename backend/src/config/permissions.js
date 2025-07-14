// permissions.js (backend version, no React or icons)

const permissionResources = [
  { name: 'Dashboard', path: '/dashboard' },
  {
    name: 'User',
    path: '/user-management',
    children: [
      { name: 'User List', path: '/user-management/list' },
      { name: 'Invitation', path: '/user-management/invitations' },
    ],
  },
  {
    name: 'Creator',
    path: '/academic-management',
    children: [
      { name: 'Creator Management', path: '/academic-management/students' },
      { name: 'Account Management', path: '/academic-management/account-managers' },
      { name: 'Brand Management', path: '/corporate-management/brands' },
    ],
  },
  {
    name: 'Roles & Permissions',
    path: '/roles-permissions',
    children: [
      { name: 'Role Management', path: '/roles-permissions/roles' },
      { name: 'User Type', path: '/roles-permissions/user-type' },
      { name: 'Notification Control Center', path: '/roles-permissions/notifications' },
    ],
  },
  { name: 'Content', path: '/content' },
  { name: 'Campaign', path: '/campaign' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'Brand', path: '/corporate-management/brands' },
  { name: 'Role', path: '/roles-permissions/roles' },
  { name: 'User Types', path: '/roles-permissions/user-type' },
  { name: 'Notification Control Center', path: '/roles-permissions/notifications' },
  { name: 'KYC', path: '/kyc' },
  { name: 'Get To Know', path: '/get-to-know' },
  { name: 'Data Board', path: '/data-board' },
  {
    name: 'Canvas Creator',
    path: '/canvas-creator',
    children: [
      { name: 'Pages', path: '/canvas-creator/pages' },
      { name: 'Storefront', path: '/canvas-creator/storefront' },
    ],
  },
  {
    name: 'Love',
    path: '/love',
    children: [
      { name: 'LearnLoop', path: '/love/learnloop' },
      { name: 'VibeLab', path: '/love/vibelab' },
      { name: 'GlowCall', path: '/love/glowcall' },
      { name: 'IRL Meet', path: '/love/irl-meet' },
      { name: 'TapIn', path: '/love/tapin' },
    ],
  },
  {
    name: 'Revenue Desk',
    path: '/revenue-desk',
    children: [
      { name: 'Earnings', path: '/revenue-desk/earnings' },
      { name: 'Transactions', path: '/revenue-desk/transactions' },
      { name: 'Subscriptions', path: '/revenue-desk/subscriptions' },
      { name: 'Withdrawals', path: '/revenue-desk/withdrawals' },
    ],
  },
  {
    name: 'PromoBoost',
    path: '/promoboost',
    children: [
      { name: 'Lead Generation', path: '/promoboost/lead-generation' },
      { name: 'Broadcasts', path: '/promoboost/broadcasts' },
      { name: 'Coupons', path: '/promoboost/coupons' },
      { name: 'Unsubscribed Users', path: '/promoboost/unsubscribed-users' },
    ],
  },
  {
    name: 'Subscription Center',
    path: '/subscription-center',
    children: [
      { name: 'Tiers', path: '/subscription-center/tiers' },
      { name: 'TaxDeck', path: '/subscription-center/taxdeck' },
    ],
  },
  { name: 'Fan Fund & Donations', path: '/fan-fund-donations' },
];

const allResources = [
  // Parent resources
  ...permissionResources.map(r => r.name),
  // Child resources
  ...permissionResources
    .filter(r => r.children)
    .flatMap(r => r.children.map(child => child.name))
];

const permissionActions = ['View', 'Create', 'Edit', 'Delete'];

module.exports = {
  permissionResources,
  allResources,
  permissionActions
}; 