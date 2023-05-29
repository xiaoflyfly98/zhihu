interface TestProps {
  _id: string
  name: string
}

const testData:TestProps[] = [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }]
const testData2:{[key:string]:TestProps} = {
  1: { _id: '1', name: 'a' },
  2: { _id: '2', name: 'b' }
}

export const arrToObj = < T extends {_id: string } > (arr: Array<T>) => {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  }, {} as { [key: string]: T })
}

export const objToArry = <T>(obj: {[key: string]: T}) => {
  return Object.keys(obj).map(key => obj[key])
}

export const demo = arrToObj(testData)
console.log(demo)

const demo2 = objToArry(testData2)
console.log(demo2)
