-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasSeenOnboarding" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboarded" BOOLEAN NOT NULL DEFAULT false;
