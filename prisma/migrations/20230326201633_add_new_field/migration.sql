/*
  Warnings:

  - Added the required column `description` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalTitle" TEXT NOT NULL,
    "regenerateTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL
);
INSERT INTO "new_Article" ("id", "originalTitle", "regenerateTitle") SELECT "id", "originalTitle", "regenerateTitle" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE UNIQUE INDEX "Article_originalTitle_key" ON "Article"("originalTitle");
CREATE UNIQUE INDEX "Article_regenerateTitle_key" ON "Article"("regenerateTitle");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
