import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constants/appErrorCode";
import { UNAUTHORIZED } from "../constants/http";
import { verifyToken } from "../utils/jwt";
import { Types } from "mongoose";

// wrap with catchErrors() if you need this to be async
const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not authorized",
    AppErrorCode.InvalidAccessToken
  );

  const { error, payload } = verifyToken(accessToken);
  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken
  );

  req.userId = payload.userId as Types.ObjectId;
  req.sessionId = payload.sessionId as Types.ObjectId;
  next();
};

export default authenticate;
