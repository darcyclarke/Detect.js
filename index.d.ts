// Type definitions for detect.js
export as namespace detect
export function parse(userAgent: string): IUserAgent
export interface IUserAgentProps {
  family: string
  name: string
  version: string
  major?: number
  minor?: number
  patch?: number
}
export interface IDevice extends IUserAgentProps {
  type: string
  manufacturer: string
}
export interface IUserAgent {
  browser: IUserAgentProps
  device: IDevice
  os: IUserAgentProps
}
