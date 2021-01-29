
import { google } from 'googleapis'
import { getSecret } from '../../settings';

const SERVICE_ACCOUNT = 'SERVICE_ACCOUNT' 
const SERVICE_ACCOUNT_PRIVATE_KEY = 'SERVICE_ACCOUNT_PRIVATE_KEY'


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const jwt = async () => { 
    return new google.auth.JWT({
        email: await getSecret(SERVICE_ACCOUNT),
        key: await getSecret(SERVICE_ACCOUNT_PRIVATE_KEY),
        scopes: [ 'https://www.googleapis.com/auth/spreadsheets' ],  // read and write sheets
    })
}