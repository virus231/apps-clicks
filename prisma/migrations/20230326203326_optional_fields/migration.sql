-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalTitle" TEXT,
    "regenerateTitle" TEXT,
    "description" TEXT
);
INSERT INTO "new_Article" ("description", "id", "originalTitle", "regenerateTitle") SELECT "description", "id", "originalTitle", "regenerateTitle" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE UNIQUE INDEX "Article_originalTitle_key" ON "Article"("originalTitle");
CREATE UNIQUE INDEX "Article_regenerateTitle_key" ON "Article"("regenerateTitle");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
