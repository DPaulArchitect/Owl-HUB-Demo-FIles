'use client'

import {
  Button,
  Card,
  Typography,
  Space,
  Divider,
  Image,
  List,
  Modal,
  Input,
  Row,
  Col,
} from 'antd'
import {
  ShoppingCartOutlined,
  MessageOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
const { Title, Text, Paragraph } = Typography
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams<{ productId: string }>()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()
  const [messageModal, setMessageModal] = useState(false)
  const [message, setMessage] = useState('')
  const [orderHistoryModal, setOrderHistoryModal] = useState(false)

  // Fetch product details with seller information
  const { data: product } = Api.product.findFirst.useQuery({
    where: { id: params.productId },
    include: { user: true },
  })

  // Fetch order history
  const { data: orders } = Api.order.findMany.useQuery({
    where: {
      OR: [{ buyerId: user?.id }, { sellerId: user?.id }],
      productId: params.productId,
    },
  })

  // Mutations
  const { mutateAsync: createOrder } = Api.order.create.useMutation()
  const { mutateAsync: createMessage } = Api.message.create.useMutation()

  const handlePurchase = async () => {
    if (!user) {
      enqueueSnackbar('Please login to purchase', { variant: 'error' })
      return
    }

    try {
      await createOrder({
        data: {
          status: 'PENDING',
          amount: product?.price || '0',
          buyerId: user.id,
          sellerId: product?.userId || '',
          productId: params.productId,
        },
      })
      enqueueSnackbar('Order placed successfully', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to place order', { variant: 'error' })
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    try {
      await createMessage({
        data: {
          content: message,
          senderId: user?.id || '',
          receiverId: product?.userId || '',
          productId: params.productId,
        },
      })
      setMessage('')
      setMessageModal(false)
      enqueueSnackbar('Message sent successfully', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to send message', { variant: 'error' })
    }
  }

  if (!product) return null

  return (
    <PageLayout layout="narrow">
      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.title}
                style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }}
              />
            )}
          </Col>
          <Col xs={24} md={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title level={2}>{product.title}</Title>
              <Text type="secondary">Category: {product.category}</Text>
              {product.breed && (
                <Text type="secondary">Breed: {product.breed}</Text>
              )}
              <Title level={4}>Price: ${product.price}</Title>
              <Paragraph>{product.description}</Paragraph>

              <Space>
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={handlePurchase}
                  disabled={product.userId === user?.id}
                >
                  Purchase
                </Button>
                <Button
                  icon={<MessageOutlined />}
                  onClick={() => setMessageModal(true)}
                  disabled={product.userId === user?.id}
                >
                  Contact Seller
                </Button>
                <Button
                  icon={<HistoryOutlined />}
                  onClick={() => setOrderHistoryModal(true)}
                >
                  Order History
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      <Modal
        title="Contact Seller"
        open={messageModal}
        onOk={handleSendMessage}
        onCancel={() => setMessageModal(false)}
      >
        <Input.TextArea
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
      </Modal>

      <Modal
        title="Order History"
        open={orderHistoryModal}
        onCancel={() => setOrderHistoryModal(false)}
        footer={null}
        width={600}
      >
        <List
          dataSource={orders}
          renderItem={order => (
            <List.Item>
              <List.Item.Meta
                title={`Order #${order.id.slice(0, 8)}`}
                description={
                  <Space direction="vertical">
                    <Text>Status: {order.status}</Text>
                    <Text>Amount: ${order.amount}</Text>
                    <Text>
                      Date: {dayjs(order.createdAt).format('MMMM D, YYYY')}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </PageLayout>
  )
}
