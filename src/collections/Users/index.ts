import type { CollectionConfig } from 'payload'
import {
  isAdminOrDeveloper,
  isAdminOrDeveloperField,
  isAdminOrSelf,
  isAuthenticatedUsersRead,
  isCallCenter,
} from '@/lib/utils/accessUtil'
import { isHttpsDeployment } from '@/lib/utils/getServerSideURL'

export const UsersCollection: CollectionConfig = {
  slug: 'users',
  access: {
    create: isAdminOrDeveloper,
    delete: isAdminOrDeveloper,
    read: isAuthenticatedUsersRead,
    update: isAdminOrSelf,
  },
  admin: {
    defaultColumns: ['firstName', 'lastName', 'username', 'email', 'roles'],
    useAsTitle: 'username',
    group: 'Settings',
    hidden: ({ user }) => isCallCenter(user),
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minutes
    cookies: {
      secure: isHttpsDeployment(),
      sameSite: 'Lax',
    },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'username',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      options: [
        {
          label: 'Developer',
          value: 'developer',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Marketing',
          value: 'marketing',
        },
        {
          label: 'Manager',
          value: 'manager',
        },
        {
          label: 'Staff',
          value: 'staff',
        },
        {
          label: 'Call Center',
          value: 'call-center',
        },
        {
          label: 'Analytics',
          value: 'analytics',
        },
      ],
      access: {
        create: isAdminOrDeveloperField,
        update: isAdminOrDeveloperField,
      },
      filterOptions: ({ options, req }) =>
        req.user?.roles?.includes('developer') || req.user?.roles?.includes('admin')
          ? options
          : options.filter(
              (option) => (typeof option === 'string' ? options : option.value) !== 'developer',
            ),
    },
  ],
  timestamps: true,
}
