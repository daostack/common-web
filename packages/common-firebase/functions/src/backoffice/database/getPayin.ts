import { PaymentsCollection, ProposalsCollection, CommonCollection, UsersCollection } from './index';

export async function getPayin():Promise<any> {



    const payments = (await PaymentsCollection
        .orderBy("createdAt", "asc")
        .where("status", "==", "confirmed")
        .get()
    ).docs.map(p => p.data());


    let key = 0;
    const payInCollection = {}

    for (const property in payments) {

        const payment = payments[property];

        if(!payment.proposalId) continue;


        const proposalsQuery: any = ProposalsCollection;
        proposalsQuery.orderBy("createdAt", "asc")

        // eslint-disable-next-line no-await-in-loop
        const proposal = (await proposalsQuery.doc(payment.proposalId).get())
        const proposalData = proposal.data()

        if(proposalData){
            payInCollection[key] = { payment: payment, proposal: proposalData}


            const commonQuery: any = CommonCollection;

            //eslint-disable-next-line no-await-in-loop
            const dao = await commonQuery.doc(proposalData.commonId).get()
            const daoData = dao.data()
            if(daoData){
                payInCollection[key] = {...payInCollection[key], common: daoData}
            }


            const usersQuery: any = UsersCollection;
            usersQuery.orderBy("createdAt", "asc")

            //eslint-disable-next-line no-await-in-loop
            const user = await (usersQuery.doc(proposalData.proposerId).get())

            const userData = user.data()
            if(userData){
                payInCollection[key] = {...payInCollection[key], user: userData}
            }


            key++;
        }

    }
    return payInCollection
}