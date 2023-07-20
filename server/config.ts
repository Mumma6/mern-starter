import MongoStore from "connect-mongo"

export const rateLimitOptions = {
  windowMs: 1 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
}

export const corsOptions = {
  origin: [`https://${process.env.HOST}`, `http://${process.env.HOST}`, `${process.env.HOST}`],
  methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
  credentials: true,
}

export const sessionOptions = {
  // Used to compute a hash
  secret: process.env.SESSION_KEY!,
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true } when using HTTPS
  // Store session on DB
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || "",
  }),
}
