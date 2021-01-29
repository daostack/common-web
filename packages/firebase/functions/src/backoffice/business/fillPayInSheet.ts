import { backofficeDb } from '../database';
import { env } from '../../constants';
import { google } from 'googleapis'
import { date } from '../helper'
import { jwt } from './jwtClient'


export async function fillPayInSheet():Promise<any> {
    const data = await backofficeDb.getPayin();
    const jwtClient = await jwt();  
    const sheets = google.sheets('v4')
   
    
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