'use client'

import {
  Button,
  Input,
  Select,
  Card,
  Typography,
  Row,
  Col,
  Modal,
  Form,
  InputNumber,
  Space,
} from 'antd'
import {
  ShoppingCartOutlined,
  MessageOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function MarketplacePage() {
  const router = useRouter()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()
  const { mutateAsync: upload } = useUploadPublic()
  const { mutateAsync: createMessage } = Api.message.create.useMutation()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedBreed, setSelectedBreed] = useState<string>('')
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [form] = Form.useForm()

  const { data: products, refetch } = Api.product.findMany.useQuery({
    include: { user: true },
    where: {
      AND: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        selectedCategory ? { category: selectedCategory } : {},
        selectedBreed ? { breed: selectedBreed } : {},
      ],
    },
  })

  const { mutateAsync: createProduct } = Api.product.create.useMutation()

  const handleCreateListing = async (values: any) => {
    try {
      let imageUrl = ''
      if (values.image) {
        const uploadResult = await upload({ file: values.image.file })
        imageUrl = uploadResult.url
      }

      await createProduct({
        data: {
          title: values.title,
          description: values.description,
          price: values.price.toString(),
          category: values.category,
          breed: values.breed,
          status: 'AVAILABLE',
          imageUrl,
          userId: user?.id || '',
        },
      })

      enqueueSnackbar('Listing created successfully!', { variant: 'success' })
      setIsCreateModalVisible(false)
      form.resetFields()
      refetch()
    } catch (error) {
      enqueueSnackbar('Failed to create listing', { variant: 'error' })
    }
  }

  const handleContact = async (productId: string, sellerId: string) => {
    try {
      await createMessage({
        data: {
          content: 'Hi, I am interested in your product!',
          senderId: user?.id || '',
          receiverId: sellerId,
          productId,
        },
      })
      enqueueSnackbar('Message sent successfully!', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to send message', { variant: 'error' })
    }
  }

  const categories = ['Live Owls', 'Accessories', 'Food', 'Cages', 'Other']
  const breeds = [
    'Barn Owl',
    'Snowy Owl',
    'Great Horned Owl',
    'Screech Owl',
    'Other',
  ]

  return (
    <PageLayout layout="narrow">
      <Title level={2}>Owl Marketplace</Title>
      <Text>
        Browse and purchase owl-related products or list your own items for
        sale.
      </Text>

      <Space
        direction="vertical"
        size="large"
        style={{ width: '100%', marginTop: 24 }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search products..."
              onChange={e => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Category"
              allowClear
              onChange={setSelectedCategory}
            >
              {categories?.map(cat => (
                <Select.Option key={cat} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Breed"
              allowClear
              onChange={setSelectedBreed}
            >
              {breeds?.map(breed => (
                <Select.Option key={breed} value={breed}>
                  {breed}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
              block
            >
              Create Listing
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {products?.map(product => (
            <Col xs={24} sm={12} md={8} key={product.id}>
              <Card
                cover={
                  product.imageUrl && (
                    <img
                      alt={product.title}
                      src={product.imageUrl}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  )
                }
                actions={[
                  <Button
                    key="buy"
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => router.push(`/marketplace/${product.id}`)}
                  >
                    Buy
                  </Button>,
                  <Button
                    key="contact"
                    icon={<MessageOutlined />}
                    onClick={() => handleContact(product.id, product.userId)}
                  >
                    Contact
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={product.title}
                  description={
                    <>
                      <Text strong>${product.price}</Text>
                      <br />
                      <Text type="secondary">{product.description}</Text>
                      <br />
                      <Text type="secondary">
                        Listed by {product.user?.name} on{' '}
                        {dayjs(product.createdAt).format('MMM D, YYYY')}
                      </Text>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Space>

      <Modal
        title="Create New Listing"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateListing} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select>
              {categories?.map(cat => (
                <Select.Option key={cat} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="breed" label="Breed">
            <Select>
              {breeds?.map(breed => (
                <Select.Option key={breed} value={breed}>
                  {breed}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="image" label="Image">
            <Input type="file" accept="image/*" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Listing
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageLayout>
  )
}
