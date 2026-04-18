import { fetchSubmissions } from '../lib/jotform'
import { FORM_IDS } from '../lib/constants'
import {
  transformCheckin,
  transformMessage,
  transformSighting,
  transformPersonalNote,
  transformAnonymousTip,
} from './transformers'
import type { Checkin, Message, Sighting, PersonalNote, AnonymousTip } from '../types'

export async function fetchCheckins(): Promise<Checkin[]> {
  const submissions = await fetchSubmissions(FORM_IDS.checkins)
  return submissions.map(transformCheckin)
}

export async function fetchMessages(): Promise<Message[]> {
  const submissions = await fetchSubmissions(FORM_IDS.messages)
  return submissions.map(transformMessage)
}

export async function fetchSightings(): Promise<Sighting[]> {
  const submissions = await fetchSubmissions(FORM_IDS.sightings)
  return submissions.map(transformSighting)
}

export async function fetchPersonalNotes(): Promise<PersonalNote[]> {
  const submissions = await fetchSubmissions(FORM_IDS.personalNotes)
  return submissions.map(transformPersonalNote)
}

export async function fetchAnonymousTips(): Promise<AnonymousTip[]> {
  const submissions = await fetchSubmissions(FORM_IDS.anonymousTips)
  return submissions.map(transformAnonymousTip)
}
