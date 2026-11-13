export function Breadcrumbs({ current, parent }: { current: string; parent?: { label: string; href: string } })
{
  return (
    <nav className="breadcrumbs" aria-label="目前位置">
      <a href="#/">首頁</a>
      <span aria-hidden="true">/</span>
      {parent && <><a href={parent.href}>{parent.label}</a><span aria-hidden="true">/</span></>}
      <span aria-current="page">{current}</span>
    </nav>
  )
}
