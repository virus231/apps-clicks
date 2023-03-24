/*
  Warnings:

  - You are about to drop the column `title` on the `Article` table. All the data in the column will be lost.
  - Added the required column `originalTitle` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regenerateTitle` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalTitle" TEXT NOT NULL,
    "regenerateTitle" TEXT NOT NULL
);
INSERT INTO "new_Article" ("id") SELECT "id" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE UNIQUE INDEX "Article_originalTitle_key" ON "Article"("originalTitle");
CREATE UNIQUE INDEX "Article_regenerateTitle_key" ON "Article"("regenerateTitle");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
