import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import img from '../assets/Nam Token Yello_Black.png'
import './style.css'
export const LeftBar = (): JSX.Element => {
  const links = [
    {
      name: 'Home',
      href: '/home'
    },
    {
      name: 'Wallet',
      href: '/wallet'
    },
    {
      name: 'Governance',
      href: '/governance'
    },
    {
      name: 'Staking',
      href: '/staking'
    },
    {
      name: 'Shielded Sync',
      href: '/shield'
    }
  ]
  return (
    <div className="w-1/4 h-full bg-[#131b33] text-white">
      <div className="p-2 flex items-center justify-center font-medium mt-2 gap-2">
        <img width={30} src={img} alt="img" />
        Namada Wallet
      </div>
      <div className="flex flex-col mt-2">
        {links.map((post) => (
          <NavLink className="hover:bg-black p-2" to={post.href} key={post.name}>
            {post.name}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
