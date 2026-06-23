const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);
const boundary = "----testboundary";
const chunks = [
  `--${boundary}\r\nContent-Disposition: form-data; name="setup"\r\n\r\nsingle\r\n`,
  `--${boundary}\r\nContent-Disposition: form-data; name="slot"\r\n\r\nleft\r\n`,
  `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="t.png"\r\nContent-Type: image/png\r\n\r\n`,
  png,
  `\r\n--${boundary}--\r\n`,
];
const body = Buffer.concat(chunks.map((c) => (Buffer.isBuffer(c) ? c : Buffer.from(c))));

fetch("http://localhost:3001/api/design-upload", {
  method: "POST",
  headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` },
  body,
})
  .then(async (r) => {
    console.log("status", r.status);
    console.log(await r.text());
  })
  .catch((e) => console.error(e));
