const {arc} = require('../settings')
const HTTP_STATUS_CODE = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
}

const responseExecutor = async (action, { req, res, successMessage, errorMessage }) => {
    try {
        const actionResult = await action();
        console.log(actionResult);

        res.status(HTTP_STATUS_CODE.OK)
            .json(
                {
                    message: successMessage,
                    ...actionResult
                }
            );
    } catch (e) {
        console.error(e)
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
            .json(
                {
                    error: {
                        commonMessage: errorMessage,
                        errorObject: JSON.stringify(e, null, 4),
                        error: e.toString()
                    },
                    query: req.query
                });
    }
}

let retried = false;
const responseCreateExecutor = async (action, { req, res, successMessage, errorMessage }) => {
    try {
        const actionResult = await action();
        console.log(actionResult)
        res.status(HTTP_STATUS_CODE.OK)
            .json(
                {
                    message: successMessage,
                    ...actionResult
                }
            );
    } catch (e) {
        if ( e.message.match('^No contract with address') && !retried ) {
            retried = true;
            await arc.fetchAllContracts(false);
            console.log('<--- No contract with address error, updating new arc --->');
            await responseCreateExecutor(action, { req, res, successMessage, errorMessage });
            return;
        }
        
        console.error(e)
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
            .json(
                {
                    error: {
                        commonMessage: errorMessage,
                        errorObject: JSON.stringify(e, null, 4),
                        error: e.toString()
                    },
                    query: req.query
                });
    }
}

module.exports = {
    responseExecutor,
    responseCreateExecutor
};
