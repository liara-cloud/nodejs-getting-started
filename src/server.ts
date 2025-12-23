import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });
const app = express();

function createRandomUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });

  return {
    name: `${firstName} ${lastName}`,
    email,
  };
}

app.get("/", async (req: Request, res: Response) => {
  try {
    const randomUser = createRandomUser();
    const user = await prisma.user.create({
      data: randomUser,
    });

    res.json({
      success: true,
      user,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
