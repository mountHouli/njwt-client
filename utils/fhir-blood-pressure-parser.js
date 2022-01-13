const util = require('util')

const fhirBloodPressureData = require('./fhir-blood-pressure-data.json')

function main() {
  console.log('running!')
  console.log('FHIR component code text \t | FHIR component display \t | LOINC code \t | Val \t | Facility \t\t\t | Clinician')
  console.log('--------------------------------------------------------------------------------------------------------------------------------------------')
  for (result of fhirBloodPressureData) {
    for (entry of result.entry) {
      const {
        resourceType,
        status,
        category,
        code,
        component: components,
        performer: performers
      } = entry.resource

      if (
        resourceType === 'Observation' &&
        status === 'final' &&
        category?.length === 1 &&
        category[0]?.coding?.length === 1 &&
        category[0]?.coding[0]?.code === 'vital-signs' &&
        code?.coding?.length === 1 &&
        code?.coding[0]?.code === '55284-4' // &&
        // performers?.length === 2
      ) {
        for (component of components) {
          const coding = component.code.coding
          const valueQuantity = component.valueQuantity
          if (
            coding?.length === 1 && (
            coding[0]?.code === '8480-6' ||
            coding[0]?.code === '8462-4'
            )
          ) {
            console.log(`${component.code.text} \t | ${coding[0].display} \t | ${coding[0].code} \t | ${valueQuantity.value} \t | ${getFacility(performers)} \t | ${getClinician(performers)}`)
          }
          else {
            if (coding.length !== 1) {
              console.log('coding.length !== 1')
              log(coding)
            }
            else if (coding[0].code !== '8480-6' && coding[0].code !== '8462-4') {
              console.log('coding[0].code not valid')
              log(coding)
            }
            else {
              console.log('Some other problem with the coding')
              log(coding)
            }
          }
        }
      }
      else {
        if (resourceType !== 'Observation') {
          console.log('resourceType !== Observation')
          log(entry?.resource)
        }
        else if (status !== 'final') {
          console.log('status !== final')
          log(entry?.resource)
        }
        else if (category?.length !== 1) {
          console.log('category?.length !== 1')
          log(entry?.resource)
        }
        else if (category?.coding?.length !== 1) {
          console.log('cateogry.coding.length !== 1')
          log(entry?.resource)
        }
        else if (category.coding[0].code !== 'vital-signs') {
          console.log('category.coding[0].code !== vital-signs')
          log(entry?.resource)
        }
        else if (code.coding.length !== 1) {
          console.log('code.coding.length !== 1')
          log(entry?.resource)
        }
        else if (code?.coding[0]?.code !== '55284-4') {
          console.log('code.coding[0].code !== 55284-4')
          log(entry?.resource)
        }
        else if (performer?.length !== 2) {
          console.log('performer?.length !== 2')
          log(entry?.resource)
        }
        else {
          console.log('Some other problem with the resource')
          log(entry?.resource)
        }
      }
    }
  }
}

main()

function log(data) {
  console.log(util.inspect(data, false, null, true))
}

function getFacility(performers) {
  const organizationResource = /\/services\/fhir\/v0\/r4\/Organization/i
  const organizations = performers?.filter(performer => {
    if(performer.reference.match(organizationResource)) {
      return true
    }
    return false
  })

  if (!organizations?.length) {
    return 'No Facility'
  }

  if (organizations?.length !== 1) {
    displays = organizations.map(org => org.display)
    return displays.join(', ')
  }

  return organizations[0].display
}

function getClinician(performers) {
  const practitionerResource = /\/services\/fhir\/v0\/r4\/Practitioner/i
  const practitioners = performers?.filter(performer => {
    if(performer.reference.match(practitionerResource)) {
      return true
    }
    return false
  })

  if (!practitioners?.length) {
    return 'No Clinician'
  }

  if (practitioners?.length !== 1) {
    displays = practitioners.map(org => org.display)
    return displays.join(', ')
  }

  return practitioners[0].display
}
