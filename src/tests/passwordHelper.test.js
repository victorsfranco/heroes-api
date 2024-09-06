const assert = require("assert");
const PasswordHelper = require("../helpers/passwordHelper");

const PASSWORD = "Victor@783769443";

describe("Password test suit", function () {
  it("Should generate a hash from a password", async () => {
    const result = await PasswordHelper.hashPassword(PASSWORD);
    assert.ok(result.length > 10);
  });

  it("Should validate a password with a hash", async () => {
    const hash = await PasswordHelper.hashPassword(PASSWORD);
    const result = await PasswordHelper.compare(PASSWORD, hash);
    assert.ok(result);
  });
});
