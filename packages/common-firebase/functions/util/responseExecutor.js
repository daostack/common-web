const HTTP_STATUS_CODE = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
}

const responseExecutor = async (action, { req, res, successMessage, errorMessage }) => {
    try {
        const actionResult = await action();
        res.status(HTTP_STATUS_CODE.OK)
            .json(
                {
                    message: successMessage,
                    data: actionResult
                }
            );
    } catch (e) {
        console.error(e)
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
            .json(
                {
                    error: {
                        commonMessage: errorMessage,
                        errorObject: JSON.stringify(e, null, 4)
                    },
                    query: req.query
                });
    }
}

module.exports = {
    responseExecutor
};
