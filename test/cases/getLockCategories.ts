import fetch from "node-fetch";
import {Done, getbaseURL} from "../utils";
import {getHash} from "../../src/utils/getHash";
import {db} from "../../src/databases/databases";
import assert from "assert";


describe("getLockCategories", () => {
    before(async () => {
        const insertVipUserQuery = 'INSERT INTO "vipUsers" ("userID") VALUES (?)';
        await db.prepare("run", insertVipUserQuery, [getHash("VIPUser-getLockCategories")]);

        const insertLockCategoryQuery = 'INSERT INTO "lockCategories" ("userID", "videoID", "category") VALUES (?, ?, ?)';
        await db.prepare("run", insertLockCategoryQuery, [getHash("VIPUser-getLockCategories"), "getLock-1", "sponsor"]);
        await db.prepare("run", insertLockCategoryQuery, [getHash("VIPUser-getLockCategories"), "getLock-1", "interaction"]);

        await db.prepare("run", insertLockCategoryQuery, [getHash("VIPUser-getLockCategories"), "getLock-2", "preview"]);

        await db.prepare("run", insertLockCategoryQuery, [getHash("VIPUser-getLockCategories"), "getLock-3", "nonmusic"]);
    });

    it("Should update the database version when starting the application", async () => {
        const version = (await db.prepare("get", "SELECT key, value FROM config where key = ?", ["version"])).value;
        if (version > 1) return;
        else return `Version isn't greater than 1. Version is ${version}`;
    });

    it("Should be able to get multiple locks", (done: Done) => {
        fetch(`${getbaseURL()}/api/lockCategories?videoID=getLock-1`)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const data = await res.json();
                const expected = {
                    categories: [
                        "sponsor",
                        "interaction"
                    ]
                };
                assert.deepStrictEqual(data, expected);
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get single locks", (done: Done) => {
        fetch(`${getbaseURL()}/api/lockCategories?videoID=getLock-2`)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const data = await res.json();
                const expected = {
                    categories: [
                        "preview"
                    ]
                };
                assert.deepStrictEqual(data, expected);
                done();
            })
            .catch(err => done(err));
    });

    it("should return 404 if no lock exists", (done: Done) => {
        fetch(`${getbaseURL()}/api/lockCategories?videoID=getLock-0`)
            .then(res => {
                assert.strictEqual(res.status, 404);
                done();
            })
            .catch(err => done(err));
    });

    it("should return 400 if no videoID specified", (done: Done) => {
        fetch(`${getbaseURL()}/api/lockCategories`)
            .then(res => {
                assert.strictEqual(res.status, 400);
                done();
            })
            .catch(err => done(err));
    });
});
