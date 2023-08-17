1)npm init -y  => for node pakages 
2)npm i express .....
3) npm install typescript 
4) npx tsc --init 
5) npm i @types/node @types/express ......

6)in ts config uncomment the outDir file and put dist in it for js files etc 
7) npx tsc => to create the dist file 
8)install nodemon for auto refresh the code

9)in pakage.json inside script add these lines
i)    "build": "npx tsc",
ii)   "start": "node dist/app.js",
iii)  "dev": "npx tsc -w & nodemon dist/app.js"

10) but fro better experience and cross palteform compatibility we should use 2 more  pakages rimraf and cuncurrently
rimraf deletes un nessory files from dist and we will restart it again with cuncurrently for cunncerent
 i)    "build": "rimraf dist && npx tsc",
 
 note the pre start and predev will first delete the un nessory files and re run it again auto.

ii)   "prestart": "npm run build",
ii)   "start": "node dist/app.js",
dev mode 
ii)   "predev": "npm run build",
iii)  "dev": "concurrently  \"npx tsc -w\"  \"nodemon dist/app.js\" "