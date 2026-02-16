import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
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

// 添加设备检测函数
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)
}

// APP跳转函数
const openAppShare = (scheme, fallbackUrl) => {
  if (typeof window === 'undefined') return
  
  // 检测是否为移动设备
  const mobile = isMobileDevice()
  
  // 如果是移动设备，尝试打开APP
  if (mobile) {
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
  } else {
    // 如果是电脑端，直接打开网页版分享
    if (fallbackUrl) {
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer')
    }
  }
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
  const [wechatQrShow, setWechatQrShow] = useState(false)
  const [qqQrShow, setQqQrShow] = useState(false)

  const copyUrl = () => {
    // 确保 shareUrl 是一个正确的字符串并进行解码
    const decodedUrl = decodeURIComponent(shareUrl)
    navigator?.clipboard?.writeText(decodedUrl)
    alert(locale.COMMON.URL_COPIED + ' \n' + decodedUrl)
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

  // 检测是否为移动设备
  const mobile = isMobileDevice()

  // 生成二维码URL
  const generateQrCodeUrl = (text) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(text)}`
  }

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
                  // 微博分享
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
              <div className='relative mx-1'>
                <button
                  aria-label={singleService}
                  key={singleService}
                  onMouseEnter={() => !mobile && setQqQrShow(true)}
                  onMouseLeave={() => setQqQrShow(false)}
                  onClick={() => {
                    if (mobile) {
                      // 手机端：跳转到QQ
                      const qqScheme = `mqqapi://share/to_fri?src_type=web&version=1&file_type=news&req_type=1&title=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}&desc=${encodeURIComponent(body)}`
                      const fallbackUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(body)}`
                      openAppShare(qqScheme, fallbackUrl)
                    }
                  }}
                  className='cursor-pointer bg-blue-600 text-white rounded-full'>
                  <i className='fab fa-qq w-8' />
                </button>
                {/* 电脑端显示二维码 */}
                {!mobile && qqQrShow && (
                  <div className='absolute z-40 bottom-10 -left-10 bg-white shadow-xl p-2'>
                    <img 
                      src={generateQrCodeUrl(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(body)}`)} 
                      alt='QQ分享二维码' 
                      className='w-28 h-28'
                    />
                    <div className='text-center text-black font-semibold text-sm mt-1'>
                      {locale.COMMON.SCAN_QR_CODE || '扫码分享'}
                    </div>
                  </div>
                )}
              </div>
            )
          case 'wechat':
            return (
              <div className='relative mx-1'>
                <button
                  aria-label={singleService}
                  key={singleService}
                  onMouseEnter={() => !mobile && setWechatQrShow(true)}
                  onMouseLeave={() => setWechatQrShow(false)}
                  onClick={() => {
                    if (mobile) {
                      // 手机端：跳转到微信
                      const wechatScheme = `weixin://`
                      const fallbackUrl = `https://wx.qq.com/`
                      openAppShare(wechatScheme, fallbackUrl)
                    }
                  }}
                  className='cursor-pointer bg-green-600 text-white rounded-full'>
                  <i className='fab fa-weixin w-8' />
                </button>
                {/* 电脑端显示二维码 */}
                {!mobile && wechatQrShow && (
                  <div className='absolute z-40 bottom-10 -left-10 bg-white shadow-xl p-2'>
                    <img 
                      src={generateQrCodeUrl(shareUrl)} 
                      alt='微信分享二维码' 
                      className='w-28 h-28'
                    />
                    <div className='text-center text-black font-semibold text-sm mt-1'>
                      {locale.COMMON.SCAN_QR_CODE || '扫码分享'}
                    </div>
                  </div>
                )}
              </div>
            )
          case 'link':
            return (
              <button
                aria-label={singleService}
                key={singleService}
                className='cursor-pointer bg-yellow-500 text-white rounded-full mx-1'>
                <div alt={locale.COMMON.URL_COPIED || '复制链接'} onClick={copyUrl}>
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
