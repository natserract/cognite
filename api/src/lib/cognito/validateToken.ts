
const COGNITO_REGION = process.env.AWS_REGION
const COGNITO_POOL_ID = process.env.AWS_POOL_ID
const COGNITO_CLIENT_ID = process.env.AWS_CLIENT_ID

// See: https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
// Format: https://cognito-idp.{region}.amazonaws.com/{userPoolId}
const jwtIssuer = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_POOL_ID}`
const jwtAudience = COGNITO_CLIENT_ID

// See: https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
const jwtVerifyOptions = {
  algorithms: ['RS256'],
  issuer: [jwtIssuer],
  audience: [jwtAudience, /^undefined$/],
}
