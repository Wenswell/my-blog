
export function updateQueryParameter(route, router, paramType, shouldAdd, paramValue) {
  const currentQuery = { ...route.query }
  if(currentQuery.page)delete currentQuery.page
  if (shouldAdd) {
    // const existingParam = currentQuery[paramType] || ''
    // const newParam = existingParam ? `${existingParam},${paramValue}` : paramValue
    const newParam = paramValue
    const newQuery = { ...currentQuery, [paramType]: newParam }
    router.push({ query: newQuery })
  } else {
    delete currentQuery[paramType]
    router.push({ query: currentQuery })
  }
}