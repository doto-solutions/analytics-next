import { Signal } from '../../types'

export const redactSignalData = (signal: Signal): Signal => {
  if (signal.type === 'instrumentation' || signal.type === 'userDefined') {
    return signal
  }
  if (signal.type === 'interaction') {
    if ('target' in signal.data && 'value' in signal.data.target) {
      signal.data.target.value = redact(signal.data.target.value)
    } else if ('submitter' in signal.data && 'value' in signal.data.submitter) {
      signal.data.submitter.value = redact(signal.data.submitter.value)
    }
    return signal
  }

  if (signal.type === 'network') {
    signal.data = redactJsonValues(signal.data, 2)
  }
  return signal
}

function redact(value: unknown) {
  const type = typeof value
  if (type === 'boolean') {
    return true
  }

  if (['number', 'bigint'].includes(type)) {
    return 999
  }

  if (value === undefined || value === null) {
    return value
  }

  return 'XXX'
}

export function redactJsonValues(data: unknown, redactAfterDepth = 0): any {
  if (typeof data === 'object' && data) {
    if (Array.isArray(data)) {
      return data.map((item) => redactJsonValues(item, redactAfterDepth - 1))
    } else {
      const redactedData: any = {}
      for (const key in data) {
        redactedData[key] = redactJsonValues(
          // @ts-ignore
          data[key],
          redactAfterDepth === 0 ? 0 : redactAfterDepth - 1
        )
      }
      return redactedData
    }
  } else if (redactAfterDepth <= 0) {
    const ret = redact(data)
    return ret
  } else {
    return data
  }
}
