-- CreateTable
CREATE TABLE "Permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "permission" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
