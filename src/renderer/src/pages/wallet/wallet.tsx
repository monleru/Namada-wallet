import { Spinner } from '@chakra-ui/react'
import { Stat, StatNumber, StatHelpText, StatArrow, StatGroup } from '@chakra-ui/react'
import { ContextInterface, MyContext } from '@renderer/App'
import { IBCTransfer } from '@renderer/actions/ibc-transfer'
import { Transfer } from '@renderer/actions/transfer'
import { useContext, useEffect, useState } from 'react'

export const Wallet = (): JSX.Element => {
  const { wallets, currentWallet } = useContext<ContextInterface>(MyContext)
  const [balance, setBalance] = useState(null)
  useEffect(() => {
    setBalance(
      currentWallet?.balance?.length
        ? currentWallet.balance.find((post) => post.name === 'nam')?.amount
        : null
    )
  }, [currentWallet?.balance])
  if (!wallets.length) return null
  return (
    <div className="bg-[#f1f0ee] h-full p-4">
      <StatGroup>
        <Stat>
          <StatNumber>{balance === null ? <Spinner /> : balance} NAM</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.36%
          </StatHelpText>
        </Stat>
      </StatGroup>
      {Object.keys(currentWallet).map((post) => {
        if (typeof currentWallet[post] === 'string') {
          return (
            <p key={post}>
              <span className="font-bold text-xl">{post}</span>: {String(currentWallet[post])}
            </p>
          )
        }
        return null
      })}
      <div className="flex flex-col gap-2 mt-4">
        <Transfer />
        <IBCTransfer />
      </div>
    </div>
  )
}
