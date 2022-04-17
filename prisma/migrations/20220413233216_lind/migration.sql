/*
  Warnings:

  - You are about to drop the column `userId` on the `RefreshToken` table. All the data in the column will be lost.
  - Added the required column `userid` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresIn" INTEGER NOT NULL,
    "userid" TEXT NOT NULL,
    CONSTRAINT "RefreshToken_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RefreshToken" ("expiresIn", "id") SELECT "expiresIn", "id" FROM "RefreshToken";
DROP TABLE "RefreshToken";
ALTER TABLE "new_RefreshToken" RENAME TO "RefreshToken";
CREATE UNIQUE INDEX "RefreshToken_userid_key" ON "RefreshToken"("userid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
