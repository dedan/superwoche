
export function getTotalEventMinutesByType(events, type) {
  return Object.values(events)
    .filter(event => event.type === type)
    .map(event => event.durationMinutes)
    .reduce((a, b) => a + b, 0)
}

export function validateEventChanges(eventChanges, events, config) {
  const errors = []
  const nonChangingEvents = Object.values(events).filter(event => event.id !== eventChanges.id)
  const eventChangesEnd = eventChanges.start + eventChanges.durationMinutes * 60 * 1000

  const tooCloselyFollowingEvents = nonChangingEvents.filter(event => {
    const distanceInMinutes = (event.start - eventChangesEnd) / 1000 / 60
    const isTooclose = distanceInMinutes < config.breakMinutes && distanceInMinutes >= 0
    return eventChanges.id !== event.id && isTooclose
  })

  if (tooCloselyFollowingEvents.length) {
    errors.push('An event is to closely after the event you want to add (leave 30 min breaks')
  }

  const tooCloselyBeforeEvents = nonChangingEvents.filter(event => {
    const eventEnd = event.start + event.durationMinutes * 60 * 1000
    const distanceInMinutes = (eventChanges.start - eventEnd) / 1000 / 60
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
  const totalWakeDuration = getTotalEventMinutesByType(newState, 'wake')
  if (config.wakeQuotaMinutes && totalWakeDuration > config.wakeQuotaMinutes) {
    errors.push('Wake quota exceeded')
  }
  const totalSleepDuration = getTotalEventMinutesByType(newState, 'sleep')
  if (config.sleepQuotaMinutes && totalSleepDuration > config.sleepQuotaMinutes) {
    errors.push('Sleep quota exceeded')
  }

  if (eventChanges.type === 'wake' && eventChanges.durationMinutes > (6 * 60)) {
    errors.push('Activity events have a maximum length of 6 hours')
    errors.push('Please make it shorter or a sleep event')
  }

  return errors
}
