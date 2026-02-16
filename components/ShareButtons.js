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

// APP跳转函数
const openAppShare = (scheme, fallbackUrl) => {
  if (typeof window === 'undefined') return
  
  // 尝试打开APP
  const openWithScheme = () => {
    window.location.href = scheme
  }
  
  // 打开APP
  openWithScheme()
  
  // 延迟检查是否成功打开APP
  setTimeout(() => {
    // 如果页面仍然在可见状态，说明APP可能未安装，尝试打开网页版
    if (document.visibilityState === 'visible' && fallbackUrl) {
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer')
    }
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
                  const fallbackUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(titleWithSiteInfo)}`
                  openAppShare(lineScheme, fallbackUrl)
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
                  const weiboScheme = `sinaweibo://share?content=${encodeURIComponent(titleWithSiteInfo + ' ' + shareUrl)}`
                  const fallbackUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(titleWithSiteInfo)}`
                  openAppShare(weiboScheme, fallbackUrl)
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
                  const qqScheme = `mqqapi://share/to_fri?src_type=web&version=1&file_type=news&req_type=1&title=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}&desc=${encodeURIComponent(body)}`
                  const fallbackUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(body)}`
                  openAppShare(qqScheme, fallbackUrl)
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
                  // 微信分享需要特殊处理，先尝试打开微信
                  const wechatScheme = `weixin://`
                  const fallbackUrl = `https://wx.qq.com/`
                  openAppShare(wechatScheme, fallbackUrl)
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
