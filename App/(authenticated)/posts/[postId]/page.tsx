'use client'

import {
  Button,
  Card,
  Input,
  Typography,
  Space,
  Divider,
  Modal,
  List,
  Avatar,
} from 'antd'
import {
  LikeOutlined,
  ShareAltOutlined,
  WarningOutlined,
  SendOutlined,
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

export default function PostDetailPage() {
  const router = useRouter()
  const params = useParams<{ postId: string }>()
  const { user } = useUserContext()
  const { enqueueSnackbar } = useSnackbar()
  const [newComment, setNewComment] = useState('')
  const [reportModalVisible, setReportModalVisible] = useState(false)

  // Fetch post with comments and user information
  const { data: post, refetch } = Api.postData.findFirst.useQuery({
    where: { id: params.postId },
    include: {
      user: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
  })

  // Mutations
  const { mutateAsync: updatePost } = Api.postData.update.useMutation()
  const { mutateAsync: createComment } = Api.comment.create.useMutation()

  const handleLike = async () => {
    try {
      await updatePost({
        where: { id: params.postId },
        data: { likes: (post?.likes || 0) + 1 },
      })
      refetch()
      enqueueSnackbar('Post liked!', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to like post', { variant: 'error' })
    }
  }

  const handleComment = async () => {
    if (!newComment.trim()) {
      enqueueSnackbar('Please enter a comment', { variant: 'error' })
      return
    }

    try {
      await createComment({
        data: {
          content: newComment,
          postId: params.postId,
          userId: user?.id || '',
        },
      })
      setNewComment('')
      refetch()
      enqueueSnackbar('Comment added successfully', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to add comment', { variant: 'error' })
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      enqueueSnackbar('Link copied to clipboard!', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to copy link', { variant: 'error' })
    }
  }

  const handleReport = () => {
    setReportModalVisible(false)
    enqueueSnackbar('Content reported successfully', { variant: 'success' })
  }

  if (!post) return null

  return (
    <PageLayout layout="narrow">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Title level={2}>Post Details</Title>

        <Card>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Space align="start">
              <Avatar src={post.user?.pictureUrl} />
              <Space direction="vertical" size={0}>
                <Text strong>{post.user?.name}</Text>
                <Text type="secondary">
                  {dayjs(post.createdAt).format('MMM D, YYYY')}
                </Text>
              </Space>
            </Space>

            <Paragraph>{post.content}</Paragraph>

            {post.mediaUrl && (
              <img
                src={post.mediaUrl}
                alt="Post media"
                style={{ maxWidth: '100%', borderRadius: 8 }}
              />
            )}

            <Space size="large">
              <Button icon={<LikeOutlined />} onClick={handleLike}>
                {post.likes?.toString()} Likes
              </Button>
              <Button icon={<ShareAltOutlined />} onClick={handleShare}>
                Share
              </Button>
              <Button
                icon={<WarningOutlined />}
                danger
                onClick={() => setReportModalVisible(true)}
              >
                Report
              </Button>
            </Space>
          </Space>
        </Card>

        <Card title="Comments">
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleComment}
              >
                Comment
              </Button>
            </Space.Compact>

            <List
              itemLayout="horizontal"
              dataSource={post.comments}
              renderItem={comment => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={comment.user?.pictureUrl} />}
                    title={<Text strong>{comment.user?.name}</Text>}
                    description={
                      <Space direction="vertical" size={0}>
                        <Text>{comment.content}</Text>
                        <Text type="secondary">
                          {dayjs(comment.createdAt).format('MMM D, YYYY')}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Space>
        </Card>
      </Space>

      <Modal
        title="Report Content"
        open={reportModalVisible}
        onOk={handleReport}
        onCancel={() => setReportModalVisible(false)}
      >
        <p>Are you sure you want to report this content as inappropriate?</p>
      </Modal>
    </PageLayout>
  )
}
