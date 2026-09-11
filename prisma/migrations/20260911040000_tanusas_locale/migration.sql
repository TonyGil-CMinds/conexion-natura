
-- AlterTable
ALTER TABLE "TanusasRegistration" ADD COLUMN     "confirmationSentAt" TIMESTAMP(3),
ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'es';

