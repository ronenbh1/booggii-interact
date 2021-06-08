export const eitherOfTheKeysIsEmpty = obj =>
  !Object.values(obj).reduce((acc, value) => acc && value, true)

const undefinedKeyHandler = {
  get(target, property) {
    return target[property]
      ? target[property]
      : target['UNDEFINED']
      ? target['UNDEFINED']
      : undefined
  },
}

export const keyProxy = obj => new Proxy(obj, undefinedKeyHandler)
