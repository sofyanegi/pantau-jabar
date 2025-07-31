-- CreateTable
CREATE TABLE "favorites" (
    "userId" TEXT NOT NULL,
    "cctvId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("userId","cctvId")
);

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_cctvId_fkey" FOREIGN KEY ("cctvId") REFERENCES "cctvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
