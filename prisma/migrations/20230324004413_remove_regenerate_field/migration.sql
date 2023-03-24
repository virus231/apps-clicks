/*
  Warnings:

  - You are about to drop the column `regenerateTitle` on the `Article` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalTitle" TEXT NOT NULL
);
INSERT INTO "new_Article" ("id", "originalTitle") SELECT "id", "originalTitle" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE UNIQUE INDEX "Article_originalTitle_key" ON "Article"("originalTitle");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
