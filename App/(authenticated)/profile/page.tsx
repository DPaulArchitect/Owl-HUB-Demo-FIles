'use client'

import { Avatar, Button, Flex, Form, Input, Switch, Typography } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useUserContext } from '@/core/context'
import { Utility } from '@/core/helpers/utility'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import { TokenBalance } from '@/designSystem/ui/TokenBalance'
import { User } from '@prisma/client'
import { signOut } from 'next-auth/react'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

import { usePushNotification } from '@/core/hooks/pushNotification'

export default function ProfilePage() {
  const { enqueueSnackbar } = useSnackbar()
  const { user, refetch: refetchUser } = useUserContext()

  const notification = usePushNotification()

  const [form] = Form.useForm()

  const [isLoading, setLoading] = useState(false)
  const [isLoadingLogout, setLoadingLogout] = useState(false)

  const { mutateAsync: updateUser } = Api.user.update.useMutation()

  useEffect(() => {
    form.setFieldsValue(user)
  }, [user])

  const handleSubmit = async (values: Partial<User>) => {
    setLoading(true)

    try {
      await updateUser({
        where: { id: user.id },
        data: {
          email: values.email,
          name: values.name,
          pictureUrl: values.pictureUrl,
        },
      })

      refetchUser()
    } catch (error) {
      enqueueSnackbar(`Could not save user: ${error.message}`, {
        variant: 'error',
      })
    }

    setLoading(false)
  }

  const handleClickLogout = async () => {
    setLoadingLogout(true)

    try {
      await signOut({ callbackUrl: '/login' })
    } catch (error) {
      enqueueSnackbar(`Could not logout: ${error.message}`, {
        variant: 'error',
      })

      setLoadingLogout(false)
    }
  }

  return (
    <PageLayout layout="super-narrow">
      <Flex justify="space-between" align="center">
        <Typography.Title level={1}>Profile</Typography.Title>
        <Button onClick={handleClickLogout} loading={isLoadingLogout}>
          Logout
        </Button>
      </Flex>

      <Flex vertical align="center" gap="small" style={{ marginBottom: '30px' }}>
        <Avatar size={80} src={user.pictureUrl}>
          {Utility.stringToInitials(user.name)}
        </Avatar>
        <TokenBalance userId={user.id} />
        <Button 
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={() => window.location.href = '/store'}
        >
          Purchase Tokens
        </Button>
      </Flex>

      <Form
        form={form}
        initialValues={user}
        onFinish={handleSubmit}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Email is required' }]}
        >
          <Input type="email" placeholder="Your email" autoComplete="email" />
        </Form.Item>

        <Form.Item label="Profile picture" name="pictureUrl">
          <Input />
        </Form.Item>

        <Form.Item>
          <Flex justify="end">
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Save
            </Button>
          </Flex>
        </Form.Item>
      </Form>

      {notification.isSupported && (
        <Flex vertical gap={20} className="py-10">
          <Typography.Title level={3}>Notification</Typography.Title>

          {notification.status === 'denied' && (
            <Typography.Text type="secondary">
              Notifications are disabled and can be turned on in your device
              settings.
            </Typography.Text>
          )}

          {notification.status !== 'denied' && (
            <>
              <Flex justify="space-between" align="center">
                <Typography.Text>Allow Notifications</Typography.Text>
                <Switch
                  value={notification.isSubscribed}
                  onChange={() => {
                    if (notification.isSubscribed) {
                      notification.unsubscribe()
                    } else {
                      notification.subscribe()
                    }
                  }}
                  disabled={notification.isLoading}
                />
              </Flex>
            </>
          )}
        </Flex>
      )}
    </PageLayout>
  )
}
