interface TestProps {
  id: string
  name: string
}

const testData:TestProps[] = [{ id: '1', name: 'a' }, { id: '2', name: 'b' }]
const testData2:{[key:string]:TestProps} = {
  1: { id: '1', name: 'a' },
  2: { id: '2', name: 'b' }
}

export const arrToObj = < T extends { id: string } > (arr: Array<T>) => {
  return arr.reduce((prev, current) => {
    if (current.id) {
      prev[current.id] = current
    }
    return prev
  }, {} as { [key: string]: T })
}

export const objToArry = <T>(obj: {[key: string]: T}) => {
  return Object.keys(obj).map(key => obj[key])
}
