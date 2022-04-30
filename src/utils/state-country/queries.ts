import alasql from 'alasql'
import stateCountry from 'state-country'

function cleanInput(value) {
  if (!value) return value

  return value.trim().toLowerCase().replace(/  +/g, ' ')
}

export function getStateById(idValue) {
  const cleanIdValue = cleanInput(idValue)
  const stateIdQuery =
    'SELECT state.* FROM ? as state WHERE state.id="' + cleanIdValue + '"'
  const state = alasql(stateIdQuery, [stateCountry.getAllStates()])

  const stateCountryJoinQuery =
    'SELECT state.*, country.name as countryName FROM ? as state JOIN ? as country ON state.country_id = country.id'
  const stateCountryList = alasql(stateCountryJoinQuery, [
    state,
    stateCountry.getAllCountries(),
  ])

  return stateCountryList
}
