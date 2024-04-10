import { Checkbox, Input, Select } from '@chakra-ui/react'
import { ContextInterface, MyContext } from '@renderer/App'
import { useContext, useState } from 'react'

export const TsSigner = (): JSX.Element => {
  const { wallets, currentWallet } = useContext<ContextInterface>(MyContext)
  const [walletMemo, setWalletMemo] = useState(false)
  const [memo, setMemo] = useState('')
  return (
    <>
      <p>Memo:</p>
      <Input
        value={walletMemo ? currentWallet?.publicKey : memo}
        // isDisabled={walletMemo}
        onChange={(e) => setMemo(e.target.value)}
        name="memo"
      />
      <p className="flex items-center gap-2">
        Use wallet memo <Checkbox onChange={(e) => setWalletMemo(e.target.checked)} />
      </p>
      {currentWallet.tnam && (
        <>
          <p>Signing keys:</p>
          <Select name="signing-keys">
            {wallets.map((post) => (
              <option key={post.alias}>{post.alias}</option>
            ))}
          </Select>{' '}
        </>
      )}

      <p>Gas Payer:</p>
      <Select name="gas-payer">
        {wallets.map((post) => (
          <option key={post.alias}>{post.alias}</option>
        ))}
      </Select>
    </>
  )
}

export const Source = (): JSX.Element => {
  const { wallets, currentWallet } = useContext<ContextInterface>(MyContext)

  return (
    <>
      <p>Memo:</p>
      <Input name="memo" />

      <p>Signing keys:</p>
      <Select name="signing-keys">
        {wallets.map((post) => (
          <option key={post.alias}>{post.alias}</option>
        ))}
      </Select>
      <p>Gas Payer:</p>
      <Select name="gas-payer">
        {wallets.map((post) => (
          <option key={post.alias}>{post.alias}</option>
        ))}
      </Select>
    </>
  )
}
