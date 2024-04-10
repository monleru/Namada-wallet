import { ShieldedWallets } from '@renderer/App'

export const getWallets = async () => {
  const data = await window.electron.ipcRenderer.invoke('get-wallets', 'transparent')
  const aliases = []

  const regex =
    /Alias "(.+?)" \(encrypted\):\s+Public key hash:\s+([A-F0-9]+)\s+Public key:\s+(tpknam1[^\s]+)/g
  let match
  while ((match = regex.exec(data)) !== null) {
    const alias = match[1]
    const publicKeyHash = match[2]
    const publicKey = match[3]
    if (alias.includes('hook-')) {
      aliases.push({ alias, publicKey, publicKeyHash, tnam: '' })
    }
  }

  const addressesData = data.split('Known transparent addresses:')[1]
  const addressesRegex = /"([^"]+)":\s+Implicit:\s+(tnam1[^\s]+)/g
  let addressMatch
  const addresses = {}
  while ((addressMatch = addressesRegex.exec(addressesData)) !== null) {
    const walletName = addressMatch[1]
    const address = addressMatch[2]
    addresses[walletName] = address
  }

  aliases.forEach((alias) => {
    alias.tnam = addresses[alias.alias]
  })

  aliases.forEach((post) => (post.alias = removeHookPrefix(post.alias)))
  return aliases
}

export const extractShield = (data) => {
  const parts = data.split('Known payment addresses:')
  const addressesPart = parts[1]
  const wallets = {}

  const addressRegex = /"hook-(.*?)-addr": (\w+)/g

  let match
  while ((match = addressRegex.exec(addressesPart)) !== null) {
    const walletName = match[1]
    const address = match[2]
    wallets[walletName] = address
  }
  const data_: ShieldedWallets[] = []

  Object.keys(wallets).map((post) => {
    data_.push({
      alias: post,
      znam: wallets[post]
    })
  })
  return data_
}

function removeHookPrefix(str) {
  if (str.startsWith('hook-')) {
    return str.slice(5)
  } else {
    return str
  }
}
