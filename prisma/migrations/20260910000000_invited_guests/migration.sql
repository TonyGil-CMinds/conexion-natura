-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PENDING', 'CONFIRMED');

-- DropForeignKey
ALTER TABLE "Companion" DROP CONSTRAINT "Companion_attendeeId_fkey";

-- AlterTable
ALTER TABLE "Attendee" DROP COLUMN "bringsCompanion",
ADD COLUMN     "bringsGuest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "inviteSentAt" TIMESTAMP(3),
ADD COLUMN     "inviteToken" TEXT,
ADD COLUMN     "invitedById" TEXT,
ADD COLUMN     "status" "AttendanceStatus" NOT NULL DEFAULT 'CONFIRMED',
ALTER COLUMN "surname" SET DEFAULT '',
ALTER COLUMN "organization" SET DEFAULT '',
ALTER COLUMN "role" SET DEFAULT '';

-- DropTable
DROP TABLE "Companion";

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_inviteToken_key" ON "Attendee"("inviteToken");

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "Attendee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

