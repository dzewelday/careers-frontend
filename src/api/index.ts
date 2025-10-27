import type { Degree, Job, Spotlight } from './types'
import ky from 'ky'

const api = ky.extend({ prefixUrl: '/api' })

export async function getDegrees(): Promise<Degree[]> {
  const degrees = await api.get<Array<Degree>>('degrees').json()
  return degrees
}

export async function getJobs(): Promise<Job[]> {
  const jobs = await api.get<Array<Job>>('jobs').json()
  return jobs
}

export async function getSpotlights(): Promise<Spotlight[]> {
  const spotlights = await api.get<Array<Spotlight>>('spotlights').json()
  return spotlights
}
