import { useMemo, useRef, useState } from 'react'
import { LessonCanvas } from '../components/LessonCanvas'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Experiment } from '../components/Experiment'
import { Icon } from '../components/Icon'
import { categories, categoryPath } from '../units'
import type { Unit } from '../units/types'

const stages = [
  { title: '認識', caption: '先理解原理' },
  { title: '經典範例', caption: '逐步觀察' },
  { title: '自由練習', caption: '用自己的資料' },
] as const

function Introduction({ unit }: { unit: Unit })
{
  const [index, setIndex] = useState(0)
  const card = unit.cards[index]
  const timelines = useMemo(() => unit.examples.map(example => unit.run(example.input)), [unit])
  const steps = timelines[card.example ?? 0]
  const step = (card.show && steps.find(card.show)) || steps[0]
  return (
    <section className="intro-panel panel" aria-label="認識演算法">
      <div className="intro-copy">
        <p className="eyebrow mono">CONCEPT {String(index + 1).padStart(2, '0')} / {String(unit.cards.length).padStart(2, '0')}</p>
        <div aria-live="polite">
          <h2>{card.title}</h2>
          <p>{card.text}</p>
        </div>
        <div className="intro-control">
          <button className="icon-button" aria-label="上一張介紹卡" type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}><Icon name="back" /></button>
          <div className="card-dots" role="group" aria-label="選擇介紹卡">
            {unit.cards.map((item, position) => <button key={item.title} type="button" aria-pressed={index === position}
              aria-label={`第 ${position + 1} 張：${item.title}`} onClick={() => setIndex(position)}><span /></button>)}
          </div>
          <button className="icon-button" aria-label="下一張介紹卡" type="button" disabled={index === unit.cards.length - 1} onClick={() => setIndex(index + 1)}><Icon name="arrow" /></button>
        </div>
      </div>
      <LessonCanvas view={step.view} labels={unit.variables} />
    </section>
  )
}

export function UnitPage({ unit }: { unit: Unit })
{
  const [stage, setStage] = useState(0)
  const [example, setExample] = useState(0)
  const stageButtons = useRef<(HTMLButtonElement | null)[]>([])
  const category = categories[unit.category]

  function goToStage(index: number)
  {
    setStage(index)
    stageButtons.current[index]?.focus()
  }

  return (
    <div className="page inner-page unit-page">
      <Breadcrumbs current={unit.name} parent={{ label: category.name, href: categoryPath(unit.category) }} />
      <header className="unit-heading">
        <div>
          <p className="eyebrow mono"><span className="signal-dot" /> {unit.english.toUpperCase()}</p>
          <h1>{unit.name}</h1>
          <p>{unit.goal}</p>
        </div>
        <div className="unit-meta">
          <span className="tag">{unit.structure}</span>
          <span className="tag mono">{unit.complexity}</span>
        </div>
      </header>
      <p className="prerequisite"><Icon name="info" width={17} height={17} /><span>{unit.prerequisite}</span></p>
      <nav className="stage-nav" aria-label="學習段落">
        {stages.map((item, index) => (
          <button className="stage" type="button" key={item.title} aria-current={stage === index ? 'step' : undefined}
            ref={node =>
            {
              stageButtons.current[index] = node
            }}
            onClick={() => setStage(index)}>
            <span className="stage-number mono">0{index + 1}</span>
            <span><strong>{item.title}</strong><small>{item.caption}</small></span>
          </button>
        ))}
      </nav>
      <div hidden={stage !== 0}><Introduction unit={unit} /></div>
      <section className="stage-body" hidden={stage !== 1} aria-label="經典範例">
        <div className="examples-bar">
          <span className="eyebrow mono">EXAMPLE</span>
          <div className="example-options" role="group" aria-label="選擇範例">
            {unit.examples.map((item, index) => (
              <button className="button small" type="button" key={item.label} aria-pressed={index === example}
                onClick={() => setExample(index)}>{item.label}</button>
            ))}
          </div>
        </div>
        {unit.examples.map((item, index) => <Experiment unit={unit} initial={item.input} key={item.label} active={stage === 1 && example === index} />)}
      </section>
      <section className="stage-body" hidden={stage !== 2} aria-label="自由練習">
        <Experiment unit={unit} initial={unit.practice} practice active={stage === 2} />
      </section>
      <nav className="stage-footer" aria-label="上一段與下一段">
        {stage > 0 && <button className="button" type="button" onClick={() => goToStage(stage - 1)}><Icon name="back" />{stages[stage - 1].title}</button>}
        {stage < stages.length - 1 && <button className="button primary stage-forward" type="button"
          onClick={() => goToStage(stage + 1)}>{stages[stage + 1].title}<Icon name="arrow" /></button>}
      </nav>
    </div>
  )
}
