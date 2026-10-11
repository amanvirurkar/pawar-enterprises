const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // TODO: Replace with Firebase Admin token verification
      // const decodedToken = await admin.auth().verifyIdToken(token);
      // req.admin = decodedToken;
      
      // Temporary pass-through until Firebase is implemented
      req.admin = { id: 'firebase-placeholder-id' };
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };
