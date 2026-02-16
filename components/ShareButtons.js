import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WeiboIcon,
  WeiboShareButton
} from 'react-share'

const QrCode = dynamic(() => import('@/components/QrCode'), { ssr: false })

// 添加APP跳转函数
const openAppShare = (scheme) => {
  if (typeof window === 'undefined') return
  
  // 尝试打开APP
  const openWithScheme = () => {
    window.location.href = scheme
  }
  
  // 打开APP
  openWithScheme()
  
  // 延迟检查是否成功打开APP
  setTimeout(() => {
    // 如果页面仍然在可见状态，说明APP可能未安装
    // 这里可以添加备选方案，如打开网页版分享
  }, 1000)
}

/**
 * @author https://github.com/txs
 * @param {*} param0
 * @returns
 */
const ShareButtons = ({ post }) => {
  const router = useRouter()
  const [shareUrl, setShareUrl] = useState(siteConfig('LINK') + router.asPath)
  const title = post?.title || siteConfig('TITLE')
  const image = post?.pageCover
  const tags = post.tags || []
  const hashTags = tags.map(tag => `#${tag}`).join(',')
  const body =
    post?.title + ' | ' + title + ' ' + shareUrl + ' ' + post?.summary

  const services = siteConfig('POSTS_SHARE_SERVICES').split(',')
  const titleWithSiteInfo = title + ' | ' + siteConfig('TITLE')
  const { locale } = useGlobal()
  const [qrCodeShow, setQrCodeShow] = useState(false)

  const copyUrl = () => {
    // 确保 shareUrl 是一个正确的字符串并进行解码
    const decodedUrl = decodeURIComponent(shareUrl)
    navigator?.clipboard?.writeText(decodedUrl)
    alert(locale.COMMON.URL_COPIED + ' \n' + decodedUrl)
  }

  const openPopover = () => {
    setQrCodeShow(true)
  }
  const closePopover = () => {
    setQrCodeShow(false)
  }
  const openRedirectShare = base => {
    if (!shareUrl || typeof window === 'undefined') return
    window.open(
      `${base}${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }
  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  return (
    <>
      {services.map(singleService => {
        switch (singleService) {
          case 'facebook':
            return (
              <FacebookShareButton
                key={singleService}
                url={shareUrl}
                hashtag={hashTags}
                className='mx-1'>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
            )
          case 'email':
            return (
              <EmailShareButton
                key={singleService}
                url={shareUrl}
                subject={titleWithSiteInfo}
                body={body}
                className='mx-1'>
                <EmailIcon size={32} round />
              </EmailShareButton>
            )
          case 'twitter':
            return (
              <TwitterShareButton
                key={singleService}
                url={shareUrl}
                title={titleWithSiteInfo}
                hashtags={tags}
                className='mx-1'>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
            )
          case 'telegram':
            return (
              <TelegramShareButton
                key={singleService}
                url={shareUrl}
                title={titleWithSiteInfo}
                className='mx-1'>
                <TelegramIcon size={32} round />
              </TelegramShareButton>
            )
          case 'line':
            return (
              <button
                aria-label={singleService}
                key={singleService}
                onClick={() => {
                  // Line分享URL Scheme
                  const lineScheme = `line://msg/text/?${encodeURIComponent(titleWithSiteInfo + ' ' + shareUrl)}`
                  openAppShare(lineScheme)
                }}
                className='cursor-pointer mx-1'>
                <LineIcon size={32} round />
              </button>
            )
          case 'linkedin':
            return (
              <LinkedinShareButton
                key={singleService}
                url={shareUrl}
                className='mx-1'>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
            )
          case 'weibo':
            return (
              <button
                aria-label={singleService}
                key={singleService}
                onClick={() => {
                  // 微博分享URL Scheme
                  const weiboScheme = `sinaweibo://share?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(titleWithSiteInfo)}`
                  openAppShare(weiboScheme)
                }}
                className='cursor-pointer mx-1'>
                <WeiboIcon size={32} round />
              </button>
            )
          case 'qq':
            return (
              <button
                aria-label={singleService}
                key={singleService}
                onClick={() => {
                  // QQ分享URL Scheme
                  const qqScheme = `mqqapi://share/to_fri?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(body)}`
                  openAppShare(qqScheme)
                }}
                className='cursor-pointer bg-blue-600 text-white rounded-full mx-1'>
                <i className='fab fa-qq w-8' />
              </button>
            )
          case 'wechat':
            return (
              <button
                aria-label={singleService}
                key={singleService}
                onClick={() => {
                  // 微信分享URL Scheme
                  const wechatScheme = `weixin://share?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(titleWithSiteInfo)}`
                  openAppShare(wechatScheme)
                }}
                className='cursor-pointer bg-green-600 text-white rounded-full mx-1'>
                <div id='wechat-button'>
                  <i className='fab fa-weixin w-8' />
                </div>
              </button>
            )
          case 'link':
            return (
              <button
                aria-label={singleService}
                key={singleService}
                className='cursor-pointer bg-yellow-500 text-white rounded-full mx-1'>
                <div alt={locale.COMMON.URL_COPIED} onClick={copyUrl}>
                  <i className='fas fa-link w-8' />
                </div>
              </button>
            )
          default:
            return <></>
        }
      })}
    </>
  )
}

export default ShareButtons
