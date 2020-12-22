import { backofficeDb } from '../database';
import { getSecret } from '../../settings';
import { env } from '../../constants';
import { google } from 'googleapis'


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
        'Payment id',
        'Payment status',
        'Payment amount',
        'Fees',
        'Payment creation date',
        'Payment updated'
      ]];
      for (const key in data) {
          // eslint-disable-next-line no-prototype-builtins
          if (data.hasOwnProperty(key)) {
              const cells = []
              cells.push(data[key].proposal.id)
              cells.push(data[key].proposal.fundingRequest.amount/100)
              cells.push(new Date(data[key].proposal.createdAt.toDate()).toDateString())
              cells.push(new Date(data[key].proposal.updatedAt.toDate()).toDateString())
              cells.push(data[key].proposal.proposerId)
              cells.push(data[key].user.email)
              cells.push(data[key].user.firstName)
              cells.push(data[key].user.lastName)
              cells.push(data[key].common.id)
              cells.push(data[key].common.name)
              if(data[key].payment){
                cells.push(data[key].payment.id)
                cells.push(data[key].payment.status)
                cells.push(data[key].payment.amount? `${data[key].payment.amount.amount} ${data[key].payment.amount.currency}` : '' )
                cells.push(data[key].payment.fee/100)
                const creationDate = data[key].payment.creationDate.split(/\D+/)
                const updateDate = data[key].payment.updateDate.split(/\D+/)
                cells.push(new Date(Date.UTC(creationDate[0], --creationDate[1], creationDate[2], creationDate[3], creationDate[4], creationDate[5], creationDate[6])).toDateString())
                cells.push(new Date(Date.UTC(updateDate[0], --updateDate[1], updateDate[2], updateDate[3], updateDate[4], updateDate[5], updateDate[6])).toDateString())
              } else {
                cells.push("")
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
          range: 'PAY_OUT!A1',  // update this range of cells
          valueInputOption: 'RAW',
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
    'Proposal Id',
    'Funding',
    'Proposal title',
    'Proposal created at',
    'Proposal updated at',
    'User UID',
    'User email',
    'First name',
    'Last name',
    'Common id',
    'Common name',
    'Common information',
    'Payment id',
    'Payment status',
    'Payment amount',
    'Fees',
    'Payment creation date',
    'Payment updated'
  ]];
  for (const key in data) {
      // eslint-disable-next-line no-prototype-builtins
      if (data.hasOwnProperty(key)) {
          const cells = []
          if(data[key].proposal){
            cells.push(data[key].proposal.id)
            cells.push(data[key].proposal.join.funding/100)
            cells.push(data[key].proposal.description.title)
            cells.push(new Date(data[key].proposal.createdAt.toDate()).toDateString())
            cells.push(new Date(data[key].proposal.updatedAt.toDate()).toDateString())
            cells.push(data[key].proposal.proposerId)
          } else {
            cells.push("")
            cells.push("")
            cells.push("")
            cells.push("")
            cells.push("")
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
          
          if(data[key].payment){
            cells.push(data[key].payment.id)
            cells.push(data[key].payment.status)
            cells.push(data[key].payment.amount.amount/100)
            cells.push(data[key].payment.fee/100)
            cells.push(new Date(data[key].payment.createdAt.toDate()).toDateString())
            cells.push(new Date(data[key].payment.updatedAt.toDate()).toDateString())
            
          }
          else{
            cells.push("")
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
      valueInputOption: 'RAW',
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
  ]];
  for (let i = 0; i<data.available.length; i++){
    const cells = []
    cells.push(i+1)
    if (data.available[i]) cells.push(parseFloat(data.available[i].amount)); else cells.push(0);
    if (data.unsettled[i]) cells.push(parseFloat(data.unsettled[i].amount)); else cells.push(0);
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
      valueInputOption: 'RAW',
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
        'Updated At',
        'Date'
      ]];
      for (const key in data) {
        // eslint-disable-next-line no-prototype-builtins
        if (data.hasOwnProperty(key)) {
          const cells = []
          cells.push(data[key].id)
          cells.push(data[key].name)
          cells.push(data[key].balance/100)
          cells.push(new Date(data[key].updatedAt.toDate()).toDateString())
          cells.push(new Date().toDateString())
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
          valueInputOption: 'RAW',
          requestBody: resource
      }, {})

      return data;
}