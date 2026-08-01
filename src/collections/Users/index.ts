import type { CollectionConfig } from 'payload'
import {
  isAdminOrDeveloper,
  isAdminOrDeveloperField,
  isAdminOrSelf,
  isAuthenticated,
} from '@/lib/utils/accessUtil'
import { isHttpsDeployment } from '@/lib/utils/getServerSideURL'

export const UsersCollection: CollectionConfig = {
  slug: 'users',
  access: {
    create: isAdminOrDeveloper,
    delete: isAdminOrDeveloper,
    read: isAuthenticated,
    update: isAdminOrSelf,
  },
  admin: {
    defaultColumns: ['firstName', 'lastName', 'username', 'email', 'roles'],
    useAsTitle: 'username',
    group: 'Settings',
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
