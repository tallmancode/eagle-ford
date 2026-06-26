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
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Contributor',
          value: 'contributor',
        },
      ],
    },
  ],
  timestamps: true,
}
