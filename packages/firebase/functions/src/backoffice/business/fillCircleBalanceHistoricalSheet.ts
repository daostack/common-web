import { backofficeDb } from '../database';
import { env } from '../../constants';
import { google } from 'googleapis'
import { date } from '../helper'
import { jwt } from './jwtClient'

export async function fillCircleBalanceSheetHistoricalSheet():Promise<any> {
    const data = await backofficeDb.getCircleBalanceHistorical();
    const jwtClient = await jwt();
    const sheets = google.sheets('v4')
    
    
    const values = [[
      "Account",
      "Available",
      "Unsettled",
      "Updated at"
    ]];

    for (const key in data) {
        // eslint-disable-next-line no-prototype-builtins
        if (data.hasOwnProperty(key)) {

          for (let i = 0; i<data[key].available.length; i++){
            const cells = []
            cells.push(i+1)
            if (data[key].available[i]) cells.push(parseFloat(data[key].available[i].amount)); else cells.push(0);
            if (data[key].unsettled[i]) cells.push(parseFloat(data[key].unsettled[i].amount)); else cells.push(0);
            cells.push(`${date(new Date(data[key].createdAt.toDate()))}`)
            values.push(cells)
          }
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
        range: 'CIRCLE_BALANCES_HISTORICAL!A1',  // update this range of cells
        valueInputOption: 'USER_ENTERED',
        requestBody: resource
    }, {})
  
    return data;
  }