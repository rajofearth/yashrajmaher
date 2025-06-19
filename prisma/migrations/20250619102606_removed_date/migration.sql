/*
  Warnings:

  - You are about to drop the column `date` on the `Post` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "featuredImage" TEXT,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "website" TEXT,
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Post" ("author", "authorImage", "content", "createdAt", "description", "featuredImage", "id", "slug", "status", "tags", "title", "updatedAt", "website") SELECT "author", "authorImage", "content", "createdAt", "description", "featuredImage", "id", "slug", "status", "tags", "title", "updatedAt", "website" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
