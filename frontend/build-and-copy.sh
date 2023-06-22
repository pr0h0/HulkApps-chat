npm run build;

cp dist/index.html ../backend/views/index.ejs;
rm dist/index.html;

rm ../backend/public/assets/index*.js;
rm ../backend/public/assets/index*.css;
cp -r dist/* ../backend/public/;

rm -rf dist;