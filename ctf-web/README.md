To operate the web server, you need to install the following software:
pgsql
nodejs 18.16.0 (as root)
chromium-browser (as root)

ideally, you should install the following software:
forever (as root)


You need to build the client, and transfer the files to the server.
```bash
cd ctf-web/client
npm install
npm run build
mv dist/tbhacked ../server
```
