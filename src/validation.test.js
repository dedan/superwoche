import {validateEventChanges} from './validation'

function getDummyEvent(id, startInMinutesFromNow, durationMinutes, type='wake') {
  const start = new Date().valueOf() + startInMinutesFromNow * 60 * 1000
  return {id, start, durationMinutes, type}
}


it('should not allow the changes to end too close to the beginning of an existing event', () => {
  const hundredMinutesInPast = getDummyEvent(1, -100, 30)
  const twentyMinutesInFuture = getDummyEvent(2, 20, 30)
  const nowForOneMinute = getDummyEvent(3, 0, 1)
  const res = validateEventChanges(
    nowForOneMinute,
    [hundredMinutesInPast, twentyMinutesInFuture],
    {breakMinutes: 30})
  expect(res).toHaveLength(1)
})

it('should not allow the changes to start to close to the end of an existing event', () => {
  const endsTwentyMinutesInPast = getDummyEvent(1, -21, 1)
  const endsHundredMinutesInFuture = getDummyEvent(2, 99, 1)
  const nowForOneMinute = getDummyEvent(3, 0, 1)
  const res = validateEventChanges(
    nowForOneMinute,
    [endsTwentyMinutesInPast, endsHundredMinutesInFuture],
    {breakMinutes: 30})
  expect(res).toHaveLength(1)
})

it('should not return any errors for valid changes', () => {
  const startsFortyMinutesInFuture = getDummyEvent(1, 40, 20)
  const endsFortyMinutesInPast = getDummyEvent(2, -60, 20)
  const nowForOneMinute = getDummyEvent(3, 0, 1)
  const res = validateEventChanges(
    nowForOneMinute,
    [endsFortyMinutesInPast, startsFortyMinutesInFuture],
    {breakMinutes: 30})
  expect(res).toHaveLength(0)
})


it('should check existing events to not exceed sleep or wake quota', () => {
  const events = [
    getDummyEvent(1, -100, 1, 'wake'),
    getDummyEvent(2, -80, 2, 'wake'),
    getDummyEvent(3, -70, 7, 'wake'),
    getDummyEvent(4, 10, 30, 'sleep'),
  ]
  let res = validateEventChanges({}, events, {wakeQuotaMinutes: 20})
  expect(res).toHaveLength(0)
  res = validateEventChanges({}, events, {wakeQuotaMinutes: 9})
  expect(res).toHaveLength(1)

  res = validateEventChanges({}, events, {sleepQuotaMinutes: 30})
  expect(res).toHaveLength(0)
  res = validateEventChanges({}, events, {sleepQuotaMinutes: 20})
  expect(res).toHaveLength(1)
})

it('should include the event changes into quota calculations', () => {
  const events = {
    1: getDummyEvent(1, -100, 1, 'wake'),
    2: getDummyEvent(2, -80, 2, 'wake'),
  }
  let res = validateEventChanges({}, events, {wakeQuotaMinutes: 3})
  expect(res).toHaveLength(0)
  res = validateEventChanges(
    getDummyEvent(1, -100, 2), events, {wakeQuotaMinutes: 3})
  expect(res).toHaveLength(1)
})

it('should limit the length of wake events to 6 hours', () => {
  let res = validateEventChanges({durationMinutes: 30}, [], {})
  expect(res).toHaveLength(0)
  res = validateEventChanges({durationMinutes: 6 * 60 + 1}, [], {})
  expect(res).toHaveLength(0)
  res = validateEventChanges({type: 'wake', durationMinutes: 6 * 60 + 1}, [], {})
  expect(res).toHaveLength(1)
})
