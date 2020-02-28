const getApiHost = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4020'
  } else {
    return 'https://api2.eodiro.com'
  }
}

export default getApiHost
