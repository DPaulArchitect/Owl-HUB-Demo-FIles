'use client'

import {
  Button,
  Card,
  Input,
  Rate,
  Typography,
  Space,
  Radio,
  Upload,
  List,
  Avatar,
  Modal,
  Form,
} from 'antd'
import { LikeOutlined, CommentOutlined, PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'
import type { UploadFile } from 'antd/es/upload/interface'
import type { Prisma } from '@prisma/client'
const { Title, Text, Paragraph } = Typography
import { useUserContext } from '@/core/context'
import { useRouter, useParams } from 'next/navigation'
import { useUploadPublic } from '@/core/hooks/upload'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'

export default function HomePage() {
  const router = useRouter()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { mutateAsync: upload } = useUploadPublic()
  const [form] = Form.useForm()

  // Fetch posts with user information
  const { data: posts, refetch } = Api.postData.findMany.useQuery({
    include: { user: true },
    orderBy: sortBy === 'recent' ? { createdAt: 'desc' } : { likes: 'desc' },
  })

  // Mutations
  const { mutateAsync: createPost } = Api.postData.create.useMutation()
  const { mutateAsync: updatePost } = Api.postData.update.useMutation()
  const { mutateAsync: createComment } = Api.comment.create.useMutation()

  const handleCreatePost = async (values: any) => {
    try {
      let mediaUrl = ''
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const uploadResult = await upload({ file: fileList[0].originFileObj })
        mediaUrl = uploadResult.url
      }

      await createPost({
        data: {
          content: values.content,
          mediaUrl,
          mediaType: fileList[0]?.type?.startsWith('video') ? 'video' : 'image',
          likes: 0,
          userId: user?.id || '',
        },
      })

      enqueueSnackbar('Post created successfully!', { variant: 'success' })
      setIsModalOpen(false)
      form.resetFields()
      setFileList([])
      refetch()
    } catch (error) {
      enqueueSnackbar('Error creating post', { variant: 'error' })
    }
  }

  const handleLike = async (postId: string, currentLikes: number) => {
    try {
      await updatePost({
        where: { id: postId },
        data: { likes: currentLikes + 1 },
      })
      refetch()
    } catch (error) {
      enqueueSnackbar('Error liking post', { variant: 'error' })
    }
  }

  const handleComment = async (postId: string, content: string) => {
    try {
      await createComment({
        data: {
          content,
          postId,
          userId: user?.id || '',
        },
      })
      refetch()
      enqueueSnackbar('Comment added successfully!', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Error adding comment', { variant: 'error' })
    }
  }

  return (
    <PageLayout layout="narrow">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title level={2}>Owl Community Feed</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Create Post
          </Button>
        </div>

        <Radio.Group value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <Radio.Button value="recent">Most Recent</Radio.Button>
          <Radio.Button value="popular">Most Popular</Radio.Button>
        </Radio.Group>

        <List
          itemLayout="vertical"
          dataSource={posts}
          renderItem={post => (
            <Card style={{ marginBottom: 16 }}>
              <List.Item
                actions={[
                  <Button
                    key="like"
                    icon={<LikeOutlined />}
                    onClick={() => handleLike(post.id, post.likes)}
                  >
                    {post.likes.toString()}
                  </Button>,
                  <Rate key="rate" value={Number(post.rating)} />,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={post.user?.pictureUrl} />}
                  title={post.user?.name}
                  description={dayjs(post.createdAt).format('MMMM D, YYYY')}
                />
                <Paragraph>{post.content}</Paragraph>
                {post.mediaUrl &&
                  (post.mediaType === 'video' ? (
                    <video
                      controls
                      src={post.mediaUrl}
                      style={{ maxWidth: '100%' }}
                    />
                  ) : (
                    <img
                      src={post.mediaUrl}
                      alt="Post content"
                      style={{ maxWidth: '100%' }}
                    />
                  ))}
              </List.Item>
            </Card>
          )}
        />

        <Modal
          title="Create New Post"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleCreatePost}>
            <Form.Item name="content" rules={[{ required: true }]}>
              <Input.TextArea rows={4} placeholder="Share your owl story..." />
            </Form.Item>
            <Form.Item>
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                maxCount={1}
              >
                <Button icon={<PlusOutlined />}>Add Media</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Post
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </PageLayout>
  )
}
