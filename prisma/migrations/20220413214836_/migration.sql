-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "permission" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Permissions" ("id", "permission", "userId") SELECT "id", "permission", "userId" FROM "Permissions";
DROP TABLE "Permissions";
ALTER TABLE "new_Permissions" RENAME TO "Permissions";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
