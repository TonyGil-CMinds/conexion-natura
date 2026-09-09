-- CreateEnum
CREATE TYPE "EventChoice" AS ENUM ('NIGHT', 'AWARD');

-- AlterTable
ALTER TABLE "Attendee" ADD COLUMN     "events" "EventChoice"[];
