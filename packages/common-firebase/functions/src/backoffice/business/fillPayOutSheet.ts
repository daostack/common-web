import { backofficeDb } from '../database';
import { env } from '../../constants';
import { google } from 'googleapis'
import { date } from '../helper'
import { jwt } from './jwtClient'

export async function fillPayOutSheet():Promise<any> {
  const jwtClient = await jwt();  
  const data = await backofficeDb.getPayout();
  const sheets = google.sheets('v4')
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