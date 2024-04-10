import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { spawn } from 'child_process'
import fs from 'fs'
import bcrypt from 'bcryptjs'
import axios from 'axios'

const homeDir = require('os').homedir()

let bin
let configPath
// eslint-disable-next-line prettier/prettier
const dirPath = path.join(homeDir, `/Library/Application\ Support/namada/`)
const passwordPath = path.join(homeDir, '/Library/Application Support/namada/password')

if (process.env.NODE_ENV === 'development') {
  bin = path.join(process.cwd(), 'resources', 'bin', 'namada')
  configPath = path.join(process.cwd(), 'resources', 'luminara.45fd94fb5c14d0dd304da')
} else {
  const resourcesPath = `${app.getAppPath()}.unpacked`
  bin = path.join(resourcesPath, 'resources', 'bin', 'namada')
  configPath = path.join(resourcesPath, 'resources', 'luminara.45fd94fb5c14d0dd304da')
}

let mainWindow
let loginPassword
let node = 'http://49.13.93.221:26657'

function copyFolderRecursiveSync(source, destination): void {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true })
  }

  const files = fs.readdirSync(source)
  files.forEach((file) => {
    const currentSource = path.join(source, file)
    const currentDestination = path.join(destination, file)
    if (fs.lstatSync(currentSource).isDirectory()) {
      copyFolderRecursiveSync(currentSource, currentDestination)
    } else {
      fs.copyFileSync(currentSource, currentDestination)
    }
  })
}

function ensureFolderExistsAndCopy(sourceFolder, destinationFolder) {
  if (!fs.existsSync(destinationFolder)) {
    copyFolderRecursiveSync(sourceFolder, destinationFolder)
    console.log(`folder copied: ${sourceFolder} -> ${destinationFolder}`)
  } else {
    console.log(`Folder already exist: ${destinationFolder}`)
  }
}

const sourceFolder = path.join(configPath)
const destinationFolder = path.join(
  homeDir,
  'Library',
  'Application Support',
  'namada',
  'luminara.45fd94fb5c14d0dd304da'
)

ensureFolderExistsAndCopy(sourceFolder, destinationFolder)

function createWindow(): void {
  // Create the browser window.
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
const createTransctionWindow = (data: string): void => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  const windowTrans = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  windowTrans.on('ready-to-show', () => {
    windowTrans.show()
    windowTrans.webContents.send('tx-window', data)
  })

  windowTrans.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    windowTrans.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    windowTrans.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
const createLoginWindow = (data: string): void => {
  const windowTrans = new BrowserWindow({
    width: 600,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  windowTrans.on('ready-to-show', () => {
    windowTrans.show()
    windowTrans.webContents.send('login-window', data)
  })

  windowTrans.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    windowTrans.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    windowTrans.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
const baseArgs = ['--base-dir', dirPath, '--chain-id', 'luminara.45fd94fb5c14d0dd304da']
const getBalance = async (wallet: string) => {
  return new Promise((resolve, reject) => {
    const args = [...baseArgs, 'balance', '--owner', `hook-${wallet}`]
    args.push('--node', node)
    console.log(args.join(' '))
    const childProcess = spawn(`${bin}c`, args)

    let result = ''

    childProcess.stdout.on('data', (data) => {
      result += data.toString()
    })

    childProcess.stderr.on('data', (data) => {
      console.error(`Ошибка: ${data}`)
      reject(data.toString())
    })

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(result)
      } else {
        reject(`Процесс завершился с кодом ${code}`)
      }
    })
  })
}
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Check first login
  ipcMain.handle('check-password', async () => {
    return new Promise((resolve) => {
      fs.access(passwordPath, fs.constants.F_OK, (err) => {
        if (err) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  })

  // Create password
  ipcMain.handle('create-password', async (event, password: string) => {
    return new Promise((resolve) => {
      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(password, salt)
      fs.writeFile(passwordPath, hashedPassword, (err) => {
        if (err) {
          resolve(err)
        } else {
          mainWindow.webContents.send('registred')
          resolve(true)
        }
      })
    })
  })

  //Is user logined
  ipcMain.handle('is-login', () => {
    if (loginPassword) return true
  })

  // Get RPC from app
  ipcMain.handle('get-node', () => {
    return node
  })

  //change RPC
  ipcMain.handle('set-node', (event, node_) => {
    node = node_
  })

  // verify-password
  ipcMain.handle('verify-password', async (event, password: string) => {
    return new Promise((resolve) => {
      fs.readFile(passwordPath, 'utf-8', (err, data) => {
        if (err) {
          resolve(false)
        } else {
          const passwordMatches = bcrypt.compareSync(password, data)
          if (passwordMatches) {
            resolve(true)
            loginPassword = password
            mainWindow.webContents.send('login')

            setTimeout(() => {
              mainWindow.webContents.send('logout')
              loginPassword = null
            }, 6000000)
          } else {
            resolve(false)
          }

          resolve(true)
        }
      })
    })
  })

  ipcMain.handle('transaction-window', async (event, data) => {
    createTransctionWindow(data)
  })

  ipcMain.handle('create-wallet', async (event, type, wallet) => {
    const data = []
    await namadaGenWallet(wallet).then((data_) => data.push(data_))
    await namadaGenSheildWallet(wallet).then((data_) => data.push(data_))
    await namadaGenSheildPayment(wallet).then((data_) => data.push(data_))
    return data
  })

  ipcMain.handle('namada', async (event, data: string) => {
    const env = Object.create(process.env)
    env.NAMADA_WALLET_PASSWORD = loginPassword

    return new Promise((resolve, reject) => {
      const args = [...baseArgs, ...data.split(' ')]
      const childProcess = spawn(bin, args, { env })

      let result = ''

      childProcess.stdout.on('data', (data) => {
        result += data.toString()
      })

      childProcess.stderr.on('data', (data) => {
        console.error(`Ошибка: ${data}`)
        reject(data.toString())
      })

      childProcess.on('close', (code) => {
        if (code === 0) {
          resolve(result)
        } else {
          reject(`Error ${code}`)
        }
      })
    })
  })

  ipcMain.handle('namadac', async (event, data: string, uuid: string) => {
    const env = Object.create(process.env)
    env.NAMADA_WALLET_PASSWORD = loginPassword

    return new Promise((resolve, reject) => {
      const args = [...baseArgs, ...data.split(' ')]
      args.push('--node', node)
      console.log(`${bin}c`, args.join(' '))
      const childProcess = spawn(`${bin}c`, args, { env })
      mainWindow.webContents.send('pending')

      let result = ''

      childProcess.stdout.on('data', (data) => {
        console.log(data.toString())
        result += data.toString()
      })

      childProcess.stderr.on('data', (data) => {
        reject(data.toString())
      })

      childProcess.on('close', (code) => {
        if (code === 0) {
          console.log(result)
          const wrapperTxRegExp = /Wrapper transaction hash:\s*([A-Fa-f0-9]{64})/
          const innerTxRegExp = /Inner transaction hash:\s*([A-Fa-f0-9]{64})/

          // get Hashes
          const wrapperTxMatches = String(result).match(wrapperTxRegExp)
          const innerTxMatches = String(result).match(innerTxRegExp)
          const wrapperTxHash = wrapperTxMatches[1]
          const innerTxHash = innerTxMatches[1]

          mainWindow.webContents.send(
            'success',
            `Wrapper Hash: ${wrapperTxHash}
          TX Hash: ${innerTxHash}`
          )
          if (uuid) {
            axios.post(`http://49.13.93.221:3333/${uuid}`, {
              wrapperTxHash,
              innerTxHash
            })
          }
          resolve(`Wrapper Hash: ${wrapperTxHash}
          TX Hash: ${innerTxHash}`)
        } else {
          mainWindow.webContents.send('reject', data.toString())
          reject(`Error: ${code}`)
        }
      })
    })
  })
  ipcMain.handle('get-wallets', async (event, config) => {
    return new Promise((resolve, reject) => {
      const args = [...baseArgs, 'wallet', 'list', `--${config}`]
      const childProcess = spawn(bin, args)

      let result = ''

      childProcess.stdout.on('data', (data) => {
        result += data.toString()
      })

      childProcess.stderr.on('data', (data) => {
        console.error(`Ошибка: ${data}`)
        reject(data.toString())
      })

      childProcess.on('close', (code) => {
        if (code === 0) {
          resolve(result)
        } else {
          reject(`Процесс завершился с кодом ${code}`)
        }
      })
    })
  })

  ipcMain.handle('get-path', () => {
    const resourcesPath = app.getAppPath()
    return resourcesPath
  })

  ipcMain.handle('get-balance', async (event, wallet) => {
    return await getBalance(wallet)
  })

  ipcMain.handle('get-shielded-wallets', async () => {
    return new Promise((resolve, reject) => {
      const args = [...baseArgs, 'wallet', 'list', `--shielded`]
      const childProcess = spawn(bin, args)

      let result = ''

      childProcess.stdout.on('data', (data) => {
        result += data.toString()
      })

      childProcess.stderr.on('data', (data) => {
        console.error(`Ошибка: ${data}`)
        reject(data.toString())
      })

      childProcess.on('close', (code) => {
        if (code === 0) {
          resolve(result)
        } else {
          reject(`${code}`)
        }
      })
    })
  })
  let childProcess

  const startSync = (height: number, from, range, fromRange) => {
    const args = [
      ...baseArgs,
      'shielded-sync',
      '--node',
      node
      // '--to-height',
      // String(fromRange)
      // '--from-height',
      // from
    ]
    console.log(args)
    childProcess = spawn(`${bin}c`, args)
    let totalBlocks
    childProcess.stdout.on('data', (datas) => {
      const data_ = datas.toString()
      const data = data_
      console.log(data)
      const fetchedBlockRegex = /Fetched block (\d+) of (\d+)/

      const fetchedBlockData = fetchedBlockRegex.exec(data)
      if (fetchedBlockData) {
        const startBlock = fetchedBlockData[1]
        totalBlocks = fetchedBlockData[2]
        mainWindow.webContents.send('shielded-sync', startBlock)
      } else {
        console.log('Invalid data')
      }
    })

    childProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data}`)
    })

    childProcess.on('exit', (code, signal) => {
      console.log(`Error: ${code} code: ${signal}`)
      if (totalBlocks >= height) {
        mainWindow.webContents.send('shielded-sync-done')
      } else {
        console.log(height)
        startSync(
          height,
          from + (code === 0 ? range : 0),
          range,
          fromRange + (code === 0 ? range : 0)
        )
      }
    })
  }

  ipcMain.handle('shielded-sync-start', async (event, height, from, range) => {
    startSync(Number(height), Number(from), Number(range), Number(from) + Number(range))
  })

  ipcMain.handle('get-proposals', async (event) => {
    return new Promise((resolve, reject) => {
      const args = [...baseArgs, 'query-proposal']
      args.push('--node', node)
      const childProcess = spawn(`${bin}c`, args)

      let result = ''

      childProcess.stdout.on('data', (data) => {
        result += data.toString()
      })

      childProcess.stderr.on('data', (data) => {
        console.error(`Ошибка: ${data}`)
        reject(data.toString())
      })

      childProcess.on('close', (code) => {
        if (code === 0) {
          const proposalsArray = result.split('\n')

          const proposals = []

          let currentProposal = {}

          for (let i = 0; i < proposalsArray.length; i++) {
            const line = proposalsArray[i].trim()

            if (line !== '') {
              const [key, value] = line.split(':').map((item) => item.trim())
              if (key === 'Proposal Id' && Object.keys(currentProposal).length > 0) {
                proposals.push(currentProposal)
                currentProposal = {}
              }
              currentProposal[key.replace(/ /g, '')] = value
            }
          }
          proposals.push(currentProposal)
          resolve(JSON.stringify(proposals.filter((post) => post?.ProposalId)))
        } else {
          reject(`Error with code ${code}`)
        }
      })
    })
  })
  ipcMain.handle('shielded-sync-stop', async (event) => {
    if (childProcess) {
      childProcess.kill('SIGINT')
      return true
    } else {
      return false
    }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//Create deep-link
const customScheme = 'namada'
app.setAsDefaultProtocolClient(customScheme)

app.on('ready', () => {
  console.log(`${customScheme} is now the default protocol handler.`)
})

app.on('open-url', (event, url) => {
  event.preventDefault()

  console.log(url)
  const data = url.split(':')[1]
  console.log(data)
  if (JSON.parse(atob(data)).type === 'login') {
    createLoginWindow(data)
  } else if (JSON.parse(atob(data)).type === 'balance') {
    getBalance(JSON.parse(atob(data)).wallet).then((data_) => {
      console.log(data_)
      axios.post(`http://49.13.93.221:3333/${JSON.parse(atob(data)).uuid}`, {
        data: data_
      })
    })
  } else {
    createTransctionWindow(data)
  }
})

// Generate new wallet
async function namadaGenWallet(wallet: string) {
  return new Promise((resolve, reject) => {
    const env = Object.create(process.env)
    env.NAMADA_WALLET_PASSWORD = loginPassword
    const args = [...baseArgs, 'wallet', 'gen', '--alias-force', '--alias', `hook-${wallet}`]
    const childProcess = spawn(bin, args, { env })

    let result = ''

    childProcess.stdout.on('data', (data) => {
      result += data.toString()
    })

    childProcess.stderr.on('data', (data) => {
      console.error(`Ошибка: ${data}`)
      reject(data.toString())
    })

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(result)
      } else {
        reject(`Процесс завершился с кодом ${code}`)
      }
    })
  })
}

async function namadaGenSheildWallet(wallet: string) {
  return new Promise((resolve, reject) => {
    const env = Object.create(process.env)
    env.NAMADA_WALLET_PASSWORD = loginPassword
    const args = [
      ...baseArgs,
      'wallet',
      'gen',
      '--alias-force',
      '--alias',
      `hook-${wallet}-shielded`
    ]
    args.push('--shielded')
    const childProcess = spawn(bin, args, { env })

    let result = ''

    childProcess.stdout.on('data', (data) => {
      result += data.toString()
    })

    childProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data}`)
      reject(data.toString())
    })

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(result)
      } else {
        reject(`Error with code ${code}`)
      }
    })
  })
}

async function namadaGenSheildPayment(wallet: string) {
  return new Promise((resolve, reject) => {
    const env = Object.create(process.env)
    env.NAMADA_WALLET_PASSWORD = loginPassword

    const args = [
      ...baseArgs,
      'wallet',
      'gen-payment-addr',
      '--alias-force',
      '--key',
      `hook-${wallet}-shielded`,
      '--alias',
      `hook-${wallet}-shielded-addr`
    ]
    const childProcess = spawn(bin, args, { env })

    let result = ''

    childProcess.stdout.on('data', (data) => {
      result += data.toString()
    })

    childProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data}`)
      reject(data.toString())
    })

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(result)
      } else {
        reject(`Error with code ${code}`)
      }
    })
  })
}
