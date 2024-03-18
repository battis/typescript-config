#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const parent = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json')).toString()
);

fs.readdirSync(path.join(__dirname, '../packages'), {
  withFileTypes: true
}).forEach((item) => {
  if (item.isDirectory()) {
    const pkgPath = path.join(item.path, item.name, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath).toString());
    pkg.repository = {
      ...parent.repository,
      directory: `packages/${item.name}`
    };
    pkg.homepage = parent.homepage.replace(
      '#',
      `/tree/main/packages/${item.name}#`
    );
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }
});
