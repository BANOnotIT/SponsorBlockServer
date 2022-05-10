BEGIN TRANSACTION;

-- Add primary keys

ALTER TABLE "userNameLogs" ADD "id" SERIAL PRIMARY KEY;
ALTER TABLE "categoryVotes" ADD "id" SERIAL PRIMARY KEY;
ALTER TABLE "sponsorTimes" ADD "id" SERIAL PRIMARY KEY;
ALTER TABLE "config" ADD PRIMARY KEY ("key");
ALTER TABLE "ratings" ADD "id" SERIAL PRIMARY KEY;
ALTER TABLE "tempVipLog" ADD "id" SERIAL PRIMARY KEY;
ALTER TABLE "votes" ADD "id" SERIAL PRIMARY KEY;

UPDATE "config" SET value = 8 WHERE key = 'version';

COMMIT;