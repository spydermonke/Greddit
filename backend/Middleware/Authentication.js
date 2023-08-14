import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  
   const router = express.Router();
   
   
   let token = req.header("Authorization");

   if (!token) {
     return res.status(403).send("Access Denied");
     // probably change this line to redirect to authentication
    }
    
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    // if on somepace make cases to redirect if true
    
    
    // console.log(datas)
    
    next();

    
  }