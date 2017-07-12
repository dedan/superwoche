
export function validateEventChanges(eventChanges, events, config) {
  const errors = []
  const nonChangingEvents = Object.values(events).filter(event => event.id !== eventChanges.id)

  const tooCloselyFollowingEvents = nonChangingEvents.filter(event => {
    const distanceInMinutes = (event.start - eventChanges.end) / 1000 / 60
    const isTooclose = distanceInMinutes < config.breakMinutes && distanceInMinutes >= 0
    return eventChanges.id !== event.id && isTooclose
  })

  if (tooCloselyFollowingEvents.length) {
    errors.push('An event is to closely after the event you want to add (leave 30 min breaks')
  }

  const tooCloselyBeforeEvents = nonChangingEvents.filter(event => {
    const distanceInMinutes = (eventChanges.start - event.end) / 1000 / 60
    const isTooclose = distanceInMinutes < config.breakMinutes && distanceInMinutes >= 0
    return eventChanges.id !== event.id && isTooclose
  })
  if (tooCloselyBeforeEvents.length) {
    errors.push('An event is too closely before the event you want to add (leave 30 min breaks)')
  }

  const newState = {
    ...events,
    [eventChanges.id]: eventChanges,
  }
  const totalWakeDuration = Object.values(newState)
    .filter(event => event.type === 'wake')
    .map(event => (event.end - event.start) / 1000 / 60)
    .reduce((a, b) => a + b, 0)
  if (config.wakeQuotaMinutes && totalWakeDuration > config.wakeQuotaMinutes) {
    errors.push('Wake quota exceeded')
  }
  const totalSleepDuration = Object.values(newState)
    .filter(event => event.type === 'sleep')
    .map(event => (event.end - event.start) / 1000 / 60)
    .reduce((a, b) => a + b, 0)
  if (config.sleepQuotaMinutes && totalSleepDuration > config.sleepQuotaMinutes) {
    errors.push('Sleep quota exceeded')
  }

  return errors
}
