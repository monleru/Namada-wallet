import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'

const logo = `<svg width="300" xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 1080 1080"><defs><style>.cls-1{fill:#ff0;}</style></defs><path class="cls-1" d="M838.87,174.45c3.49,3.29,6.96,6.61,10.37,10.02,42.59,42.59,76.03,92.19,99.39,147.41,24.18,57.18,36.45,117.92,36.45,180.52s-12.26,123.34-36.45,180.52c-23.36,55.23-56.8,104.82-99.39,147.41-42.59,42.59-92.19,76.03-147.41,99.39-57.18,24.19-117.92,36.45-180.52,36.45-55.63,0-109.78-9.71-161.27-28.83,60.07,29.04,127.47,45.32,198.67,45.32,252.44,0,457.08-204.64,457.08-457.08,0-146.85-69.27-277.51-176.9-361.14Z"/><path class="cls-1" d="M523.59,55.33c-252.44,0-457.08,204.64-457.08,457.08s204.64,457.08,457.08,457.08,457.08-204.64,457.08-457.08S776.02,55.33,523.59,55.33Z"/><g><g><rect x="530.37" y="512.43" width="120.92" height="120.92"/><path d="M409.39,391.45h0c66.74,0,120.92,54.19,120.92,120.92h-120.92v-120.92h0Z"/><polygon points="409.39 512.43 339.57 633.36 479.2 633.36 409.39 512.43"/><circle cx="651.73" cy="451.91" r="60.43"/></g><path d="M525.87,835.77c-86.38,0-167.58-33.64-228.66-94.71-61.08-61.07-94.71-142.28-94.71-228.65s33.64-167.58,94.71-228.66c61.08-61.08,142.28-94.71,228.66-94.71s167.58,33.64,228.66,94.71c61.08,61.08,94.71,142.28,94.71,228.66s-33.64,167.58-94.71,228.66c-61.08,61.08-142.28,94.71-228.66,94.71h0Zm0-606.67c-75.67,0-146.81,29.47-200.32,82.98-53.51,53.5-82.98,124.65-82.98,200.32s29.47,146.81,82.98,200.32,124.65,82.98,200.32,82.98,146.81-29.47,200.32-82.98c53.51-53.51,82.98-124.65,82.98-200.32s-29.47-146.81-82.98-200.32c-53.51-53.51-124.65-82.98-200.32-82.98h0Z"/></g></svg>
`

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement): void {
    if (!Array.from(parent.children).find((e) => e === child)) {
      parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement): void {
    if (Array.from(parent.children).find((e) => e === child)) {
      parent.removeChild(child)
    }
  }
}

function useLoading(): any {
  const className = `loaders-css__square-spin`
  const styleContent = `
@keyframes loader {
  0% { rotate: 0; }
  100% { rotate: 360deg; }
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 99999999;
  flex-direction: column;
  text-align: center;
  color: #FFF;
}
.loader{
  animation: loader 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}`
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `
  <div class="${className}"><div>
  <div>${logo}</div>
  <p>Namada Wallet</p></div></div>
  <div class="loader">
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1_1113)">
    <path opacity="0.3" d="M50 20C55.5228 20 60 15.5228 60 10C60 4.47715 55.5228 0 50 0C44.4772 0 40 4.47715 40 10C40 15.5228 44.4772 20 50 20Z" fill="#808080"/>
    <path opacity="0.3" d="M78.284 31.7161C83.8068 31.7161 88.284 27.2389 88.284 21.7161C88.284 16.1932 83.8068 11.7161 78.284 11.7161C72.7611 11.7161 68.284 16.1932 68.284 21.7161C68.284 27.2389 72.7611 31.7161 78.284 31.7161Z" fill="#808080"/>
    <path opacity="0.3" d="M90 60C95.5228 60 100 55.5228 100 50C100 44.4772 95.5228 40 90 40C84.4772 40 80 44.4772 80 50C80 55.5228 84.4772 60 90 60Z" fill="#808080"/>
    <path opacity="0.3" d="M78.284 88.2839C83.8068 88.2839 88.284 83.8068 88.284 78.2839C88.284 72.7611 83.8068 68.2839 78.284 68.2839C72.7611 68.2839 68.284 72.7611 68.284 78.2839C68.284 83.8068 72.7611 88.2839 78.284 88.2839Z" fill="#808080"/>
    <path opacity="0.3" d="M50 100C55.5228 100 60 95.5228 60 90C60 84.4772 55.5228 80 50 80C44.4772 80 40 84.4772 40 90C40 95.5228 44.4772 100 50 100Z" fill="#808080"/>
    <path opacity="0.3" d="M21.716 88.2839C27.2389 88.2839 31.716 83.8068 31.716 78.2839C31.716 72.7611 27.2389 68.2839 21.716 68.2839C16.1932 68.2839 11.716 72.7611 11.716 78.2839C11.716 83.8068 16.1932 88.2839 21.716 88.2839Z" fill="#808080"/>
    <path opacity="0.3" d="M10 60C15.5228 60 20 55.5228 20 50C20 44.4772 15.5228 40 10 40C4.47715 40 0 44.4772 0 50C0 55.5228 4.47715 60 10 60Z" fill="#808080"/>
    <path opacity="0.3" d="M21.716 31.7161C27.2389 31.7161 31.716 27.2389 31.716 21.7161C31.716 16.1932 27.2389 11.7161 21.716 11.7161C16.1932 11.7161 11.716 16.1932 11.716 21.7161C11.716 27.2389 16.1932 31.7161 21.716 31.7161Z" fill="#808080"/>
    </g>
    <defs>
    <clipPath id="clip0_1_1113">
    <rect width="100" height="100" fill="white"/>
    </clipPath>
    </defs>
    </svg>
  </div>`

  return {
    appendLoading(): void {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading(): void {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    }
  }
}

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.addEventListener('message', (ev) => {
  if (ev.data.payload === 'removeLoading') {
    removeLoading()
  }
})

setTimeout(removeLoading, 2000)

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'CommonJS'
  }
})
