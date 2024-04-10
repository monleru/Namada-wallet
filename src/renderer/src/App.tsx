import { LeftBar } from './components/left-bar'
import { Header } from './components/header'
import { Home } from './pages/home/home'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { ShiedSync } from './pages/shield-sync/sheild.sync'
import { createContext, useEffect, useState } from 'react'
import { Wallet } from './pages/wallet/wallet'
import { extractShield, getWallets } from './utils/get-wallets'
import { Create } from './pages/create/create'
import { Login } from './pages/create/login'
import { TX } from './pages/tx/tx'
import { GetWallets } from './pages/tx/login'
import { Toast } from './components/toasts'
import { Governance } from './pages/governance/governance'
import { Staking } from './pages/staking/staking'
export const MyContext = createContext()
export interface Wallets {
  alias: string
  publicKey: string
  publicKeyHash: string
  tnam: string
  balance?: Token[]
}

interface Token {
  name: string
  amount: string
}
export interface ShieldedWallets {
  alias: string
  znam: string
}
export interface ContextInterface {
  wallets: Wallets[]
  setWallets: (wallets: Wallets[]) => void
  currentWallet: Wallets
  setCurrentWallet: (wallets: Wallets) => void
  node: string
  shieldedWallets: ShieldedWallets[]
  changeNode: (node: string) => void
}
function App(): JSX.Element {
  const location = useLocation().pathname

  const [wallets, setWallets_] = useState<Wallets[]>([])
  const [shieldedWallets, setShieldedWallet] = useState<ShieldedWallets[]>([])
  const [currentWallet, setCurrentWallet_] = useState<null | Wallets>({})
  const [isCreated, setIsCreated] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [node, setNode] = useState('')
  console.log(wallets, shieldedWallets)
  const setWallets = (data: Wallets[]): void => {
    setWallets_(data)
  }
  const setCurrentWallet = (data: Wallets): void => {
    if (data) {
      getBalance(data)
    }
  }
  useEffect(() => {
    getWallets().then((data: Wallets[]) => {
      setWallets(data)
      setCurrentWallet(data[0])
    })
    window.electron.ipcRenderer.invoke('check-password').then((data) => setIsCreated(data))
    window.electron.ipcRenderer.invoke('is-login').then((data) => setIsLogin(data))
    window.electron.ipcRenderer.invoke('get-node').then((data) => setNode(data))
    window.electron.ipcRenderer
      .invoke('get-shielded-wallets')
      .then((data) => setShieldedWallet(extractShield(data)))
    window.electron.ipcRenderer.on('logout', () => {
      setIsLogin(false)
    })
    window.electron.ipcRenderer.on('login', () => {
      setIsLogin(true)
    })

    window.electron.ipcRenderer.on('registred', () => {
      setIsCreated(true)
    })
  }, [])
  const getBalance = async (currentWallet__: Wallets): void => {
    setCurrentWallet_({ ...currentWallet__ })
    window.electron.ipcRenderer
      .invoke('get-balance', currentWallet__.alias)
      .then((data) => {
        const array: Token[] = []
        const balances = data.split('\n').filter((element) => element !== '')
        console.log(balances)
        balances.forEach((element) => {
          const balance = element.split(':')
          if (balance[0].length < 10) {
            array.push({
              name: balance[0].replace(' ', ''),
              amount: balance[1]
            })
          }
        })
        if (!array.length) {
          array.push({ name: 'nam', amount: '0' })
        }
        setCurrentWallet_({ ...currentWallet__, balance: array })
      })
      .catch(() => {
        console.log(currentWallet__)

        setCurrentWallet_({ ...currentWallet__, balance: [{ name: 'nam', amount: '0' }] })
      })
  }
  const changeNode = (data: string): void => {
    window.electron.ipcRenderer.invoke('set-node', data)
    setNode(data)
  }
  const sharedState = {
    wallets,
    setWallets,
    setCurrentWallet,
    currentWallet,
    node,
    changeNode,
    shieldedWallets
  }
  const navigate = useNavigate()
  useEffect(() => {
    window.electron.ipcRenderer.on('login-window', (e, data) => {
      navigate('/login/' + data)
    })
    window.electron.ipcRenderer.on('tx-window', (e, data) => {
      navigate('/tx/' + data)
    })
  }, [])
  if (!isCreated) return <Create />
  if (!isLogin) return <Login />
  if (location.includes('tx')) return <TX />
  if (location.includes('login'))
    return <GetWallets shieldedWallets={shieldedWallets} wallets={wallets} />

  return (
    <MyContext.Provider value={sharedState}>
      <Toast />
      <div className="flex h-full w-full">
        <LeftBar />
        <div className="w-full">
          <Header />
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/shield" element={<ShiedSync />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/governance" element={<Governance />} />{' '}
            <Route path="/staking" element={<Staking />} />
          </Routes>
        </div>
      </div>
    </MyContext.Provider>
  )
}
export default App
