import { useState, useEffect, useRef } from 'react'

export default function HamburgerMenu({ onNavigate }) {
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

  const handleLink = (page) => {
    setOpen(false)
    onNavigate(page)
  }

  return (
    <div className="hamburger-wrapper" ref={menuRef}>
      <button
        className="hamburger-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="メニューを開く"
      >
        <span className="hamburger-bar" />
        <span className="hamburger-bar" />
        <span className="hamburger-bar" />
      </button>
      {open && (
        <ul className="hamburger-dropdown">
          <li>
            <button onClick={() => handleLink('login')}>ログイン</button>
          </li>
          <li>
            <button onClick={() => handleLink('register')}>ユーザー登録</button>
          </li>
        </ul>
      )}
    </div>
  )
}
