interface IRecordData {
  partyName: string
  var: number,
  netCapital: number,
  varByNetCapital: number,
  netAsset: number,
  varByNetAsset: number
}

interface IMockData {
  data: {
    error: null
    data: {
      result: {
        page: IRecordData[],
        totalCount: number
      }
    }
  }
}

const generateMock = (totalCount): IRecordData[] => {
  const page: IRecordData[] = []
  for (let i = 0; i < totalCount; i += 1) {
    const item: IRecordData = {
      var: Math.random() * 100000000,
      varByNetAsset: Math.random() * 100000000,
      varByNetCapital: Math.random() * 100000000,
      netAsset: Math.random() * 100000000,
      netCapital: Math.random() * 100000000,
      partyName: Math.random().toFixed(3).toString(),
    }
    page.push(item)
  }
  return page
}

const getMockData = ():IMockData => ({
  data: {
    error: null,
    data: {
      result: {
        page: generateMock(10),
        totalCount: 38,
      }
    }
  }
})

export { getMockData }
