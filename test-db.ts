import {prisma} from "./lib/Prisma";

async function main() {
  console.log("🚀 Checking MySQL connection...");

  try {
    // Attempt to create a test user
    const user = await prisma.user.create({
      data: {
        name: "Manual Test",
        email: `test-${Date.now()}@example.com`,
      },
    });

    console.log("✅ SUCCESS! User created with ID:", user.id);
  } catch (error: any) {
    console.error("❌ DATABASE ERROR:");
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();