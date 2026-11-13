import { Breadcrumbs } from '../components/Breadcrumbs'
import { Icon } from '../components/Icon'
import { categories, unitPath, units } from '../units'
import type { Category } from '../units/types'

export function CategoryPage({ category }: { category: Category })
{
  const topic = categories[category]
  const lessons = units.filter(unit => unit.category === category)
  return (
    <div className="page inner-page">
      <Breadcrumbs current={topic.name} />
      <header className={`category-heading ${category}`}>
        <span className={`topic-icon ${category === 'sorting' ? 'mint' : 'purple'}`}><Icon name={category === 'sorting' ? 'sort' : 'search'} /></span>
        <p className="eyebrow mono">{topic.number} / {topic.english.toUpperCase()}</p>
        <h1>{topic.name}</h1>
        <p>{topic.description}</p>
      </header>
      <section className="lesson-list" aria-labelledby="lessons-title">
        <div className="section-heading"><div><p className="eyebrow mono">LESSONS</p><h2 id="lessons-title">單元列表</h2></div></div>
        {lessons.map((unit, index) => (
          <a className="lesson-card panel" href={unitPath(unit)} key={unit.slug}>
            <span className="lesson-number mono">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <span className="eyebrow mono">{unit.english.toUpperCase()}</span>
              <h3>{unit.name}</h3>
              <p>{unit.goal}</p>
              <span className="tag">{unit.structure}</span>
            </div>
            <span className="topic-arrow"><Icon name="arrow" /></span>
          </a>
        ))}
      </section>
    </div>
  )
}
