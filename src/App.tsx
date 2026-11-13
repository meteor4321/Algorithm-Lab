import { useLayoutEffect, useSyncExternalStore } from 'react'
import { CategoryPage } from './pages/CategoryPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { UnitPage } from './pages/UnitPage'
import { categories, categoryPath, unitPath, units } from './units'

function subscribe(listener: () => void)
{
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}

function currentPath()
{
  return window.location.hash.slice(1) || '/'
}

export function App()
{
  const path = useSyncExternalStore(subscribe, currentPath)
  const unit = units.find(item => `#${path}` === unitPath(item))
  const section = path.slice(1)
  const category = section === 'sorting' || section === 'searching' ? section : undefined
  const activeCategory = unit?.category ?? category
  const title = unit?.name ?? (category && categories[category].name)

  useLayoutEffect(() =>
  {
    document.title = title ? `${title} · 演算法實驗室` : '演算法實驗室'
    window.scrollTo(0, 0)
  }, [path, title])

  return (
    <div className="site">
      <a className="skip-link" href="#main-content" onClick={event =>
      {
        event.preventDefault()
        document.getElementById('main-content')?.focus()
      }}>跳到主要內容</a>
      <header className="site-header">
        <div className="header-content">
          <a className="wordmark" href="#/" aria-label="演算法實驗室首頁">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
            <span>演算法實驗室 <small className="mono">ALGORITHM LAB</small></span>
          </a>
          <nav className="site-nav" aria-label="主要導覽">
            <a href="#/" aria-current={path === '/' ? 'page' : undefined}>首頁</a>
            <a href={categoryPath('sorting')} aria-current={activeCategory === 'sorting' ? 'location' : undefined}>排序</a>
            <a href={categoryPath('searching')} aria-current={activeCategory === 'searching' ? 'location' : undefined}>搜尋</a>
          </nav>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        {path === '/' ? <HomePage /> : unit ? <UnitPage key={unit.slug} unit={unit} /> : category
          ? <CategoryPage category={category} /> : <NotFoundPage />}
      </main>
      <footer className="site-footer"><div><span>演算法實驗室</span><span className="mono">ALGORITHM LAB <b>·</b> 互動式學習教材</span></div></footer>
    </div>
  )
}
