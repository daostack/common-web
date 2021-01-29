import { backofficeDb } from '../database';
import { env } from '../../constants';
import { google } from 'googleapis'
import { date } from '../helper'
import { jwt } from './jwtClient'



export async function fillCircleBalanceSheet():Promise<any> {
  const jwtClient = await jwt();
  const sheets = google.sheets('v4')

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