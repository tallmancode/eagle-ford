import type { CollectionConfig } from 'payload'
import { isAuthenticated } from '@/lib/utils/accessUtil'

export const UsersCollection: CollectionConfig = {
  slug: 'users',
  access: {
    create: isAuthenticated,
    delete: isAuthenticated,
    read: isAuthenticated,
    update: isAuthenticated,
  },
  admin: {
    defaultColumns: ['firstName', 'lastName', 'username', 'email', 'roles'],
    useAsTitle: 'username',
    group: 'Settings',
  },
  auth: true,
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
      filterOptions: ({ options, req }) =>
        req.user?.roles?.includes('developer')
          ? options
          : options.filter(
              (option) => (typeof option === 'string' ? options : option.value) !== 'developer',
            ),
    },
  ],
  timestamps: true,
}
