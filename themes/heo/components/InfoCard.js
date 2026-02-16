import { ArrowRightCircle } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import CONFIG from '../config'
import Announcement from './Announcement'
import Card from './Card'

/** 
 * 社交信息卡 
 * @param {*} props 
 * @returns 
 */ 
export function InfoCard(props) { 
  const { siteInfo, notice } = props 
  const router = useRouter() 
  // 在文章详情页特殊处理 
  const isSlugPage = router.pathname.indexOf('/[prefix]') === 0 
  const url1 = siteConfig('HEO_INFO_CARD_URL1', null, CONFIG) 
  const icon1 = siteConfig('HEO_INFO_CARD_ICON1', null, CONFIG) 
  const url2 = siteConfig('HEO_INFO_CARD_URL2', null, CONFIG) 
  const icon2 = siteConfig('HEO_INFO_CARD_ICON2', null, CONFIG) 
  
  // 添加二维码显示状态
  const [showWechatQR, setShowWechatQR] = useState(false)
  const [showDouyinQR, setShowDouyinQR] = useState(false)
  const [wechatPosition, setWechatPosition] = useState({ x: 0, y: 0 })
  const [douyinPosition, setDouyinPosition] = useState({ x: 0, y: 0 })
  
  // 引用按钮元素
  const wechatButtonRef = useRef(null)
  const douyinButtonRef = useRef(null)
  
  // 你的二维码图片路径
  const wechatQRUrl = '/images/wechat.webp' // 微信二维码
  const douyinQRUrl = '/images/douyin.webp' // 抖音二维码
  
  // 计算按钮位置
  useEffect(() => {
    if (wechatButtonRef.current) {
      const rect = wechatButtonRef.current.getBoundingClientRect()
      setWechatPosition({ x: rect.right, y: rect.bottom })
    }
    if (douyinButtonRef.current) {
      const rect = douyinButtonRef.current.getBoundingClientRect()
      setDouyinPosition({ x: rect.right, y: rect.bottom })
    }
  }, [])
  
  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (wechatButtonRef.current) {
        const rect = wechatButtonRef.current.getBoundingClientRect()
        setWechatPosition({ x: rect.right, y: rect.bottom })
      }
      if (douyinButtonRef.current) {
        const rect = douyinButtonRef.current.getBoundingClientRect()
        setDouyinPosition({ x: rect.right, y: rect.bottom })
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return ( 
    <>
      <Card className='wow fadeInUp bg-[#4f65f0] dark:bg-yellow-600 text-white flex flex-col w-72 overflow-visible relative z-10'> 
        {/* 信息卡牌第一行 */} 
        <div className='flex justify-between'> 
          {/* 问候语 */} 
          <GreetingsWords /> 
          {/* 头像 */} 
          <div 
            className={`${isSlugPage ? 'absolute right-0 -mt-8 -mr-6 hover:opacity-0 hover:scale-150 blur' : 'cursor-pointer'} justify-center items-center flex dark:text-gray-100 transform transitaion-all duration-200`}> 
            <LazyImage 
                    src={siteInfo?.icon} 
                    className='rounded-full border-2 border-white' // 添加白色边框 
                    width={isSlugPage ? 100 : 48} 
                    alt={siteConfig('AUTHOR')} 
                /> 
          </div> 
        </div> 

        <h2 className='text-3xl font-extrabold mt-3'>{siteConfig('AUTHOR')}</h2> 

        {/* 公告栏 */} 
        <Announcement post={notice} style={{ color: 'white !important' }} /> 

        <div className='flex justify-between'> 
          <div className='flex space-x-3  hover:text-black dark:hover:text-white'> 
            {/* 微信按钮 */} 
            {url1 && ( 
              <div 
                ref={wechatButtonRef}
                className='w-10 text-center bg-indigo-400 p-2 rounded-full transition-colors duration-200 dark:bg-yellow-500 dark:hover:bg-black hover:bg-white'
                onMouseEnter={() => setShowWechatQR(true)}
                onMouseLeave={() => setShowWechatQR(false)}> 
                <SmartLink href={url1}> 
                  <i className={icon1} /> 
                </SmartLink>
              </div>
            )} 
            
            {/* 抖音按钮 */} 
            {url2 && ( 
              <div 
                ref={douyinButtonRef}
                className='bg-indigo-400 p-2 rounded-full w-10 items-center flex justify-center transition-colors duration-200 dark:bg-yellow-500 dark:hover:bg-black hover:bg-white'
                onMouseEnter={() => setShowDouyinQR(true)}
                onMouseLeave={() => setShowDouyinQR(false)}> 
                <SmartLink href={url2}> 
                  <i className={icon2} /> 
                </SmartLink>
              </div>
            )} 
          </div> 
          {/* 第三个按钮 */} 
          <MoreButton /> 
        </div> 
      </Card> 
      
      {/* 微信二维码弹窗 - 显示在卡片外部 */}
      {showWechatQR && (
        <div 
          className='fixed z-50 p-3 bg-white rounded-lg shadow-xl'
          style={{
            left: `${wechatPosition.x + 10}px`,
            top: `${wechatPosition.y + 10}px`,
            transform: 'translateX(-100%)'
          }}>
          <img 
            src={wechatQRUrl} 
            alt='微信二维码' 
            className='max-w-48 max-h-64 object-contain' // 保持图片比例，限制最大尺寸
          />
          <div className='text-center text-sm mt-1 text-gray-600'>
            扫码添加微信
          </div>
        </div>
      )}
      
      {/* 抖音二维码弹窗 - 显示在卡片外部 */}
      {showDouyinQR && (
        <div 
          className='fixed z-50 p-3 bg-white rounded-lg shadow-xl'
          style={{
            left: `${douyinPosition.x + 10}px`,
            top: `${douyinPosition.y + 10}px`,
            transform: 'translateX(-100%)'
          }}>
          <img 
            src={douyinQRUrl} 
            alt='抖音二维码' 
            className='max-w-48 max-h-64 object-contain' // 保持图片比例，限制最大尺寸
          />
          <div className='text-center text-sm mt-1 text-gray-600'>
            扫码关注抖音
          </div>
        </div>
      )}
    </>
  ) 
} 

/** 
 * 了解更多按鈕 
 * @returns 
 */ 
function MoreButton() { 
  const url3 = siteConfig('HEO_INFO_CARD_URL3', null, CONFIG) 
  const text3 = siteConfig('HEO_INFO_CARD_TEXT3', null, CONFIG) 
  if (!url3) { 
    return <></> 
  } 
  return ( 
    <SmartLink href={url3}> 
      <div 
        className={ 
          'group bg-indigo-400 dark:bg-yellow-500 hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white flex items-center transition-colors duration-200 py-2 px-3 rounded-full space-x-1' 
        }> 
        <ArrowRightCircle 
          className={ 
            'group-hover:stroke-black dark:group-hover:stroke-white w-6 h-6 transition-all duration-100' 
          } 
        /> 
        <div className='font-bold'>{text3}</div> 
      </div> 
    </SmartLink> 
  ) 
} 

/** 
 * 欢迎语 
 */ 
function GreetingsWords() { 
  const greetings = siteConfig('HEO_INFOCARD_GREETINGS', null, CONFIG) 
  const [greeting, setGreeting] = useState(greetings[0]) 
  // 每次点击，随机获取greetings中的一个 
  const handleChangeGreeting = () => { 
    const randomIndex = Math.floor(Math.random() * greetings.length) 
    setGreeting(greetings[randomIndex]) 
  } 

  return ( 
    <div 
      onClick={handleChangeGreeting} 
      className=' select-none cursor-pointer py-1 px-2 bg-indigo-400 hover:bg-indigo-50  hover:text-indigo-950 dark:bg-yellow-500 dark:hover:text-white dark:hover:bg-black text-sm rounded-lg  duration-200 transition-colors'> 
      {greeting} 
    </div> 
  ) 
}
