class GenerateAuthToken {
  static getAuthzHeader(req) {
    const header = req.headers.authorization;
    if (!header) {
      return null;
    }
    return header;
  }

  static getToken(authzHeader) {
    const tokenType = authzHeader.substring(0, 6);
    if (tokenType !== 'Basic ') {
      return null;
    }
    return authzHeader.substring(6);
  }

  static decodeToken(token) {
    const decodedToken = Buffer.from(token, 'base64').toString('utf8');
    if (!decodedToken.includes(':')) {
      return null;
    }
    return decodedToken;
  }

  static getCredentials(decodedToken) {
    const [email, password] = decodedToken.split(':');
    if (!email || !password) {
      return null;
    }
    return { email, password };
  }
}

export default GenerateAuthToken;
