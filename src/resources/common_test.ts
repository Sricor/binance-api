import { DigestMessage } from "./common.ts";
import { assertEquals } from "assert_equals";

Deno.test("HMAC SHA-256", async function () {
  assertEquals(
    await DigestMessage.hmacSha256("0.618", "Deno"),
    `a36fa2c116f4063e6d8c811c7334d5fa16391eb249b3c5ebccd862fecd119a37`,
  );
});
