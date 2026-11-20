import assert from "node:assert/strict";
import {test} from "node:test";
import {verificationInputFromScan} from "./scan-input.ts";
const id=`0x${"a".repeat(64)}`;
test("passport QR codes resolve to an internal item identity",()=>{
 assert.deepEqual(verificationInputFromScan(`https://app.trueorigin.com/items/${id}`),{query:id});
 assert.deepEqual(verificationInputFromScan(`https://app.trueorigin.com/registry/${id}`),{query:id});
 assert.deepEqual(verificationInputFromScan(`/registry/${id}`),{query:id});
 assert.deepEqual(verificationInputFromScan(id.toUpperCase().replace("0X","0x")),{query:id});
});
test("certification numbers and PSA verification links use the existing lookup",()=>{
 assert.deepEqual(verificationInputFromScan("12345678"),{query:"12345678"});
 assert.deepEqual(verificationInputFromScan("BGS-123456"),{query:"BGS-123456"});
 assert.deepEqual(verificationInputFromScan("https://www.psacard.com/cert/12345678/psa"),{query:"12345678",certifier:"PSA"});
});
test("unrelated or unsafe QR payloads never become navigation targets",()=>{
 for(const value of ["javascript:alert(1)","https://example.com/","https://psacard.com.evil.test/cert/12345678","data:text/html,hello","", "x".repeat(2049)]) assert.equal(verificationInputFromScan(value),null);
});
