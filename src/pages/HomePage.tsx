import { Icon } from '../components/Icon'
import { categories, categoryPath, unitPath, units } from '../units'
import type { Category } from '../units/types'

const topics: readonly Category[] = ['sorting', 'searching']

function HeroIllustration()
{
  const values = [3, 5, 8, 3, 1]
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="visual-meta mono"><span><i /> LAB SNAPSHOT</span><span>FIG. 01</span></div>
      <div className="visual-screen">
        <div className="visual-caption"><span>氣泡排序</span><span className="tag mono">陣列 [5]</span></div>
        <div className="hero-chart">
          {values.map((value, index) => (
            <div className={`hero-column${index === 1 || index === 2 ? ' selected' : ''}`} key={index}>
              <div className="hero-bar" style={{ height: `${26 + value * 14}px` }}><span className="mono">{value}</span></div>
              <span className="mono hero-index">{index}</span>
            </div>
          ))}
        </div>
        <div className="visual-message"><span className="signal-dot" /><strong>比較相鄰元素</strong><code>5 &lt; 8</code></div>
      </div>
      <div className="visual-footer mono"><span>ARRAY / INDEX 0–4</span><span>BUBBLE SORT</span></div>
    </div>
  )
}

export function HomePage()
{
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow mono"><span className="signal-dot" /> INTERACTIVE ALGORITHM LAB</p>
          <h1>演算法，<br />一步一步<span>看懂。</span></h1>
          <p className="hero-description">看資料如何移動、搜尋如何選擇下一個位置，以及程式下一行要做什麼。從經典範例出發，再換上自己的資料試一次。</p>
          <a className="button primary hero-button" href={unitPath(units[0])}>從氣泡排序開始 <Icon name="arrow" /></a>
          <p className="hero-flow"><span>01 認識</span><Icon name="chevron" /><span>02 經典範例</span><Icon name="chevron" /><span>03 自由練習</span></p>
        </div>
        <HeroIllustration />
      </section>
      <section className="topic-section" aria-labelledby="topics-title">
        <div className="section-heading">
          <div><p className="eyebrow mono">THE UNITS</p><h2 id="topics-title">選擇學習主題</h2></div>
          <span className="section-count mono">02 類別 <b>/</b> {String(units.length).padStart(2, '0')} 單元</span>
        </div>
        <div className="topic-grid">
          {topics.map(category =>
          {
            const topic = categories[category]
            return (
              <a className={`topic-card ${category}`} href={categoryPath(category)} key={category}>
                <div className="topic-top">
                  <span className={`topic-icon ${category === 'sorting' ? 'mint' : 'purple'}`}><Icon name={category === 'sorting' ? 'sort' : 'search'} /></span>
                  <span className="topic-number mono">{topic.number} / {topic.english.toUpperCase()}</span>
                  <span className="topic-arrow"><Icon name="arrow" /></span>
                </div>
                <h3>{topic.name}</h3>
                <p>{topic.description}</p>
                <div className="topic-tags">{units.filter(unit => unit.category === category).map(unit => <span className="tag" key={unit.slug}>{unit.name}</span>)}</div>
              </a>
            )
          })}
        </div>
      </section>
    </div>
  )
}
