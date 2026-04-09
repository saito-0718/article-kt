import { useState, useEffect, useRef } from 'react'

export default function ThreeDotsMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="threedots-wrapper" ref={menuRef}>
      <button
        className="threedots-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="メニューを開く"
      >
        <span className="threedots-dot" />
        <span className="threedots-dot" />
        <span className="threedots-dot" />
      </button>
      {open && (
        <ul className="threedots-dropdown">
          <li>
            <button onClick={() => { setOpen(false); onEdit() }}>編集</button>
          </li>
          <li>
            <button className="threedots-delete" onClick={() => { setOpen(false); onDelete() }}>削除</button>
          </li>
        </ul>
      )}
    </div>
  )
}
