import { PaymentsCollection, ProposalsCollection, CommonCollection, UsersCollection, SubscriptionsCollection } from './index';

export async function getPayin():Promise<any> {



    const payments = (await PaymentsCollection
        .orderBy("createdAt", "asc")
        .where("status", "in", ['paid', 'confirmed'])
        .get()
    ).docs.map(p => p.data());


    let key = 0;
    const payInCollection = {}

    for (const property in payments) {

        const payment = payments[property];

        if(!payment.proposalId && !payment.subscriptionId) continue;


        const proposalsQuery: any = ProposalsCollection;
        proposalsQuery.orderBy("createdAt", "asc")

        const subscriptionsQuery: any = SubscriptionsCollection;
        subscriptionsQuery.orderBy("createdAt", "asc")

        let proposal, subscription;
        if(payment.proposalId){
            // eslint-disable-next-line no-await-in-loop
            proposal = (await proposalsQuery.doc(payment.proposalId).get())
        }
        

        const proposalData = proposal.data()

        if(proposalData){
                // eslint-disable-next-line no-await-in-loop
            payInCollection[key] = { payment: payment, proposal: proposalData}

            if(payment.subscriptionId){
                // eslint-disable-next-line no-await-in-loop
                subscription = (await subscriptionsQuery.doc(payment.subscriptionId).get())
                const subscriptionData = subscription.data()
                payInCollection[key] = { ...payInCollection[key], subscription: subscriptionData}

            }


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