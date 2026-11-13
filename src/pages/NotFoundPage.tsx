import { Icon } from '../components/Icon'

export function NotFoundPage()
{
  return <div className="page inner-page not-found">
    <p className="eyebrow mono">404 / LESSON NOT FOUND</p>
    <h1>找不到這個單元</h1>
    <p>可以從首頁挑選現有的排序與搜尋教材。</p>
    <a className="button primary" href="#/"><Icon name="back" />回到首頁</a>
  </div>
}
