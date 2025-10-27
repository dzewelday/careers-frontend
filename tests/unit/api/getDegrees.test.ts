import type { Mock } from 'vitest'
import ky from 'ky'
import { expect } from 'vitest'
import { getDegrees } from '@/api/index'

vi.mock('ky')
const kyGetMock = ky.get as Mock
describe('getDegrees', () => {
  beforeEach(() => {
    kyGetMock.mockResolvedValue({
      data: [{ id: 1, degree: 'Bachelors' }],
    })
  })

  it('gets degrees', async () => {
    const degrees = await getDegrees()

    expect(kyGetMock).toHaveBeenCalledWith('http://myfakeapi.com/degrees')
    expect(degrees).toEqual([{ id: 1, degree: 'Bachelors' }])
  })
})
