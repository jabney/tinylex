module.exports = `

#
# Darklord source
#
summon "messenger"

forge harken(msg) {
  messenger(msg || 'All shall flee before me!')
}

craft lieutenants = 12
craft message = "I have " + leutenants + " servants"

harken.wield(message)`
