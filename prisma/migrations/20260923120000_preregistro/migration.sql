-- AlterEnum
ALTER TYPE "AttendanceStatus" ADD VALUE 'WAITLIST';

-- AlterTable
ALTER TABLE "Attendee" ADD COLUMN     "inviteeId" TEXT,
ADD COLUMN     "waitlistSentAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Invitee" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT '',
    "organization" TEXT NOT NULL DEFAULT '',
    "sector" TEXT NOT NULL DEFAULT '',
    "topic" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitee_email_key" ON "Invitee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_inviteeId_key" ON "Attendee"("inviteeId");

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "Invitee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

