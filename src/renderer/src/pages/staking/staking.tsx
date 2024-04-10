import {
  Button,
  Spinner,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatNumber
} from '@chakra-ui/react'
import { ContextInterface, MyContext } from '@renderer/App'
import { Bond } from '@renderer/actions/bond'
import { ClaimRewards } from '@renderer/actions/claim-reward'
import { Unbond } from '@renderer/actions/unbond'
import { Withdraw } from '@renderer/actions/withdraw'
import { useContext, useEffect, useState } from 'react'

export const Staking = (): JSX.Element => {
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
      <div className="flex items-start justify-between">
        <StatGroup>
          <Stat>
            <StatNumber>{balance === null ? <Spinner /> : balance} NAM</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36%
            </StatHelpText>
          </Stat>
        </StatGroup>
        <StatGroup>
          <Stat>
            <StatNumber>{balance === null ? <Spinner /> : 0} Bonded</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36%
            </StatHelpText>
          </Stat>
        </StatGroup>
        <StatGroup>
          <Stat>
            <StatNumber>{balance === null ? <Spinner /> : 0} Withdraw available</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36%
            </StatHelpText>
          </Stat>
        </StatGroup>
        <StatGroup>
          <Stat>
            <StatNumber>{balance === null ? <Spinner /> : 0} Rewards</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36%
            </StatHelpText>
          </Stat>
        </StatGroup>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <Bond />
        <Unbond />
        <Withdraw />
        <ClaimRewards />
      </div>
    </div>
  )
}
