import jwt from "jsonwebtoken";

export const verifyTokenGuard = async (req, res, next) => {
  try {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const payload = jwt.verify(token, process.env.FORGOT_TOKEN_SECRET);

    req.user = payload;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

const invalid = async (res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.ENVIRONMENT !== "DEV",
    sameSite: process.env.ENVIRONMENT === "DEV" ? "lax" : "none",
    path: "/",
  });

  res.status(401).json({ message: "Unauthorized" });
};

export const AdminUserGuard = async (req, res, next) => {
  console.log("AdminUserGuard: Checking for authToken...");
  try {
    const { authToken } = req.cookies;

    if (!authToken) {
      console.log("AdminUserGuard: No authToken found!");
      return invalid(res);
    }
    const payload = await jwt.verify(authToken, process.env.AUTH_SECRET);

    if (payload.role !== "user" && payload.role !== "admin") {
      console.log("AdminUserGuard: Invalid role:", payload.role);
      return invalid(res);
    }

    req.user = payload;
    console.log("AdminUserGuard: Auth successful for user:", payload.email);
    
    next();
  } catch (err) {
    console.log("AdminUserGuard: Error verifying token:", err.message);
    return invalid(res);
  }
};

export const AdminOnlyGuard = async (req, res, next) => {
  try {
    const { authToken } = req.cookies;

    if (!authToken) {
      return invalid(res);
    }
    const payload = await jwt.verify(authToken, process.env.AUTH_SECRET);

    if (payload.role !== "admin")
      return invalid(res);

    req.user = payload;
    
    next();
  } catch (err) {
    return invalid(res);
  }
};
