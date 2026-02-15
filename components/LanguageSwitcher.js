import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'

const LanguageSwitcher = () => {
  const { lang, changeLang } = useGlobal()
  const router = useRouter()
  
  // 添加所有语言选项
  const languages = [
    { code: 'zh-CN', name: '中文' },
    { code: 'en-US', name: 'English' },
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'fr-FR', name: 'Français' },
    { code: 'ja-JP', name: '日本語' },
    { code: 'tr-TR', name: 'Türkçe' }
  ]
  
  const handleLanguageChange = (newLang) => {
    changeLang(newLang)
    // 更新 URL 参数，保持当前页面
    const query = { ...router.query, lang: newLang }
    router.push({ pathname: router.pathname, query })
  }
  
  return (
    <div className="mx-2">
      <select
        value={lang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="px-2 py-1 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSwitcher
