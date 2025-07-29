-- DropForeignKey
ALTER TABLE "cctvs" DROP CONSTRAINT "cctvs_cityId_fkey";

-- AddForeignKey
ALTER TABLE "cctvs" ADD CONSTRAINT "cctvs_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
