import { HttpClient } from "./client.ts";
import { assertEquals } from "assert_equals";

const baseUrl = "localhost:3000";
const httpClient = new HttpClient({ baseUrl: baseUrl });

Deno.test("url encode with one argument", function () {
  assertEquals(httpClient.urlEncode({ email: "example@email.com" }), `?email=example%40email.com`);
  assertEquals(httpClient.urlEncode({ arg: "Hello World!" }), `?arg=Hello%20World!`);
  assertEquals(
    httpClient.urlEncode({ arg: "你好，世界！" }),
    `?arg=%E4%BD%A0%E5%A5%BD%EF%BC%8C%E4%B8%96%E7%95%8C%EF%BC%81`,
  );
});

Deno.test("url encode with many arguments", function () {
  assertEquals(
    httpClient.urlEncode({
      arg: "Hello World!",
      arg1: 6.1024,
      arg2: false,
    }),
    `?arg=Hello%20World!&arg1=6.1024&arg2=false`,
  );
});
