const { Member } = require('@daostack/arc.js');
const { findUserByAddress, updateUser } = require('../db/userDbService');
const { arc } = require('../settings')

async function updateUsers() {
    // this function is not used, leaving it here for reference
    const response = []
    const members = await Member.search(arc, {}, { fetchPolicy: 'no-cache' }).first()
    console.log(`found ${members.length} members`)
    const mapMembersToDaos = {}
    for (const member of members) {
        const daos = mapMembersToDaos[member.coreState.address] || []
        daos.push(member.coreState.dao.id)
        mapMembersToDaos[member.coreState.address] = daos
    }
    for (const memberAddress of Object.keys(mapMembersToDaos)) {
        // find the member with this address
        const user = await findUserByAddress(memberAddress)
        if (user) {
            const doc = {
                daos: mapMembersToDaos[memberAddress]
            }
            await updateUser(user.id, doc)
        }
    }
    return response.join('\n')

}

module.exports = {
    updateUsers
}
