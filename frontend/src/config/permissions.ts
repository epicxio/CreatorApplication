import React from 'react';
import {
  PersonOutline,
  Security as SecurityIcon,
  ArticleOutlined,
  CampaignOutlined,
  StorefrontOutlined,
  StarOutline,
  AnalyticsOutlined,
  DashboardOutlined,
  LockOpenOutlined,
  HistoryOutlined,
  GroupWorkOutlined,
  VerifiedUserOutlined,
  Notifications as NotificationsIcon,
  InfoOutlined,
  BarChartOutlined,
  BrushOutlined,
  FavoriteBorderOutlined,
  AttachMoneyOutlined,
  SubscriptionsOutlined,
  VolunteerActivismOutlined,
} from '@mui/icons-material';

export interface PermissionResource {
  name: string;
  IconComponent: React.ElementType;
  path?: string;
  children?: PermissionResource[];
}

export const permissionResources: PermissionResource[] = [
  {
    name: 'Dashboard',
    IconComponent: DashboardOutlined,
    path: '/dashboard',
  },
  {
    name: 'User',
    IconComponent: PersonOutline,
    path: '/user-management',
    children: [
      { 
        name: 'User List', 
        IconComponent: PersonOutline,
        path: '/user-management/list'
      },
      { 
        name: 'Invitation', 
        IconComponent: PersonOutline,
        path: '/user-management/invitations'
      },
    ],
  },
  {
    name: 'Creator',
    IconComponent: StarOutline,
    path: '/academic-management',
    children: [
      { 
        name: 'Creator Management', 
        IconComponent: StarOutline,
        path: '/academic-management/students'
      },
      { 
        name: 'Account Management', 
        IconComponent: GroupWorkOutlined,
        path: '/academic-management/account-managers'
      },
      { 
        name: 'Brand Management', 
        IconComponent: StorefrontOutlined,
        path: '/corporate-management/brands'
      },
    ],
  },
  {
    name: 'Roles & Permissions',
    IconComponent: SecurityIcon,
    path: '/roles-permissions',
    children: [
      { 
        name: 'Role Management', 
        IconComponent: SecurityIcon,
        path: '/roles-permissions/roles'
      },
      { 
        name: 'User Type', 
        IconComponent: GroupWorkOutlined,
        path: '/roles-permissions/user-type'
      },
      { 
        name: 'Notification Control Center', 
        IconComponent: NotificationsIcon,
        path: '/roles-permissions/notifications'
      },
    ],
  },
  {
    name: 'Content',
    IconComponent: ArticleOutlined,
    path: '/content',
  },
  {
    name: 'Campaign',
    IconComponent: CampaignOutlined,
    path: '/campaign',
  },
  {
    name: 'Analytics',
    IconComponent: AnalyticsOutlined,
    path: '/analytics',
  },
  {
    name: 'KYC',
    IconComponent: VerifiedUserOutlined,
    path: '/kyc',
  },
  {
    name: 'Get To Know',
    IconComponent: InfoOutlined,
    path: '/get-to-know',
  },
  {
    name: 'Data Board',
    IconComponent: BarChartOutlined,
    path: '/data-board',
  },
  {
    name: 'Canvas Creator',
    IconComponent: BrushOutlined,
    path: '/canvas-creator',
    children: [
      {
        name: 'Pages',
        IconComponent: BrushOutlined,
        path: '/canvas-creator/pages',
      },
      {
        name: 'Storefront',
        IconComponent: StorefrontOutlined,
        path: '/canvas-creator/storefront',
      },
    ],
  },
  {
    name: 'Love',
    IconComponent: FavoriteBorderOutlined,
    path: '/love',
    children: [
      { 
        name: 'LearnLoop', 
        IconComponent: FavoriteBorderOutlined,
        path: '/love/learnloop'
      },
      { 
        name: 'VibeLab', 
        IconComponent: FavoriteBorderOutlined,
        path: '/love/vibelab'
      },
      { 
        name: 'GlowCall', 
        IconComponent: FavoriteBorderOutlined,
        path: '/love/glowcall'
      },
      { 
        name: 'IRL Meet', 
        IconComponent: FavoriteBorderOutlined,
        path: '/love/irl-meet'
      },
      { 
        name: 'TapIn', 
        IconComponent: FavoriteBorderOutlined,
        path: '/love/tapin'
      },
    ],
  },
  {
    name: 'Revenue Desk',
    IconComponent: AttachMoneyOutlined,
    path: '/revenue-desk',
    children: [
      {
        name: 'Earnings',
        IconComponent: AttachMoneyOutlined,
        path: '/revenue-desk/earnings',
      },
      {
        name: 'Transactions',
        IconComponent: AttachMoneyOutlined,
        path: '/revenue-desk/transactions',
      },
      {
        name: 'Subscriptions',
        IconComponent: SubscriptionsOutlined,
        path: '/revenue-desk/subscriptions',
      },
      {
        name: 'Withdrawals',
        IconComponent: AttachMoneyOutlined,
        path: '/revenue-desk/withdrawals',
      },
    ],
  },
  {
    name: 'PromoBoost',
    IconComponent: CampaignOutlined,
    path: '/promoboost',
    children: [
      {
        name: 'Lead Generation',
        IconComponent: CampaignOutlined,
        path: '/promoboost/lead-generation',
      },
      {
        name: 'Broadcasts',
        IconComponent: CampaignOutlined,
        path: '/promoboost/broadcasts',
      },
      {
        name: 'Coupons',
        IconComponent: CampaignOutlined,
        path: '/promoboost/coupons',
      },
      {
        name: 'Unsubscribed Users',
        IconComponent: CampaignOutlined,
        path: '/promoboost/unsubscribed-users',
      },
    ],
  },
  {
    name: 'Subscription Center',
    IconComponent: SubscriptionsOutlined,
    path: '/subscription-center',
    children: [
      {
        name: 'Tiers',
        IconComponent: SubscriptionsOutlined,
        path: '/subscription-center/tiers',
      },
      {
        name: 'TaxDeck',
        IconComponent: SubscriptionsOutlined,
        path: '/subscription-center/taxdeck',
      },
    ],
  },
  {
    name: 'Fan Fund & Donations',
    IconComponent: VolunteerActivismOutlined,
    path: '/fan-fund-donations',
  },
];

export const allResources = permissionResources.map(r => r.name);
export const permissionActions = ['View', 'Create', 'Edit', 'Delete'] as const;
export type PermissionAction = (typeof permissionActions)[number];