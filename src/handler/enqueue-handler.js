const uuidv4 = require('uuid/v4');

const generateUUID = () => {
  return uuidv4();
};

const generateOKResponse = (uuid) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Successfully enqueued',
      uuid,
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
  const body = JSON.parse(event.body);

  if (body) {
    const uuid = generateUUID();
    // TODO: initiate worker lambda
    const response = generateOKResponse(uuid);
    return response;
  }

  const errorMessage = 'Invalid request body';
  const response = generateErrorResponse(errorMessage);
  return response;
};
