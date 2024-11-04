'use client'

import {
  Button,
  Card,
  Col,
  Input,
  InputNumber,
  Modal,
  Row,
  Typography,
  Upload,
} from 'antd'
import {
  ShoppingCartOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import type { UploadFile } from 'antd/es/upload/interface'
const { Title, Text } = Typography
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function MerchandiseStorePage() {
  const router = useRouter()
  const params = useParams<any>()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()
  const { mutateAsync: uploadFile } = useUploadPublic()

  const [isCustomizeModalVisible, setIsCustomizeModalVisible] = useState(false)
  const [selectedMerchandise, setSelectedMerchandise] = useState<any>(null)
  const [customImage, setCustomImage] = useState<UploadFile[]>([])

  const { data: merchandise, isLoading } = Api.merchandise.findMany.useQuery({})
  const { data: userTokens } = Api.token.findFirst.useQuery({
    where: { userId: user?.id },
  })
  const { mutateAsync: createOrder } = Api.order.create.useMutation()

  const handlePurchase = async (item: any, customImageUrl?: string) => {
    try {
      if (!user) {
        enqueueSnackbar('Please login to make a purchase', { variant: 'error' })
        return
      }

      const tokenBalance = parseFloat(userTokens?.balance || '0')
      const itemPrice = parseFloat(item.price)

      if (tokenBalance < itemPrice) {
        enqueueSnackbar('Insufficient tokens', { variant: 'error' })
        return
      }

      await createOrder({
        data: {
          status: 'PENDING',
          amount: item.price,
          buyerId: user.id,
          sellerId: user.id,
          merchandiseId: item.id,
        },
      })

      enqueueSnackbar('Purchase successful!', { variant: 'success' })
      setIsCustomizeModalVisible(false)
      setCustomImage([])
    } catch (error) {
      enqueueSnackbar('Failed to process purchase', { variant: 'error' })
    }
  }

  const handleCustomize = async () => {
    if (customImage.length === 0) {
      enqueueSnackbar('Please upload an image', { variant: 'error' })
      return
    }

    try {
      const file = customImage[0].originFileObj
      if (file) {
        const { url } = await uploadFile({ file })
        await handlePurchase(selectedMerchandise, url)
      }
    } catch (error) {
      enqueueSnackbar('Failed to upload image', { variant: 'error' })
    }
  }

  return (
    <PageLayout layout="narrow">
      <div style={{ padding: '24px' }}>
        <Title level={2}>Owl Merchandise Store</Title>
        <Text>
          Browse our collection of owl-themed merchandise. Some items can be
          customized with your owl's photos!
        </Text>

        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          {merchandise?.map(item => (
            <Col xs={24} sm={12} md={8} key={item.id}>
              <Card
                cover={
                  <img
                    alt={item.name}
                    src={item.imageUrl || 'https://placeholder.com/300x200'}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
                actions={[
                  item.isCustomizable ? (
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setSelectedMerchandise(item)
                        setIsCustomizeModalVisible(true)
                      }}
                    >
                      Customize
                    </Button>
                  ) : (
                    <Button
                      type="text"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handlePurchase(item)}
                    >
                      Purchase
                    </Button>
                  ),
                ]}
              >
                <Card.Meta
                  title={item.name}
                  description={
                    <>
                      <Text>{item.description}</Text>
                      <br />
                      <Text strong>{item.price} tokens</Text>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Modal
          title="Customize Your Item"
          open={isCustomizeModalVisible}
          onCancel={() => {
            setIsCustomizeModalVisible(false)
            setCustomImage([])
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => setIsCustomizeModalVisible(false)}
            >
              Cancel
            </Button>,
            <Button key="customize" type="primary" onClick={handleCustomize}>
              Purchase Customized Item
            </Button>,
          ]}
        >
          <Upload
            listType="picture-card"
            fileList={customImage}
            onChange={({ fileList }) => setCustomImage(fileList)}
            beforeUpload={() => false}
            maxCount={1}
          >
            {customImage.length < 1 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload Photo</div>
              </div>
            )}
          </Upload>
        </Modal>
      </div>
    </PageLayout>
  )
}
