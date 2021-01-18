import { backofficeDb } from '../database';
import { env } from '../../constants';
import { google } from 'googleapis'
import { date } from '../helper'
import { jwt } from './jwtClient'


export async function fillCommonBalanceSheet():Promise<any> {
  const jwtClient = await jwt();
  const sheets = google.sheets('v4')
      

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