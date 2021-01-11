import { backofficeDb } from '../database';
import { getSecret } from '../../settings';
import { env } from '../../constants';
import { google } from 'googleapis'
import { date } from '../helper'


const SERVICE_ACCOUNT = 'SERVICE_ACCOUNT' 
const SERVICE_ACCOUNT_PRIVATE_KEY = 'SERVICE_ACCOUNT_PRIVATE_KEY'

export async function fillPayOutSheet():Promise<any> {
    const data = await backofficeDb.getPayout();
      
      const sheets = google.sheets('v4')
      const jwtClient = new google.auth.JWT({
          email: await getSecret(SERVICE_ACCOUNT),
          key: await getSecret(SERVICE_ACCOUNT_PRIVATE_KEY),
          scopes: [ 'https://www.googleapis.com/auth/spreadsheets' ],  // read and write sheets
      })


      const values = [[
        'Proposal Id',
        'Amount',
        'Approval created at',
        'Approval updated at',
        'User UID',
        'User email',
        'First name',
        'Last name',
        'Common id',
        'Common name',
        'Init Link',
        'Payment id',
        'Payment status',
        'Payment amount',
        'Fees',
        'Payment creation date',
        'Payment updated',
        'IBAN**',
        'Routing number**',
        'Bank account**',
        'Full Name* - Billing address',
        'City* - Billing address',
        'Country* - Billing address',
        'Line 1* - Billing address',
        'Line 2 - Billing address',
        'District - Billing address',
        'Postal code* - Billing address',
        'Name* - Bank',
        'City* - Bank',
        'Country* - Bank',
        'Line 1 - Bank',
        'Line 2 - Bank',
        'District - Bank',
        'Postal code - Bank',
        'Type* - Payout'
      ]];

      let row = 2;
      for (const key in data) {
          // eslint-disable-next-line no-prototype-builtins
          if (data.hasOwnProperty(key)) {
              const cells = []
              cells.push(data[key].proposal.id)
              cells.push(data[key].proposal.fundingRequest.amount/100)
              cells.push(date(new Date(data[key].proposal.createdAt.toDate())))
              cells.push(date(new Date(data[key].proposal.updatedAt.toDate())))
              cells.push(data[key].proposal.proposerId)
              cells.push(data[key].user.email)
              cells.push(data[key].user.firstName)
              cells.push(data[key].user.lastName)
              cells.push(data[key].common.id)
              cells.push(data[key].common.name)
              
              cells.push(`=createInitLink(R${row}:AG${row}, A${row})`);


              if(data[key].payout){
                //this is init link, must be empty

                cells.push(data[key].payout.id);

                let status = '';
                if(!data[key].payout.executed){
                  status = 'initiated';
                } else {
                  if(data[key].payout.status === 'pending'){
                    status = 'pending';
  
                  }
                  if(data[key].payout.status === 'complete'){
                    status = 'complete';
  
                  }
                  if(data[key].payout.status === 'failed'){
                    status = 'failed';
  
                  }
                }
                cells.push(status);
                cells.push(data[key].payout.amount);
                //this is fees
                cells.push("");
                cells.push(date(new Date(data[key].payout.createdAt.toDate())))
                cells.push(date(new Date(data[key].payout.updatedAt.toDate())))

              }
              
              values.push(cells);
          }
          row++;
      }
      const resource = {
        values,
      };

      const jwtAuthPromise = jwtClient.authorize()
      await jwtAuthPromise
      await sheets.spreadsheets.values.update({
          auth: jwtClient,
          spreadsheetId: env.backoffice.sheetUrl,
          range: 'PAY_OUT!A1',  // update this range of cells
          valueInputOption: 'USER_ENTERED',
          requestBody: resource
      }, {})

      return data;

}

export async function fillPayInSheet():Promise<any> {
  const data = await backofficeDb.getPayin();
    
  const sheets = google.sheets('v4')
  const jwtClient = new google.auth.JWT({
      email: await getSecret(SERVICE_ACCOUNT),
      key: await getSecret(SERVICE_ACCOUNT_PRIVATE_KEY),
      scopes: [ 'https://www.googleapis.com/auth/spreadsheets' ],  // read and write sheets
  })
  
  const values = [[
    "Payment id",
    "Circle Payment id",
    "Payment status",
    "Payment amount",
    "Fees",
    "Payment creation date",
    "Payment updated",
    "User UID",
    "User email",
    "First name",
    "Last name",
    "Common id",
    "Common name",
    "Common information",
    "Proposal Id",
    "Funding",
    "Proposal title",
    "Proposal created at",
    "Proposal updated at",
    "Subscription Id",
    "Subscription amount",
    "Subscription created at",
    "Subscription updated at" 
  ]];
  for (const key in data) {
      // eslint-disable-next-line no-prototype-builtins
      if (data.hasOwnProperty(key)) {
          const cells = []

          if(data[key].payment){
            cells.push(data[key].payment.id)
            cells.push(data[key].payment.circlePaymentId)
            cells.push(data[key].payment.status)
            cells.push(data[key].payment.amount.amount/100)
            if(data[key].payment.fees){
              cells.push(data[key].payment.fees.amount/100)
            } else{
              cells.push("")
            }
            cells.push(`${date(new Date(data[key].payment.createdAt.toDate()))}`)
            cells.push(`${date(new Date(data[key].payment.updatedAt.toDate()))}`)            
          }
          else{
            cells.push("")
            cells.push("")
            cells.push("")
            cells.push("")
            cells.push("")
            cells.push("")
          }

          if(data[key].proposal){
         
            cells.push(data[key].proposal.proposerId)
          } else {
            cells.push("")
          }

          if(data[key].user){
            cells.push(data[key].user.email)
            cells.push(data[key].user.firstName)
            cells.push(data[key].user.lastName)
          } else {
            cells.push("")
            cells.push("")
            cells.push("")
          }

          if(data[key].common){
            cells.push(data[key].common.id)
            cells.push(data[key].common.name)
            cells.push(data[key].common.metadata.contributionType)
          } else {
            cells.push("")
            cells.push("")
            cells.push("")
          }

          if(data[key].proposal){
            cells.push(data[key].proposal.id)
            cells.push(data[key].proposal.join.funding/100)
            cells.push(data[key].proposal.description.title)
            cells.push(`${date(new Date(data[key].proposal.createdAt.toDate()))}`)
            cells.push(`${date(new Date(data[key].proposal.updatedAt.toDate()))}`)
          } else {
            cells.push("")
            cells.push("")
            cells.push("")
            cells.push("")
            cells.push("")
            cells.push("")
          }

          if(data[key].subscription){
            cells.push(data[key].subscription.id)
            cells.push(data[key].subscription.amount/100)
            cells.push(`${date(new Date(data[key].subscription.createdAt.toDate()))}`)
            cells.push(`${date(new Date(data[key].subscription.updatedAt.toDate()))}`)
          } else {
            cells.push("")
            cells.push("")
            cells.push("")
            cells.push("")
            cells.push("")
          }
          
          
          
          
          
          
          values.push(cells)
      }
  }
  const resource = {
    values,
  };

  const jwtAuthPromise = jwtClient.authorize()
  await jwtAuthPromise
  await sheets.spreadsheets.values.update({
      auth: jwtClient,
      spreadsheetId: env.backoffice.sheetUrl,
      range: 'PAY_IN!A1',  // update this range of cells
      valueInputOption: 'USER_ENTERED',
      requestBody: resource
  }, {})

  return data;
}

export async function filCircleBalanceSheet():Promise<any> {
  const sheets = google.sheets('v4')
  const jwtClient = new google.auth.JWT({
      email: await getSecret(SERVICE_ACCOUNT),
      key: await getSecret(SERVICE_ACCOUNT_PRIVATE_KEY),
      scopes: [ 'https://www.googleapis.com/auth/spreadsheets' ],  // read and write sheets
  })
  const data = (await backofficeDb.getCircleBalance()).data.data;
  const values = [[
    'Account',
    'Available',
    'Unsettled',
    'Date',
  ]];
  for (let i = 0; i<data.available.length; i++){
    const cells = []
    cells.push(i+1)
    if (data.available[i]) cells.push(parseFloat(data.available[i].amount)); else cells.push(0);
    if (data.unsettled[i]) cells.push(parseFloat(data.unsettled[i].amount)); else cells.push(0);
    cells.push(date())
    values.push(cells)
  }

  const resource = {
    values,
  };

  const jwtAuthPromise = jwtClient.authorize()
  await jwtAuthPromise
  await sheets.spreadsheets.values.update({
      auth: jwtClient,
      spreadsheetId: env.backoffice.sheetUrl,
      range: 'CIRCLE_BALANCES!A1',  // update this range of cells
      valueInputOption: 'USER_ENTERED',
      requestBody: resource
  }, {})

  return data;
}

export async function fillCommonBalanceSheet():Promise<any> {
  const sheets = google.sheets('v4')
      const jwtClient = new google.auth.JWT({
          email: await getSecret(SERVICE_ACCOUNT),
          key: await getSecret(SERVICE_ACCOUNT_PRIVATE_KEY),
          scopes: [ 'https://www.googleapis.com/auth/spreadsheets' ],  // read and write sheets
      })

      const data = await backofficeDb.getCommonBalance();
      const values = [[
        'Common id',
        'Common name',
        'Balance',
        'Date'
      ]];
      for (const key in data) {
        // eslint-disable-next-line no-prototype-builtins
        if (data.hasOwnProperty(key)) {
          const cells = []
          cells.push(data[key].id)
          cells.push(data[key].name)
          cells.push(data[key].balance/100)
          cells.push(date())
          values.push(cells)
        }

      }

      const resource = {
        values,
      };

      const jwtAuthPromise = jwtClient.authorize()
      await jwtAuthPromise
      await sheets.spreadsheets.values.update({
          auth: jwtClient,
          spreadsheetId: env.backoffice.sheetUrl,
          range: 'COMMON_BALANCES!A1',  // update this range of cells
          valueInputOption: 'USER_ENTERED',
          requestBody: resource
      }, {})

      return data;
}