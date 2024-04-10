import { useLocation } from 'react-router-dom'
import { Card, Button, Input } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import img from '../../assets/Nam Token Yello_Black.png'

export function encodeStringToBase64(str) {
  return btoa(str)
}
interface TxDecoded {
  uuid: string
  type: string
  formDataObject: any
  wallet: string
  browser?: boolean
}
export function decodeBase64ToString(encodedStr) {
  return atob(encodedStr)
}
export const TX = (): JSX.Element => {
  const txData = useLocation().pathname.split('/').pop()
  const [isDisabled, setIsDisabled] = useState(false)
  console.log(txData)
  const decodedString: TxDecoded = JSON.parse(decodeBase64ToString(txData))
  console.log('Decoded:', decodedString)

  return (
    <div className="w-full h-full bg-[#f1f0ee]">
      <div className="h-20 flex items-center p-2 bg-[#131b33] text-white p-4 gap-4">
        <div>
          <img width={30} src={img} alt="img" />
        </div>
        <div>
          <p>Signing Request:</p>
          <p>An incomming signing request has been triggered:</p>
        </div>
      </div>
      <div style={{ height: '60vh' }} className="flex mt-4 gap-2 p-2 overflow-y-auto h-200">
        <Card className="w-1/4 p-2">Wallet: {decodedString.wallet}</Card>
        <Card className="w-3/4 p-4 overflow-y-auto h-200">
          <p className="font-bold text-2xl">Action Perform</p>
          <p>Type: {decodedString.type}</p>
          {Object?.keys(decodedString.formDataObject)?.map((key) => (
            <p key={key}>
              <p className="font-bold text-xl">{key}:</p>{' '}
              <Input
                className="!color-black"
                isDisabled={true}
                value={decodedString.formDataObject[key]}
              />
            </p>
          ))}
        </Card>
      </div>

      <div className="p-2">
        <Card className="!fixed bottom-0 left-0 w-full h-20 p-4 flex items-center !flex-row justify-between">
          <Button onClick={window.close} className="flex gap-5">
            <CloseIcon /> Cancel
          </Button>
          <Button
            onClick={() => {
              setIsDisabled(true)
              const changed = ['source', 'signing-keys', 'gas-payer']
              for (const change of changed) {
                if (change in decodedString.formDataObject) {
                  decodedString.formDataObject[change] =
                    'hook-' + decodedString.formDataObject[change]
                }
              }
              window.electron.ipcRenderer.invoke(
                'namadac',
                `${decodedString.type} ${Object.keys(decodedString.formDataObject)
                  .map((key) => `--${key} ${decodedString.formDataObject[key]}`)
                  .join(' ')}`,
                decodedString.uuid
              )
              window.close()
            }}
            colorScheme="green"
            isDisabled={isDisabled}
          >
            Send Transaction
          </Button>
        </Card>
      </div>
    </div>
  )
}

export function removeEmptyKeys(obj) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      delete obj[key]
    }
  })

  return obj
}
