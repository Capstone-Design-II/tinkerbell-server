const formatResponse = (status, script) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      status,
      script,
    }),
  };

  return response;
}

const generateErrorResponse = (message) => {
  const response = {
    statusCode: 400,
    body: JSON.stringify({ message }),
    isBase64Encoded: false,
  }

  return response;
}

export const handler = async (event, context) => {
  const { uuid } = event.pathParameters;

  if (uuid) {
    // TODO: get generated script from db
    const status = 'success';
    const script = 'sample script';
    const response = formatResponse(status, script);
    return response;
  }

  const errorMessage = 'Invalid request body';
  const response = generateErrorResponse(errorMessage);
  return response;
};
