const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");
const createRequireAuth = require("./routes/auth/auth");
const createCandidateRouter = require("./routes/candidate/candidate");
const createRecruiterRouter = require("./routes/recruiter/recruiter");

dotenv.config();

if (!process.env.SUPABASE_URL) {
  throw new Error("Missing SUPABASE_URL in .env");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env");
}

const app = express();

const allowedOrigins = ["http://localhost:3000"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })

);
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  db: { schema: "whitecarrot" },
});

const requireAuth = createRequireAuth(supabase);
app.use("/api/public", createCandidateRouter({ supabase }));
app.use("/api/recruiter", createRecruiterRouter({ supabase, requireAuth }));

app.get("/health", (_, res) => res.json({ ok: true }));

app.listen(process.env.PORT || 9000, () => {
  console.log(`API running on :${process.env.PORT || 9000}`);
});
