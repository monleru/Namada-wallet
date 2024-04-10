import { useLocation } from 'react-router-dom'
import { Card, Button, Select } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { decodeBase64ToString } from './tx'
import axios from 'axios'
import { useEffect, useState } from 'react'
import img from '../../assets/Nam Token Yello_Black.png'

interface TxDecoded {
  uuid: string
  type: string
}

export const GetWallets = ({ wallets, shieldedWallets }: any): JSX.Element => {
  console.log(wallets)
  const [loader, setLoader] = useState(false)
  const [select, setSelect] = useState<null | string>(JSON.stringify(wallets[0]))
  console.log(select)
  const txData = useLocation().pathname.split('/').pop()
  console.log(txData)
  const decodedString: TxDecoded = JSON.parse(decodeBase64ToString(txData))
  console.log('Decoded:', decodedString) // Вывод декодированной строки

  return (
    <div className="w-full h-full bg-[#f1f0ee]">
      <div className="h-20 w-full flex items-center p-2 bg-[#131b33] text-white p-4 gap-4">
        <div>
          <img width={30} src={img} alt="img" />
        </div>
        <div>
          <p>Signing Request:</p>
          <p>An incomming signing request has been triggered:</p>
        </div>
      </div>
      <div className="flex mt-4 w-full gap-2 p-2">
        <Card className="w-3/4 p-4 w-full overflow-y">
          <p className="font-bold text-2xl">Login</p>
          <Select onChange={(e) => setSelect(e.target.value)}>
            {wallets.map((post) => (
              <option value={JSON.stringify(post)} key={post.alias}>
                {post.alias}
              </option>
            ))}
            {shieldedWallets?.map((post) => (
              <option value={JSON.stringify(post)} key={post.alias}>
                {post.alias}
              </option>
            ))}
          </Select>
        </Card>
      </div>
      <Card className="!fixed bottom-0 left-0 w-full h-20 p-4 flex items-center !flex-row justify-between">
        <Button onClick={window.close} className="flex gap-5">
          <CloseIcon /> Cancel
        </Button>
        <Button
          onClick={async () => {
            await axios.post(`http://49.13.93.221:3333/${decodedString.uuid}`, {
              data: select
            })
            window.close()
          }}
          colorScheme="green"
        >
          Login
        </Button>
      </Card>
    </div>
  )
}
